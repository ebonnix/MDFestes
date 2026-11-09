import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { LogoutButton, PlowShell, SERVICE_OPTIONS, Spinner, fmtTime, todayDenver, usePlowGuard, type ServiceId } from "@/plow/PlowShell";
import PlowMap, { type MapMarker } from "@/plow/PlowMap";
import { distanceMeters, fmtCoord, fmtDistance, geolocationSupported, getDeviceFix, locationPermission, navigateRouteUrl, navigateUrl, watchPosition, type Fix } from "@/plow/geo";
import { stampPhoto } from "@/plow/stamp";
import { proofQueue, type QueuedProof } from "@/plow/queue";
import { DirectionsPanel, useInAppDirections } from "@/plow/DirectionsPanel";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../server/routers";
type RouteData = inferRouterOutputs<AppRouter>["plow"]["routes"]["mine"];
type Stop = RouteData["stops"][number];

const SKIP_REASONS = ["Car blocking driveway", "Gate locked / no access", "Not enough snow", "Customer asked to skip", "Road closed", "Equipment issue", "Other"];

export default function PlowDriver() {
  const me = usePlowGuard();
  const utils = trpc.useUtils();
  const [date, setDate] = useState(todayDenver());
  const route = trpc.plow.routes.mine.useQuery({ date }, { enabled: !!me.data, refetchInterval: 30000 });
  const dates = trpc.plow.routes.myDates.useQuery(undefined, { enabled: !!me.data });
  const refresh = useCallback(() => utils.plow.routes.mine.invalidate({ date }), [utils, date]);

  const start = trpc.plow.routes.start.useMutation({ onSuccess: refresh });
  const finish = trpc.plow.routes.finish.useMutation({ onSuccess: refresh });
  const arrive = trpc.plow.stops.arrive.useMutation({ onSuccess: refresh });
  const enRoute = trpc.plow.stops.enRoute.useMutation({ onSuccess: refresh });
  const complete = trpc.plow.stops.complete.useMutation({ onSuccess: refresh });
  const skip = trpc.plow.stops.skip.useMutation({ onSuccess: refresh });
  const reopen = trpc.plow.stops.reopen.useMutation({ onSuccess: refresh });
  const ping = trpc.plow.tracking.ping.useMutation();
  const submitProof = trpc.plow.proofs.submit.useMutation();
  const resendProof = trpc.plow.proofs.resend.useMutation();

  // ---- Location: permission + live tracking ----
  const [perm, setPerm] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
  const [here, setHere] = useState<Fix | null>(null);
  const lastPing = useRef(0);
  useEffect(() => {
    locationPermission().then(setPerm);
  }, []);
  const routeActive = route.data?.route?.status === "active";
  useEffect(() => {
    if (!me.data || perm === "denied") return;
    const stop = watchPosition(
      f => {
        setHere(f);
        setPerm("granted");
        if (routeActive && Date.now() - lastPing.current > 30000) {
          lastPing.current = Date.now();
          ping.mutate({ lat: f.lat, lng: f.lng });
        }
      },
      e => {
        if (e.code === 1) setPerm("denied");
      },
    );
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.data, perm === "denied", routeActive]);

  async function enableLocation() {
    const f = await getDeviceFix();
    if (f) {
      setHere(f);
      setPerm("granted");
    } else setPerm(await locationPermission());
  }

  // ---- In-app directions ----
  const nav = useInAppDirections(here);
  const mapRef = useRef<HTMLDivElement>(null);
  function navigateInApp(s: Stop) {
    const p = s.property;
    if (p.lat == null || p.lng == null) {
      window.open(navigateUrl(p), "_blank");
      return;
    }
    if (s.status === "pending") enRoute.mutate({ stopId: s.id });
    nav.navigateTo({ lat: p.lat, lng: p.lng, address: p.address, label: p.ownerName });
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---- Offline queue ----
  const [queued, setQueued] = useState(0);
  const flushing = useRef(false);
  const flushQueue = useCallback(async () => {
    if (flushing.current || !navigator.onLine) return;
    flushing.current = true;
    try {
      const items = await proofQueue.all();
      for (const it of items) {
        try {
          await submitProof.mutateAsync(it.payload);
          await proofQueue.remove(it.id);
        } catch (e) {
          console.warn("[queue] still failing", e);
          break;
        }
      }
    } finally {
      flushing.current = false;
      setQueued(await proofQueue.count());
      refresh();
    }
  }, [submitProof, refresh]);
  useEffect(() => {
    proofQueue.count().then(setQueued);
    flushQueue();
    window.addEventListener("online", flushQueue);
    return () => window.removeEventListener("online", flushQueue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Camera / proof flow ----
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingShot = useRef<{ stop: Stop; kind: "before" | "after" } | null>(null);
  const [shot, setShot] = useState<null | {
    stop: Stop;
    kind: "before" | "after";
    dataUrl: string;
    base64: string;
    fix: Fix | null;
    distance: number | null;
    note: string;
    busy: boolean;
    error?: string;
  }>(null);
  const [stamping, setStamping] = useState(false);

  function takePhoto(stop: Stop, kind: "before" | "after") {
    pendingShot.current = { stop, kind };
    fileRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const ctx = pendingShot.current;
    if (!file || !ctx || !me.data) return;
    setStamping(true);
    try {
      // 1) device GPS  2) property coords  3) manual
      let fix = await getDeviceFix();
      const prop = ctx.stop.property;
      if (!fix && prop.lat != null && prop.lng != null) {
        fix = { lat: prop.lat, lng: prop.lng, accuracyM: null, source: "property", at: new Date() };
      }
      if (!fix) {
        const typed = prompt("GPS unavailable. Enter coordinates as lat, lng (or leave blank):", "");
        const m = typed?.match(/(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/);
        if (m) fix = { lat: parseFloat(m[1]), lng: parseFloat(m[3]), accuracyM: null, source: "manual", at: new Date() };
      }
      const when = new Date();
      const stamped = await stampPhoto(file, {
        address: prop.address,
        lat: fix?.lat ?? null,
        lng: fix?.lng ?? null,
        when,
        driverName: me.data.name,
        locationSource: fix?.source,
        accuracyM: fix?.accuracyM,
      });
      const distance = fix && fix.source === "gps" && prop.lat != null && prop.lng != null ? distanceMeters(fix, { lat: prop.lat, lng: prop.lng }) : null;
      setShot({ stop: ctx.stop, kind: ctx.kind, dataUrl: stamped.dataUrl, base64: stamped.base64, fix: { ...(fix ?? { lat: 0, lng: 0, accuracyM: null, source: "manual" as const }), at: when }, distance, note: "", busy: false });
      if (!fix) setShot(s => (s ? { ...s, fix: null } : s));
    } catch (err) {
      alert("Could not process the photo: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setStamping(false);
    }
  }

  async function uploadShot() {
    if (!shot) return;
    setShot({ ...shot, busy: true, error: undefined });
    const payload: QueuedProof["payload"] = {
      stopId: shot.stop.id,
      propertyId: shot.stop.propertyId,
      kind: shot.kind,
      imageBase64: shot.base64,
      lat: shot.fix?.lat ?? null,
      lng: shot.fix?.lng ?? null,
      accuracyM: shot.fix?.accuracyM ?? null,
      locationSource: shot.fix?.source ?? "manual",
      capturedAt: (shot.fix?.at ?? new Date()).toISOString(),
      note: shot.note || undefined,
      notifyOwnerNow: true,
    };
    try {
      const res = await submitProof.mutateAsync(payload);
      setShot(null);
      refresh();
      const d = res.delivery;
      const parts = [d.email && `email ${d.email}`, d.sms && d.sms !== "not configured" && `text ${d.sms}`].filter(Boolean);
      if (shot.kind === "after") toast(parts.length ? `Proof saved · ${parts.join(" · ")}` : "Proof saved");
      else toast("Before photo saved");
    } catch (e) {
      // Offline or server hiccup → queue it so nothing is lost
      if (!navigator.onLine || (e instanceof Error && /fetch|network/i.test(e.message))) {
        await proofQueue.add({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, createdAt: Date.now(), payload, address: shot.stop.property.address });
        setQueued(await proofQueue.count());
        setShot(null);
        toast("No signal — photo queued, will upload automatically");
      } else {
        setShot({ ...shot, busy: false, error: e instanceof Error ? e.message : String(e) });
      }
    }
  }

  // ---- Complete / skip dialogs ----
  const [completing, setCompleting] = useState<Stop | null>(null);
  const [skipping, setSkipping] = useState<Stop | null>(null);
  const [sending, setSending] = useState<Stop | null>(null);

  // ---- tiny toast ----
  const [msg, setMsg] = useState<string | null>(null);
  function toast(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(null), 4500);
  }

  // ---- derived ----
  const stops = route.data?.stops ?? [];
  const doneCount = stops.filter(s => s.status === "done").length;
  const nextStop = stops.find(s => s.status !== "done" && s.status !== "skipped");
  const markers = useMemo<MapMarker[]>(() => {
    const m: MapMarker[] = stops
      .filter(s => s.property?.lat != null && s.property?.lng != null)
      .map((s, i) => ({ id: s.id, lat: s.property.lat!, lng: s.property.lng!, label: String(i + 1), title: s.property.address, kind: s.status === "done" ? "done" : "stop" }));
    if (here) m.push({ id: "me", lat: here.lat, lng: here.lng, label: "ME", kind: "me", title: "You" });
    return m;
  }, [stops, here]);
  const path = useMemo(() => stops.filter(s => s.property?.lat != null).map(s => ({ lat: s.property.lat!, lng: s.property.lng! })), [stops]);

  if (me.isLoading || !me.data) {
    return (
      <PlowShell title="Driver">
        <div className="flex justify-center py-20"><Spinner /></div>
      </PlowShell>
    );
  }

  return (
    <PlowShell title="My route" right={<><span className="text-sm hidden sm:inline" style={{ color: "var(--p-gray-400)" }}>{me.data.name}</span><LogoutButton /></>}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-28 space-y-4">
        {/* Location banner */}
        {perm !== "granted" && (
          <div className="p-card flex items-center gap-3" style={{ borderColor: "var(--p-orange)" }}>
            <div className="flex-1 text-sm">
              <div className="font-semibold">Turn on location</div>
              <div style={{ color: "var(--p-gray-400)" }}>
                {!geolocationSupported()
                  ? "This browser has no GPS. Photos will use the property's location."
                  : perm === "denied"
                    ? "Location is blocked. Allow it in your phone's browser settings (Settings → Safari/Chrome → Location) so proof photos carry your GPS position."
                    : "Needed to stamp GPS onto proof photos and show your position on the map."}
              </div>
            </div>
            {geolocationSupported() && perm !== "denied" && <button className="p-btn p-btn-primary p-btn-sm" onClick={enableLocation}>Enable</button>}
          </div>
        )}
        {queued > 0 && (
          <div className="p-card flex items-center gap-3 text-sm" style={{ borderColor: "var(--p-yellow)" }}>
            <span className="p-pill p-pill-yellow">{queued}</span>
            <span className="flex-1">photo{queued > 1 ? "s" : ""} waiting for signal</span>
            <button className="p-btn p-btn-ghost p-btn-sm" onClick={flushQueue}>Retry now</button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="p-label">Service date</div>
            <select className="p-select" style={{ width: "auto", padding: "6px 10px" }} value={date} onChange={e => setDate(e.target.value)}>
              {![...(dates.data ?? [])].some(d => d.serviceDate === todayDenver()) && <option value={todayDenver()}>{todayDenver()} (today)</option>}
              {(dates.data ?? []).map(d => (
                <option key={d.serviceDate} value={d.serviceDate}>{d.serviceDate}{d.serviceDate === todayDenver() ? " (today)" : ""} · {d.status}</option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <div className="p-label">Progress</div>
            <div className="text-2xl p-mono">{doneCount}<span style={{ color: "var(--p-gray-400)" }}>/{stops.length}</span></div>
          </div>
        </div>

        {route.isLoading && <div className="flex justify-center py-10"><Spinner /></div>}

        {route.data && !route.data.route && (
          <div className="p-card text-center py-10">
            <div className="text-lg font-semibold">No route assigned for {date}</div>
            <p className="text-sm mt-1" style={{ color: "var(--p-gray-400)" }}>Your dispatcher hasn't assigned addresses yet. Pull down to refresh or pick another date.</p>
          </div>
        )}

        {route.data?.route && (
          <>
            {/* Map */}
            <div ref={mapRef} className="p-card" style={{ padding: 0, height: nav.target ? 380 : 280, overflow: "hidden", scrollMarginTop: 64 }}>
              <PlowMap markers={markers} path={nav.target ? undefined : path} fitKey={`${date}-${stops.length}`} directions={nav.directions} onDirections={nav.onDirections} />
            </div>
            <DirectionsPanel nav={nav} />

            {/* Route controls */}
            <div className="flex gap-2">
              {route.data.route.status === "planned" && (
                <button className="p-btn p-btn-primary flex-1" disabled={start.isPending} onClick={() => start.mutate({ routeId: route.data!.route!.id })}>▶ Start route</button>
              )}
              {route.data.route.status === "active" && (
                <button className="p-btn p-btn-green flex-1" disabled={finish.isPending} onClick={() => confirm(`Finish route? ${stops.length - doneCount} stop(s) not done.`) && finish.mutate({ routeId: route.data!.route!.id })}>✓ Finish route</button>
              )}
              {route.data.route.status === "done" && <div className="p-btn p-btn-ghost flex-1" style={{ cursor: "default" }}>Route finished {fmtTime(route.data.route.finishedAt)}</div>}
              <a className="p-btn p-btn-blue" href={navigateRouteUrl(stops.filter(s => s.status !== "done" && s.status !== "skipped").map(s => s.property))} target="_blank" rel="noreferrer">🧭 Navigate all</a>
            </div>

            {/* Stops */}
            <ol className="space-y-3">
              {stops.map((s, i) => {
                const p = s.property;
                const dist = here && p.lat != null && p.lng != null ? distanceMeters(here, { lat: p.lat, lng: p.lng }) : null;
                const isNext = nextStop?.id === s.id;
                const afterProofs = s.proofs.filter(x => x.kind === "after");
                const beforeProofs = s.proofs.filter(x => x.kind === "before");
                return (
                  <li key={s.id} className="p-card" style={isNext ? { borderColor: "var(--p-orange)", boxShadow: "0 0 0 1px var(--p-orange)" } : undefined}>
                    <div className="flex items-start gap-3">
                      <span className={`p-stop-num ${s.status}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-lg leading-tight">{p.ownerName}</span>
                          {p.priority === 1 && <span className="p-pill p-pill-red">High</span>}
                          <span className={`p-pill ${s.status === "done" ? "p-pill-green" : s.status === "arrived" || s.status === "en_route" ? "p-pill-orange" : ""}`}>{s.status.replace("_", " ")}</span>
                        </div>
                        <div className="text-sm">{p.address}</div>
                        <div className="text-xs mt-1 flex flex-wrap gap-x-3" style={{ color: "var(--p-gray-400)" }}>
                          <span>{(p.services || "plow").split(",").join(" · ")}</span>
                          {dist != null && <span className="p-mono">{fmtDistance(dist)} away</span>}
                          {s.arrivedAt && <span>arrived {fmtTime(s.arrivedAt)}</span>}
                          {s.completedAt && <span>done {fmtTime(s.completedAt)}</span>}
                        </div>
                        {p.gateCode && <div className="text-sm mt-1"><span className="p-label">Access:</span> <span className="p-mono">{p.gateCode}</span></div>}
                        {p.notes && <div className="text-sm mt-1 p-2 rounded" style={{ background: "rgba(255,196,0,.12)", borderLeft: "3px solid var(--p-yellow)" }}>{p.notes}</div>}
                        {s.skipReason && <div className="text-sm mt-1" style={{ color: "var(--p-gray-400)" }}>Skipped: {s.skipReason}</div>}
                        {(beforeProofs.length > 0 || afterProofs.length > 0) && (
                          <div className="flex gap-2 mt-2">
                            {[...beforeProofs, ...afterProofs].map(pr => (
                              <a key={pr.id} href={pr.photoUrl} target="_blank" rel="noreferrer" className="relative">
                                <img src={pr.photoUrl} alt={pr.kind} className="w-16 h-16 object-cover rounded" />
                                <span className="p-pill absolute bottom-0 left-0" style={{ fontSize: 9 }}>{pr.kind}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {s.status !== "done" && s.status !== "skipped" && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button className="p-btn p-btn-blue" onClick={() => navigateInApp(s)}>🧭 Navigate</button>
                        {s.status !== "arrived" ? (
                          <button className="p-btn p-btn-dark" disabled={arrive.isPending} onClick={() => arrive.mutate({ stopId: s.id })}>📍 I'm here</button>
                        ) : (
                          <button className="p-btn p-btn-ghost" onClick={() => takePhoto(s, "before")}>📷 Before photo</button>
                        )}
                        <button className="p-btn p-btn-primary col-span-2 p-btn-xl" disabled={stamping} onClick={() => takePhoto(s, "after")}>
                          {stamping ? <Spinner /> : <>📸 Prove it's plowed</>}
                        </button>
                        <button className="p-btn p-btn-green" disabled={!afterProofs.length} title={!afterProofs.length ? "Take the proof photo first" : ""} onClick={() => setCompleting(s)}>✓ Complete</button>
                        <button className="p-btn p-btn-dark" disabled={!afterProofs.length} title={!afterProofs.length ? "Take the proof photo first" : ""} onClick={() => setSending(s)}>✉ Send proof</button>
                        <button className="p-btn p-btn-ghost col-span-2" onClick={() => setSkipping(s)}>Skip this stop</button>
                      </div>
                    )}
                    {(s.status === "done" || s.status === "skipped") && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => takePhoto(s, "after")}>📸 Add photo</button>
                        {afterProofs.length > 0 && <button className="p-btn p-btn-dark p-btn-sm" onClick={() => setSending(s)}>✉ Send proof</button>}
                        <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => reopen.mutate({ stopId: s.id })}>Reopen</button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </main>

      {/* Sticky "next stop" navigation bar */}
      {route.data?.route && route.data.route.status !== "done" && nextStop && !shot && !completing && !skipping && !sending && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-2" style={{ background: "linear-gradient(to top, var(--p-ink-900) 70%, transparent)" }}>
          <button
            className="p-btn p-btn-blue p-btn-xl max-w-2xl mx-auto"
            style={{ justifyContent: "space-between" }}
            onClick={() => navigateInApp(nextStop)}
          >
            <span className="text-left leading-tight">
              <span className="block text-xs uppercase tracking-wider opacity-80">Navigate to next · stop {stops.indexOf(nextStop) + 1} of {stops.length}</span>
              <span className="block font-bold truncate" style={{ maxWidth: "70vw" }}>{nextStop.property.address}</span>
            </span>
            <span className="text-2xl">🧭</span>
          </button>
        </div>
      )}

      {/* Photo preview / confirm */}
      {shot && (
        <Modal onClose={() => !shot.busy && setShot(null)}>
          <div className="p-label mb-1">{shot.kind === "after" ? "Proof of service" : "Before photo"} · stamped</div>
          <img src={shot.dataUrl} alt="stamped" className="w-full rounded" />
          <div className="text-xs p-mono mt-2 space-y-0.5" style={{ color: "var(--p-gray-400)" }}>
            <div>{shot.stop.property.address}</div>
            <div>
              {shot.fix ? fmtCoord(shot.fix.lat, shot.fix.lng) : "no coordinates"}
              {shot.fix?.source === "gps" && shot.fix.accuracyM != null && ` ±${Math.round(shot.fix.accuracyM)} m`}
              {shot.fix?.source === "property" && " (property location — GPS unavailable)"}
              {shot.fix?.source === "manual" && " (entered manually)"}
            </div>
            <div>{(shot.fix?.at ?? new Date()).toLocaleString("en-US", { timeZone: "America/Denver" })} · {me.data.name}</div>
          </div>
          {shot.distance != null && shot.distance > 150 && (
            <div className="mt-2 text-sm p-2 rounded" style={{ background: "rgba(218,58,43,.15)", color: "var(--p-red)" }}>
              ⚠ You're {fmtDistance(shot.distance)} from this property's pin. Make sure you're at the right address (or the pin may be off).
            </div>
          )}
          <textarea className="p-textarea mt-3" rows={2} placeholder="Note for the owner / office (optional)" value={shot.note} onChange={e => setShot({ ...shot, note: e.target.value })} />
          {shot.error && <p className="text-sm mt-2" style={{ color: "var(--p-red)" }}>{shot.error}</p>}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="p-btn p-btn-ghost" disabled={shot.busy} onClick={() => { setShot(null); takePhoto(shot.stop, shot.kind); }}>Retake</button>
            <button className="p-btn p-btn-primary" disabled={shot.busy} onClick={uploadShot}>
              {shot.busy ? <Spinner /> : shot.kind === "after" ? "Save & send to owner" : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {completing && (
        <CompleteDialog
          stop={completing}
          busy={complete.isPending}
          onClose={() => setCompleting(null)}
          onSave={async v => {
            await complete.mutateAsync({ stopId: completing.id, ...v });
            setCompleting(null);
            toast("Stop completed");
          }}
        />
      )}
      {sending && (
        <SendProofDialog
          stop={sending}
          busy={resendProof.isPending}
          onClose={() => setSending(null)}
          onSend={async v => {
            const latest = [...sending.proofs.filter(p => p.kind === "after")].sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime())[0];
            const res = await resendProof.mutateAsync({ proofId: latest.id, ...v });
            setSending(null);
            refresh();
            const parts = [res.email && `email ${res.email}`, res.sms && res.sms !== "not configured" && `text ${res.sms}`].filter(Boolean);
            toast(parts.length ? parts.join(" · ") : "Nothing sent");
          }}
        />
      )}
      {skipping && (
        <Modal onClose={() => setSkipping(null)}>
          <h3 className="text-lg mb-2">Skip {skipping.property.ownerName}?</h3>
          <div className="space-y-2">
            {SKIP_REASONS.map(r => (
              <button key={r} className="p-btn p-btn-ghost w-full justify-start" disabled={skip.isPending} onClick={async () => {
                let reason = r;
                if (r === "Other") reason = prompt("Reason:") || "Other";
                await skip.mutateAsync({ stopId: skipping.id, reason });
                setSkipping(null);
              }}>
                {r}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {msg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded text-sm font-semibold shadow-lg" style={{ background: "var(--p-green)", color: "#fff", maxWidth: "92vw" }}>
          {msg}
        </div>
      )}
    </PlowShell>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-3" style={{ background: "rgba(0,0,0,.6)" }} onClick={onClose}>
      <div className="plow plow-dark p-card w-full max-w-md max-h-[92vh] overflow-auto" style={{ minHeight: 0 }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function CompleteDialog({ stop, busy, onClose, onSave }: { stop: Stop; busy: boolean; onClose: () => void; onSave: (v: { services: ServiceId[]; saltQty?: number; note?: string }) => Promise<void> }) {
  const [services, setServices] = useState<ServiceId[]>((stop.property.services || "plow").split(",").filter(Boolean) as ServiceId[]);
  const [salt, setSalt] = useState<string>("");
  const [note, setNote] = useState("");
  const usesMaterial = services.includes("salt") || services.includes("sand");
  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg">Complete · {stop.property.ownerName}</h3>
      <p className="text-sm mb-3" style={{ color: "var(--p-gray-400)" }}>{stop.property.address}</p>
      <div className="p-label mb-1">Services performed</div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {SERVICE_OPTIONS.map(s => (
          <label key={s.id} className={`p-btn p-btn-ghost justify-start ${services.includes(s.id) ? "p-btn-dark" : ""}`}>
            <input type="checkbox" className="hidden" checked={services.includes(s.id)} onChange={e => setServices(e.target.checked ? [...services, s.id] : services.filter(x => x !== s.id))} />
            {services.includes(s.id) ? "☑" : "☐"} {s.label}
          </label>
        ))}
      </div>
      {usesMaterial && (
        <label className="block mb-3">
          <span className="p-label block mb-1">Material used (lbs or bags)</span>
          <input className="p-input" type="number" inputMode="decimal" step="0.5" min={0} value={salt} onChange={e => setSalt(e.target.value)} placeholder="e.g. 50" />
        </label>
      )}
      <textarea className="p-textarea" rows={2} placeholder="Notes (icy spots, refreeze risk, areas not reached…)" value={note} onChange={e => setNote(e.target.value)} />
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button className="p-btn p-btn-ghost" onClick={onClose}>Cancel</button>
        <button className="p-btn p-btn-green" disabled={busy || !services.length} onClick={() => onSave({ services, saltQty: salt ? Number(salt) : undefined, note: note || undefined })}>
          {busy ? <Spinner /> : "Mark complete"}
        </button>
      </div>
    </Modal>
  );
}

function SendProofDialog({ stop, busy, onClose, onSend }: { stop: Stop; busy: boolean; onClose: () => void; onSend: (v: { channels: Array<"email" | "sms">; email?: string; phone?: string }) => Promise<void> }) {
  const p = stop.property;
  const status = trpc.plow.auth.status.useQuery(undefined, { staleTime: 5 * 60_000 });
  const smsEnabled = !!status.data?.smsConfigured;
  const [email, setEmail] = useState(!!p.ownerEmail);
  const [sms, setSms] = useState(false);
  const [emailTo, setEmailTo] = useState(p.ownerEmail ?? "");
  const [phoneTo, setPhoneTo] = useState(p.ownerPhone ?? "");
  const [err, setErr] = useState<string | null>(null);
  const latest = [...stop.proofs.filter(x => x.kind === "after")].sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime())[0];
  const channels = [email && "email", sms && "sms"].filter(Boolean) as Array<"email" | "sms">;
  const [sharing, setSharing] = useState(false);

  /** Native share sheet: driver texts the stamped photo from their own phone (no Twilio). */
  async function shareFromPhone() {
    if (!latest) return;
    setSharing(true);
    setErr(null);
    const when = new Date(latest.capturedAt).toLocaleString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    const link = `${location.origin}/plow/proof/${latest.token}`;
    const text = `MDF Estes Park: ${p.address} was plowed on ${when}. Photo + GPS proof: ${link}  Questions? Call/text 970-889-5771`;
    try {
      let files: File[] = [];
      try {
        const blob = await (await fetch(latest.photoUrl)).blob();
        files = [new File([blob], "proof-of-service.jpg", { type: "image/jpeg" })];
      } catch { /* share text only */ }
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.share) {
        const data: ShareData = nav.canShare && files.length && nav.canShare({ files }) ? { text, files } : { text };
        await nav.share(data);
        onClose();
      } else {
        // Desktop / unsupported: fall back to an sms: link with the text pre-filled
        const to = phoneTo.replace(/[^\d+]/g, "");
        location.href = `sms:${to}${/iPhone|iPad/.test(navigator.userAgent) ? "&" : "?"}body=${encodeURIComponent(text)}`;
      }
    } catch (e) {
      if (!(e instanceof Error && e.name === "AbortError")) setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSharing(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg">Send proof · {p.ownerName}</h3>
      <p className="text-sm mb-3" style={{ color: "var(--p-gray-400)" }}>{p.address}</p>
      {latest && <img src={latest.photoUrl} alt="proof" className="w-full rounded mb-3" />}
      <div className="space-y-3">
        <label className="flex items-start gap-3 p-card" style={{ padding: 10, cursor: "pointer" }}>
          <input type="checkbox" className="mt-1" checked={email} onChange={e => setEmail(e.target.checked)} />
          <div className="flex-1">
            <div className="font-semibold">✉ Email</div>
            <input className="p-input mt-1" type="email" inputMode="email" placeholder="owner@example.com" value={emailTo} onChange={e => setEmailTo(e.target.value)} onClick={e => e.stopPropagation()} />
          </div>
        </label>
        {smsEnabled && (
        <label className="flex items-start gap-3 p-card" style={{ padding: 10, cursor: "pointer" }}>
          <input type="checkbox" className="mt-1" checked={sms} onChange={e => setSms(e.target.checked)} />
          <div className="flex-1">
            <div className="font-semibold">💬 Text (MMS with photo)</div>
            <input className="p-input mt-1" type="tel" inputMode="tel" placeholder="970-555-0100" value={phoneTo} onChange={e => setPhoneTo(e.target.value)} onClick={e => e.stopPropagation()} />
          </div>
        </label>
        )}
      </div>
      <button className="p-btn p-btn-ghost w-full mt-3" disabled={sharing || !latest} onClick={shareFromPhone}>
        {sharing ? <Spinner /> : <>📱 Text / share from my phone <span className="text-xs opacity-70">(sends from your number)</span></>}
      </button>
      {err && <p className="text-sm mt-2" style={{ color: "var(--p-red)" }}>{err}</p>}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button className="p-btn p-btn-ghost" onClick={onClose}>Cancel</button>
        <button
          className="p-btn p-btn-primary"
          disabled={busy || !channels.length || (email && !emailTo) || (sms && !phoneTo)}
          onClick={async () => {
            setErr(null);
            try {
              await onSend({ channels, email: email ? emailTo.trim() : undefined, phone: sms ? phoneTo.trim() : undefined });
            } catch (e) {
              setErr(e instanceof Error ? e.message : String(e));
            }
          }}
        >
          {busy ? <Spinner /> : `Send ${channels.length === 2 ? "both" : channels[0] === "sms" ? "text" : "email"}`}
        </button>
      </div>
    </Modal>
  );
}

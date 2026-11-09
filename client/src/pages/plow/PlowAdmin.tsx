import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { LogoutButton, PlowShell, SERVICE_OPTIONS, Spinner, fmtDT, fmtTime, todayDenver, usePlowGuard, type ServiceId } from "@/plow/PlowShell";
import PlowMap, { type MapMarker } from "@/plow/PlowMap";
import { Field } from "./PlowLogin";
import { fmtDistance } from "@/plow/geo";
import { DirectionsPanel, useInAppDirections } from "@/plow/DirectionsPanel";

type Tab = "dispatch" | "properties" | "drivers" | "proofs" | "analytics" | "settings";

export default function PlowAdmin() {
  const me = usePlowGuard("admin");
  const [tab, setTab] = useState<Tab>("dispatch");

  if (me.isLoading || !me.data) {
    return (
      <PlowShell title="Admin">
        <div className="flex justify-center py-20"><Spinner /></div>
      </PlowShell>
    );
  }

  return (
    <PlowShell title="Dispatch" right={<><span className="text-sm hidden sm:inline" style={{ color: "var(--p-gray-400)" }}>{me.data.name}</span><LogoutButton /></>}>
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="p-tabs mb-5">
          {(
            [
              ["dispatch", "Dispatch"],
              ["properties", "Properties"],
              ["drivers", "Drivers"],
              ["proofs", "Proof log"],
              ["analytics", "Analytics"],
              ["settings", "Status"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button key={id} className={`p-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        {tab === "dispatch" && <Dispatch />}
        {tab === "properties" && <Properties />}
        {tab === "drivers" && <Drivers />}
        {tab === "proofs" && <ProofLog />}
        {tab === "analytics" && <Analytics />}
        {tab === "settings" && <Status />}
      </main>
    </PlowShell>
  );
}

// =============================================================== Dispatch
function Dispatch() {
  const utils = trpc.useUtils();
  const [date, setDate] = useState(todayDenver());
  const [driverId, setDriverId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState("");

  const drivers = trpc.plow.drivers.list.useQuery();
  const properties = trpc.plow.properties.list.useQuery({});
  const routes = trpc.plow.routes.forDate.useQuery({ date }, { refetchInterval: 20000 });
  const positions = trpc.plow.drivers.positions.useQuery(undefined, { refetchInterval: 20000 });

  const invalidate = () => utils.plow.routes.forDate.invalidate({ date });
  const ensure = trpc.plow.routes.ensure.useMutation();
  const addStops = trpc.plow.routes.addStops.useMutation({ onSuccess: invalidate });
  const removeStop = trpc.plow.routes.removeStop.useMutation({ onSuccess: invalidate });
  const reorder = trpc.plow.routes.reorder.useMutation({ onSuccess: invalidate });
  const optimize = trpc.plow.routes.optimize.useMutation({ onSuccess: invalidate });
  const delRoute = trpc.plow.routes.delete.useMutation({ onSuccess: invalidate });
  const copyDay = trpc.plow.routes.copyDay.useMutation({ onSuccess: invalidate });

  const nav = useInAppDirections();

  const activeDrivers = (drivers.data ?? []).filter(d => d.active && d.role === "driver" || (d.active && d.role === "admin"));
  const propById = useMemo(() => new Map((properties.data ?? []).map(p => [p.id, p])), [properties.data]);
  const assignedPropIds = new Set((routes.data ?? []).flatMap(r => r.stops.map(s => s.propertyId)));

  const unassigned = (properties.data ?? []).filter(p => !assignedPropIds.has(p.id) && (filter ? `${p.ownerName} ${p.address}`.toLowerCase().includes(filter.toLowerCase()) : true));

  async function assignSelected() {
    if (!driverId || !selected.size) return;
    const r = await ensure.mutateAsync({ date, driverId });
    await addStops.mutateAsync({ routeId: r.id, propertyIds: Array.from(selected) });
    setSelected(new Set());
  }

  const markers: MapMarker[] = [];
  const colors = ["#FF5C1C", "#1E62E0", "#1E9E5A", "#FFC400", "#DA3A2B"];
  (routes.data ?? []).forEach((r, ri) => {
    r.stops.forEach((s, i) => {
      const p = propById.get(s.propertyId);
      if (p?.lat != null && p?.lng != null) markers.push({ id: `s${s.id}`, lat: p.lat, lng: p.lng, label: String(i + 1), title: `${driverName(r.driverId)} · ${p.address}`, kind: s.status === "done" ? "done" : "stop" });
    });
    void ri; void colors;
  });
  (positions.data ?? []).forEach(p => markers.push({ id: `t${p.id}`, lat: p.lat!, lng: p.lng!, label: "T", title: `${p.name} · ${fmtDT(p.lastSeenAt)}`, kind: "truck" }));

  function driverName(id: number) {
    return drivers.data?.find(d => d.id === id)?.name ?? `#${id}`;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-4 lg:gap-5 min-w-0">
      <div className="space-y-4 min-w-0">
        <div className="p-card">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-end gap-3">
            <Field label="Service date">
              <input className="p-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </Field>
            <Field label="Assign to driver">
              <select className="p-select" value={driverId ?? ""} onChange={e => setDriverId(e.target.value ? Number(e.target.value) : null)}>
                <option value="">— choose —</option>
                {activeDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </Field>
            <button className="p-btn p-btn-primary col-span-2" disabled={!driverId || !selected.size || addStops.isPending} onClick={assignSelected}>
              {addStops.isPending ? <Spinner /> : `Assign ${selected.size || ""} selected`}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="p-btn p-btn-ghost p-btn-sm"
              onClick={() => {
                const from = prompt("Copy routes from which date? (YYYY-MM-DD)", yesterday(date));
                if (from) copyDay.mutate({ from, to: date });
              }}
            >
              Copy a previous day's routes →
            </button>
            {copyDay.data && <span className="text-sm self-center" style={{ color: "var(--p-gray-400)" }}>Copied {copyDay.data.copied} route(s)</span>}
          </div>
        </div>

        <div className="p-card">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="p-label">Unassigned properties ({unassigned.length})</div>
            <input className="p-input" style={{ maxWidth: 180, padding: "6px 10px" }} placeholder="Search…" value={filter} onChange={e => setFilter(e.target.value)} />
          </div>
          <div className="flex gap-2 mb-2">
            <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => setSelected(new Set(unassigned.map(p => p.id)))}>Select all</button>
            <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => setSelected(new Set())}>Clear</button>
          </div>
          <div className="max-h-[360px] overflow-auto divide-y" style={{ borderColor: "var(--p-ink-700)" }}>
            {properties.isLoading && <Spinner />}
            {unassigned.map(p => (
              <label key={p.id} className="flex items-start gap-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={selected.has(p.id)}
                  onChange={e => {
                    const n = new Set(selected);
                    e.target.checked ? n.add(p.id) : n.delete(p.id);
                    setSelected(n);
                  }}
                />
                <div className="min-w-0">
                  <div className="font-semibold text-sm flex items-center gap-2">
                    {p.ownerName}
                    {p.priority === 1 && <span className="p-pill p-pill-red">High</span>}
                    {p.lat == null && <span className="p-pill p-pill-yellow" title="Not geocoded">No GPS</span>}
                  </div>
                  <div className="text-xs" style={{ color: "var(--p-gray-400)" }}>{p.address} · {p.services}</div>
                </div>
              </label>
            ))}
            {!properties.isLoading && !unassigned.length && <p className="text-sm py-3" style={{ color: "var(--p-gray-400)" }}>Everything is assigned for this date.</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4 min-w-0">
        <div className={`p-card overflow-hidden p-map-box ${nav.target ? "tall" : ""}`} style={{ padding: 0 }}>
          <PlowMap markers={markers} fitKey={date} directions={nav.directions} onDirections={nav.onDirections} />
        </div>
        <DirectionsPanel nav={nav} />

        {(routes.data ?? []).length === 0 && <div className="p-card text-sm" style={{ color: "var(--p-gray-400)" }}>No routes for {date} yet. Pick a driver, tick properties, and assign.</div>}

        {(routes.data ?? []).map(r => (
          <div key={r.id} className="p-card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="p-label">Route · {driverName(r.driverId)}</div>
                <div className="text-sm flex items-center gap-2">
                  <span className={`p-pill ${r.status === "active" ? "p-pill-orange" : r.status === "done" ? "p-pill-green" : ""}`}>{r.status}</span>
                  <span style={{ color: "var(--p-gray-400)" }}>{r.stops.filter(s => s.status === "done").length}/{r.stops.length} done</span>
                  {r.startedAt && <span style={{ color: "var(--p-gray-400)" }}>started {fmtTime(r.startedAt)}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-btn p-btn-ghost p-btn-sm" disabled={optimize.isPending} onClick={() => {
                  const pos = positions.data?.find(p => p.id === r.driverId);
                  optimize.mutate({ routeId: r.id, start: pos ? { lat: pos.lat!, lng: pos.lng! } : undefined });
                }}>
                  Optimize order
                </button>
                <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => confirm("Delete this whole route?") && delRoute.mutate({ routeId: r.id })}>Delete</button>
              </div>
            </div>
            <ol className="space-y-1">
              {r.stops.map((s, i) => {
                const p = propById.get(s.propertyId);
                return (
                  <li key={s.id} className="flex flex-wrap items-center gap-2 text-sm py-2" style={{ borderBottom: "1px solid var(--p-ink-700)" }}>
                    <span className={`p-stop-num ${s.status}`} style={{ width: 26, height: 26, fontSize: 12 }}>{i + 1}</span>
                    <div className="flex-1 min-w-0" style={{ minWidth: 140 }}>
                      <div className="font-semibold truncate">{p?.ownerName ?? "?"}</div>
                      <div className="text-xs truncate" style={{ color: "var(--p-gray-400)" }}>{p?.address}</div>
                    </div>
                    <span className="p-pill">{s.status.replace("_", " ")}</span>
                    <div className="flex gap-1 ml-auto sm:ml-0">
                      <button
                        className={`p-btn p-btn-sm ${nav.target?.address === p?.address ? "p-btn-blue" : "p-btn-ghost"}`}
                        disabled={p?.lat == null}
                        title={p?.lat == null ? "Property has no coordinates yet" : "Directions from my location"}
                        onClick={() => p && nav.navigateTo({ lat: p.lat!, lng: p.lng!, address: p.address, label: p.ownerName })}
                      >
                        🧭 Navigate
                      </button>
                      <button className="p-btn p-btn-ghost p-btn-sm" disabled={i === 0} onClick={() => reorder.mutate({ routeId: r.id, stopIds: move(r.stops.map(x => x.id), i, i - 1) })}>↑</button>
                      <button className="p-btn p-btn-ghost p-btn-sm" disabled={i === r.stops.length - 1} onClick={() => reorder.mutate({ routeId: r.id, stopIds: move(r.stops.map(x => x.id), i, i + 1) })}>↓</button>
                      <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => removeStop.mutate({ stopId: s.id })}>✕</button>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const a = [...arr];
  const [x] = a.splice(from, 1);
  a.splice(to, 0, x);
  return a;
}
function yesterday(date: string) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ============================================================= Properties
function Properties() {
  const utils = trpc.useUtils();
  const smsEnabled = !!trpc.plow.auth.status.useQuery(undefined, { staleTime: 5 * 60_000 }).data?.smsConfigured;
  const list = trpc.plow.properties.list.useQuery({ includeInactive: true });
  const invalidate = () => utils.plow.properties.list.invalidate();
  const create = trpc.plow.properties.create.useMutation({ onSuccess: invalidate });
  const update = trpc.plow.properties.update.useMutation({ onSuccess: invalidate });
  const importCsv = trpc.plow.properties.importCsv.useMutation({ onSuccess: invalidate });
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [csv, setCsv] = useState("");
  const [showImport, setShowImport] = useState(false);

  const blank = { ownerName: "", address: "", ownerEmail: "", ownerPhone: "", notifyEmail: true, notifySms: true, services: ["plow"] as ServiceId[], triggerDepth: 2, priority: 2, notes: "", gateCode: "" };
  const [form, setForm] = useState(blank);

  function startEdit(p: NonNullable<typeof list.data>[number]) {
    setEditing(p.id);
    setForm({
      ownerName: p.ownerName,
      address: p.address,
      ownerEmail: p.ownerEmail ?? "",
      ownerPhone: p.ownerPhone ?? "",
      notifyEmail: !!p.notifyEmail,
      notifySms: !!p.notifySms,
      services: (p.services?.split(",").filter(Boolean) as ServiceId[]) ?? ["plow"],
      triggerDepth: p.triggerDepth ?? 2,
      priority: p.priority,
      notes: p.notes ?? "",
      gateCode: p.gateCode ?? "",
    });
  }

  async function save() {
    const payload = { ...form, ownerEmail: form.ownerEmail || "", ownerPhone: form.ownerPhone || undefined, notes: form.notes || undefined, gateCode: form.gateCode || undefined };
    if (editing === "new") await create.mutateAsync(payload);
    else if (typeof editing === "number") await update.mutateAsync({ id: editing, ...payload, ownerEmail: form.ownerEmail || null, ownerPhone: form.ownerPhone || null, notes: form.notes || null, gateCode: form.gateCode || null });
    setEditing(null);
    setForm(blank);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button className="p-btn p-btn-primary" onClick={() => { setEditing("new"); setForm(blank); }}>+ Add property</button>
        <button className="p-btn p-btn-ghost" onClick={() => setShowImport(s => !s)}>Import list</button>
      </div>

      {showImport && (
        <div className="p-card space-y-2">
          <div className="p-label">Paste one per line: Owner name, Address, Email, Phone</div>
          <textarea className="p-textarea" rows={5} value={csv} onChange={e => setCsv(e.target.value)} placeholder={"Jane Smith, 123 Fall River Rd, Estes Park CO 80517, jane@example.com, 970-555-0100"} />
          <button className="p-btn p-btn-primary" disabled={importCsv.isPending || !csv.trim()} onClick={() => importCsv.mutate({ csv })}>
            {importCsv.isPending ? <><Spinner /> Geocoding…</> : "Import"}
          </button>
          {importCsv.data && <p className="text-sm">Imported {importCsv.data.added} properties.</p>}
        </div>
      )}

      {editing !== null && (
        <div className="p-card space-y-3">
          <h3 className="text-lg">{editing === "new" ? "New property" : "Edit property"}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Owner / customer name"><input className="p-input" value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} /></Field>
            <Field label="Address" hint="Geocoded automatically for the map and GPS check"><input className="p-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Fall River Rd, Estes Park, CO 80517" /></Field>
            <Field label="Owner email (gets proof photo)"><input className="p-input" type="email" value={form.ownerEmail} onChange={e => setForm({ ...form, ownerEmail: e.target.value })} /></Field>
            <Field label={smsEnabled ? "Owner mobile (gets proof text)" : "Owner mobile"}><input className="p-input" value={form.ownerPhone} onChange={e => setForm({ ...form, ownerPhone: e.target.value })} placeholder="970-555-0100" /></Field>
            <Field label="Gate code / access (optional)"><input className="p-input" value={form.gateCode} onChange={e => setForm({ ...form, gateCode: e.target.value })} /></Field>
            <Field label="Priority">
              <select className="p-select" value={form.priority} onChange={e => setForm({ ...form, priority: Number(e.target.value) })}>
                <option value={1}>1 — High (plow first)</option>
                <option value={2}>2 — Normal</option>
                <option value={3}>3 — Low</option>
              </select>
            </Field>
            <Field label="Trigger depth (inches)"><input className="p-input" type="number" step="0.5" min={0} value={form.triggerDepth} onChange={e => setForm({ ...form, triggerDepth: Number(e.target.value) })} /></Field>
            <div>
              <span className="p-label block mb-1">Services</span>
              <div className="flex flex-wrap gap-3 pt-2">
                {SERVICE_OPTIONS.map(s => (
                  <label key={s.id} className="flex items-center gap-1 text-sm">
                    <input type="checkbox" checked={form.services.includes(s.id)} onChange={e => setForm({ ...form, services: e.target.checked ? [...form.services, s.id] : form.services.filter(x => x !== s.id) })} /> {s.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <Field label="Notes for the driver"><textarea className="p-textarea" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Push snow to the north side; don't block the propane tank." /></Field>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-1"><input type="checkbox" checked={form.notifyEmail} onChange={e => setForm({ ...form, notifyEmail: e.target.checked })} /> Email proof to owner</label>
            {smsEnabled && <label className="flex items-center gap-1"><input type="checkbox" checked={form.notifySms} onChange={e => setForm({ ...form, notifySms: e.target.checked })} /> Text proof to owner</label>}
          </div>
          <div className="flex gap-2">
            <button className="p-btn p-btn-primary" disabled={!form.ownerName || !form.address || create.isPending || update.isPending} onClick={save}>
              {create.isPending || update.isPending ? <Spinner /> : "Save"}
            </button>
            <button className="p-btn p-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
          {(create.error || update.error) && <p className="text-sm" style={{ color: "var(--p-red)" }}>{(create.error ?? update.error)?.message}</p>}
        </div>
      )}

      <div className="p-card overflow-x-auto" style={{ padding: 0 }}>
        <table className="p-table">
          <thead>
            <tr><th>Owner</th><th>Address</th><th>Contact</th><th>Services</th><th>Pri</th><th>GPS</th><th></th></tr>
          </thead>
          <tbody>
            {(list.data ?? []).map(p => (
              <tr key={p.id} style={{ opacity: p.active ? 1 : 0.45 }}>
                <td className="font-semibold">{p.ownerName}{!p.active && <span className="p-pill ml-2">inactive</span>}</td>
                <td>{p.address}</td>
                <td className="text-xs">{p.ownerEmail}<br />{p.ownerPhone}</td>
                <td className="text-xs">{p.services}</td>
                <td>{p.priority}</td>
                <td className="p-mono text-xs">{p.lat != null ? `${p.lat.toFixed(4)}, ${p.lng?.toFixed(4)}` : <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => update.mutate({ id: p.id, regeocode: true })}>Geocode</button>}</td>
                <td className="whitespace-nowrap">
                  <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => startEdit(p)}>Edit</button>{" "}
                  <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => update.mutate({ id: p.id, active: !p.active })}>{p.active ? "Deactivate" : "Reactivate"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.isLoading && <div className="p-4"><Spinner /></div>}
      </div>
    </div>
  );
}

// ================================================================ Drivers
function Drivers() {
  const utils = trpc.useUtils();
  const list = trpc.plow.drivers.list.useQuery();
  const invalidate = () => utils.plow.drivers.list.invalidate();
  const create = trpc.plow.drivers.create.useMutation({ onSuccess: () => { invalidate(); setForm(blank); setShow(false); } });
  const update = trpc.plow.drivers.update.useMutation({ onSuccess: invalidate });
  const blank = { name: "", username: "", password: "", phone: "", email: "", role: "driver" as "driver" | "admin" };
  const [form, setForm] = useState(blank);
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-4">
      <button className="p-btn p-btn-primary" onClick={() => setShow(s => !s)}>+ Add driver</button>
      {show && (
        <div className="p-card space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Full name"><input className="p-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Username (they type this to log in)"><input className="p-input" autoCapitalize="none" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase() })} /></Field>
            <Field label="Temporary password (6+)"><input className="p-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></Field>
            <Field label="Role">
              <select className="p-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })}>
                <option value="driver">Driver</option>
                <option value="admin">Admin (full access)</option>
              </select>
            </Field>
            <Field label="Phone"><input className="p-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Email"><input className="p-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          </div>
          <div className="flex gap-2">
            <button className="p-btn p-btn-primary" disabled={create.isPending || !form.name || form.username.length < 3 || form.password.length < 6} onClick={() => create.mutate({ ...form, phone: form.phone || undefined, email: form.email || "" })}>
              {create.isPending ? <Spinner /> : "Create login"}
            </button>
            <button className="p-btn p-btn-ghost" onClick={() => setShow(false)}>Cancel</button>
          </div>
          {create.error && <p className="text-sm" style={{ color: "var(--p-red)" }}>{create.error.message}</p>}
        </div>
      )}
      <div className="p-card overflow-x-auto" style={{ padding: 0 }}>
        <table className="p-table">
          <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Phone</th><th>Last seen</th><th></th></tr></thead>
          <tbody>
            {(list.data ?? []).map(d => (
              <tr key={d.id} style={{ opacity: d.active ? 1 : 0.45 }}>
                <td className="font-semibold">{d.name}</td>
                <td className="p-mono">{d.username}</td>
                <td><span className={`p-pill ${d.role === "admin" ? "p-pill-orange" : ""}`}>{d.role}</span></td>
                <td>{d.phone}</td>
                <td className="text-xs">{d.lastSeenAt ? fmtDT(d.lastSeenAt) : "—"}</td>
                <td className="whitespace-nowrap">
                  <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => { const pw = prompt(`New password for ${d.name} (6+ chars):`); if (pw && pw.length >= 6) update.mutate({ id: d.id, newPassword: pw }); }}>Reset password</button>{" "}
                  <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => update.mutate({ id: d.id, active: !d.active })}>{d.active ? "Deactivate" : "Reactivate"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {update.error && <p className="text-sm" style={{ color: "var(--p-red)" }}>{update.error.message}</p>}
    </div>
  );
}

// =============================================================== ProofLog
function ProofLog() {
  const smsEnabled = !!trpc.plow.auth.status.useQuery(undefined, { staleTime: 5 * 60_000 }).data?.smsConfigured;
  const [from, setFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 14); return d.toISOString().slice(0, 10); });
  const [to, setTo] = useState(todayDenver());
  const [propertyId, setPropertyId] = useState<number | undefined>();
  const properties = trpc.plow.properties.list.useQuery({ includeInactive: true });
  const proofs = trpc.plow.proofs.list.useQuery({ from, to, propertyId });
  const resend = trpc.plow.proofs.resend.useMutation({ onSuccess: () => proofs.refetch() });
  const del = trpc.plow.proofs.delete.useMutation({ onSuccess: () => proofs.refetch() });

  function exportCsv() {
    const rows = [["Date/Time (MT)", "Address", "Driver", "Kind", "Lat", "Lng", "Accuracy m", "Dist from property m", "Weather", "Services", "Material", "Email sent", "SMS sent", "Photo"]];
    for (const p of proofs.data ?? []) {
      rows.push([
        fmtDT(p.capturedAt, { year: "numeric", second: "2-digit" }), p.address, p.driverName, p.kind, String(p.lat ?? ""), String(p.lng ?? ""), String(p.accuracyM ?? ""), String(p.distanceFromPropertyM ?? ""),
        p.weather ?? "", p.stop?.services ?? "", String(p.stop?.saltQty ?? ""), p.emailSentAt ? "yes" : "", p.smsSentAt ? "yes" : "", `${location.origin}${p.photoUrl}`,
      ]);
    }
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `plow-service-log-${from}-to-${to}.csv`;
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="p-card flex flex-wrap items-end gap-3">
        <Field label="From"><input className="p-input" type="date" value={from} onChange={e => setFrom(e.target.value)} /></Field>
        <Field label="To"><input className="p-input" type="date" value={to} onChange={e => setTo(e.target.value)} /></Field>
        <Field label="Property">
          <select className="p-select" value={propertyId ?? ""} onChange={e => setPropertyId(e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">All</option>
            {(properties.data ?? []).map(p => <option key={p.id} value={p.id}>{p.ownerName} — {p.address}</option>)}
          </select>
        </Field>
        <button className="p-btn p-btn-ghost" onClick={exportCsv} disabled={!proofs.data?.length}>Export CSV (liability log)</button>
      </div>
      {proofs.isLoading && <Spinner />}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(proofs.data ?? []).map(p => (
          <div key={p.id} className="p-card" style={{ padding: 0, overflow: "hidden" }}>
            <a href={p.photoUrl} target="_blank" rel="noreferrer"><img src={p.photoUrl} alt="proof" className="w-full aspect-[4/3] object-cover" loading="lazy" /></a>
            <div className="p-3 text-sm space-y-1">
              <div className="font-semibold">{p.address}</div>
              <div style={{ color: "var(--p-gray-400)" }}>{fmtDT(p.capturedAt, { year: "numeric" })} · {p.driverName} · <span className="p-pill">{p.kind}</span></div>
              <div className="p-mono text-xs">{p.lat != null ? `${p.lat.toFixed(5)}, ${p.lng?.toFixed(5)}` : "no GPS"} {p.locationSource !== "gps" && <span className="p-pill p-pill-yellow ml-1">{p.locationSource}</span>}</div>
              {p.distanceFromPropertyM != null && (
                <div className="text-xs" style={{ color: p.distanceFromPropertyM > 150 ? "var(--p-red)" : "var(--p-green)" }}>
                  {fmtDistance(p.distanceFromPropertyM)} from property {p.distanceFromPropertyM > 150 && "⚠"}
                </div>
              )}
              {p.weather && <div className="text-xs" style={{ color: "var(--p-gray-400)" }}>{p.weather}</div>}
              <div className="flex items-center gap-2 text-xs pt-1">
                <span className={`p-pill ${p.emailSentAt ? "p-pill-green" : ""}`}>email {p.emailSentAt ? "✓" : "—"}</span>
                {(smsEnabled || p.smsSentAt) && <span className={`p-pill ${p.smsSentAt ? "p-pill-green" : ""}`}>sms {p.smsSentAt ? "✓" : "—"}</span>}
                <a className="underline ml-auto" href={`/plow/proof/${p.token}`} target="_blank" rel="noreferrer">owner link</a>
                <button className="p-btn p-btn-ghost p-btn-sm" disabled={resend.isPending} onClick={() => resend.mutate({ proofId: p.id })}>Resend</button>
                <button
                  className="p-btn p-btn-ghost p-btn-sm"
                  style={{ color: "var(--p-red)" }}
                  disabled={del.isPending}
                  title="Delete this photo"
                  onClick={() => confirm(`Delete this ${p.kind} photo for ${p.address}?\n\nThis removes it from the service record permanently.`) && del.mutate({ proofId: p.id })}
                >
                  Delete
                </button>
              </div>
              {del.error && <div className="text-xs" style={{ color: "var(--p-red)" }}>{del.error.message}</div>}
              {p.deliveryError && <div className="text-xs" style={{ color: "var(--p-red)" }}>{p.deliveryError}</div>}
            </div>
          </div>
        ))}
      </div>
      {!proofs.isLoading && !proofs.data?.length && <p className="text-sm" style={{ color: "var(--p-gray-400)" }}>No proofs in this range.</p>}
    </div>
  );
}

// ============================================================== Analytics
function fmtMinutes(m: number | null | undefined) {
  if (m == null) return "—";
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h ? `${h}h ${mm}m` : `${mm}m`;
}

function Analytics() {
  const [from, setFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); });
  const [to, setTo] = useState(todayDenver());
  const q = trpc.plow.analytics.drivers.useQuery({ from, to });
  const drivers = q.data?.drivers ?? [];
  const days = q.data?.days ?? [];
  const totals = {
    stops: drivers.reduce((a, d) => a + d.stops, 0),
    done: drivers.reduce((a, d) => a + d.done, 0),
    minutes: drivers.reduce((a, d) => a + d.minutes, 0),
    photos: drivers.reduce((a, d) => a + d.photos, 0),
  };
  const maxDone = Math.max(1, ...drivers.map(d => d.done));

  return (
    <div className="space-y-4">
      <div className="p-card flex flex-wrap items-end gap-3">
        <Field label="From"><input className="p-input" type="date" value={from} onChange={e => setFrom(e.target.value)} /></Field>
        <Field label="To"><input className="p-input" type="date" value={to} onChange={e => setTo(e.target.value)} /></Field>
        <div className="flex gap-2">
          {[["Today", 0], ["7 days", 7], ["30 days", 30], ["Season", 180]].map(([l, n]) => (
            <button key={l} className="p-btn p-btn-ghost p-btn-sm" onClick={() => { const d = new Date(); d.setDate(d.getDate() - Number(n)); setFrom(d.toISOString().slice(0, 10)); setTo(todayDenver()); }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Stops completed", `${totals.done}/${totals.stops}`], ["Time on route", fmtMinutes(totals.minutes)], ["Min per stop", totals.done ? `${Math.round((totals.minutes / totals.done) * 10) / 10}` : "—"], ["Proof photos", String(totals.photos)]].map(([k, v]) => (
          <div key={k} className="p-card">
            <div className="p-label">{k}</div>
            <div className="text-2xl p-mono mt-1">{v}</div>
          </div>
        ))}
      </div>

      <div className="p-card overflow-x-auto" style={{ padding: 0 }}>
        <div className="p-label px-3 pt-3">By driver</div>
        <table className="p-table">
          <thead>
            <tr><th>Driver</th><th>Days</th><th>Stops</th><th>Done</th><th>Skipped</th><th>Time on route</th><th>Min / stop</th><th>Photos</th><th>Material</th></tr>
          </thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.driverId}>
                <td className="font-semibold">
                  {d.driverName}
                  <div className="mt-1 h-1.5 rounded" style={{ background: "var(--p-ink-700)", width: 140 }}>
                    <div className="h-1.5 rounded" style={{ width: `${(d.done / maxDone) * 100}%`, background: "var(--p-orange)" }} />
                  </div>
                </td>
                <td>{d.routeDays}</td>
                <td>{d.stops}</td>
                <td style={{ color: "var(--p-green)" }}>{d.done}</td>
                <td>{d.skipped || "—"}</td>
                <td className="p-mono">{fmtMinutes(d.minutes)}</td>
                <td className="p-mono">{d.minutesPerStop ?? "—"}</td>
                <td>{d.photos}</td>
                <td>{d.material ? `${d.material} lbs` : "—"}</td>
              </tr>
            ))}
            {!q.isLoading && !drivers.length && <tr><td colSpan={9} className="text-center py-6" style={{ color: "var(--p-gray-400)" }}>No routes in this range.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="p-card overflow-x-auto" style={{ padding: 0 }}>
        <div className="p-label px-3 pt-3">By day</div>
        <table className="p-table">
          <thead>
            <tr><th>Date</th><th>Driver</th><th>Status</th><th>Stops</th><th>Done</th><th>First activity</th><th>Last proof</th><th>Time on route</th><th>Min / stop</th></tr>
          </thead>
          <tbody>
            {days.map(d => (
              <tr key={d.routeId}>
                <td className="p-mono">{d.date}</td>
                <td className="font-semibold">{d.driverName}</td>
                <td><span className={`p-pill ${d.status === "active" ? "p-pill-orange" : d.status === "done" ? "p-pill-green" : ""}`}>{d.status}</span></td>
                <td>{d.stops}</td>
                <td>{d.done}{d.skipped ? <span style={{ color: "var(--p-gray-400)" }}> (+{d.skipped} skipped)</span> : null}</td>
                <td>{fmtTime(d.startedAt)}</td>
                <td>{fmtTime(d.lastProofAt)}</td>
                <td className="p-mono">{fmtMinutes(d.minutes)}</td>
                <td className="p-mono">{d.minutesPerStop ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {q.isLoading && <div className="p-4"><Spinner /></div>}
      </div>
      <p className="text-xs" style={{ color: "var(--p-gray-400)" }}>Time on route runs from the driver's first activity on the day (Start route, first "I'm here", or first photo — whichever came first) to their last proof photo.</p>
    </div>
  );
}

// ================================================================= Status
function Status() {
  const status = trpc.plow.auth.status.useQuery();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const change = trpc.plow.auth.changePassword.useMutation();
  const s = status.data;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-card space-y-2 text-sm">
        <h3 className="text-lg mb-2">Integrations</h3>
        <Row ok={!!s?.mapsKey} label="Google Maps key" hint={s?.mapsKey ? "Google Maps active" : "Using OpenStreetMap fallback. Set VITE_GOOGLE_MAPS_API_KEY + GOOGLE_MAPS_API_KEY on Railway for Google Maps & geocoding."} />
        <Row ok={!!s?.emailConfigured} label="Email delivery (Resend)" hint={s?.emailConfigured ? "Owners receive proof emails" : "Set RESEND_API_KEY and PLOW_FROM_EMAIL on Railway."} />
        <Row ok={!!s?.smsConfigured} label="Text delivery (Twilio)" hint={s?.smsConfigured ? "Owners receive proof texts with photo" : "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER on Railway."} />
        <p className="text-xs pt-2" style={{ color: "var(--p-gray-400)" }}>Proofs are always saved with GPS + weather even when messaging isn't configured; use "Resend" in the proof log once keys are added.</p>
      </div>
      <div className="p-card space-y-3">
        <h3 className="text-lg">Change my password</h3>
        <Field label="Current"><input className="p-input" type="password" value={cur} onChange={e => setCur(e.target.value)} /></Field>
        <Field label="New (6+)"><input className="p-input" type="password" value={next} onChange={e => setNext(e.target.value)} /></Field>
        <button className="p-btn p-btn-primary" disabled={change.isPending || next.length < 6} onClick={() => change.mutate({ current: cur, next }, { onSuccess: () => { setCur(""); setNext(""); } })}>Update</button>
        {change.isSuccess && <p className="text-sm" style={{ color: "var(--p-green)" }}>Password updated.</p>}
        {change.error && <p className="text-sm" style={{ color: "var(--p-red)" }}>{change.error.message}</p>}
      </div>
    </div>
  );
}

function Row({ ok, label, hint }: { ok: boolean; label: string; hint: string }) {
  return (
    <div className="flex gap-3 items-start">
      <span className={`p-pill ${ok ? "p-pill-green" : "p-pill-yellow"}`}>{ok ? "on" : "off"}</span>
      <div><div className="font-semibold">{label}</div><div className="text-xs" style={{ color: "var(--p-gray-400)" }}>{hint}</div></div>
    </div>
  );
}

import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { PlowShell, Spinner, fmtDT, fmtTime } from "@/plow/PlowShell";
import PlowMap from "@/plow/PlowMap";

/** Public page a property owner opens from their text / email. */
export default function PlowProofView() {
  const { token } = useParams<{ token: string }>();
  const q = trpc.plow.proofs.byToken.useQuery({ token: token ?? "" }, { enabled: !!token, retry: false });

  return (
    <PlowShell title="Service record" dark={false}>
      <main className="max-w-xl mx-auto px-4 py-6 space-y-4">
        {q.isLoading && <div className="flex justify-center py-16"><Spinner /></div>}
        {q.error && <div className="p-card">This service record could not be found.</div>}
        {q.data && (
          <>
            <div>
              <div className="p-label">Proof of service</div>
              <h1 className="text-2xl">{q.data.address}</h1>
              <p className="text-sm" style={{ color: "var(--p-gray-600)" }}>
                Serviced by <strong>{q.data.driverName}</strong> · {fmtDT(q.data.capturedAt, { year: "numeric", weekday: "short" })} MT
              </p>
            </div>
            {q.data.photos.map((p, i) => (
              <figure key={i} className="p-card" style={{ padding: 0, overflow: "hidden" }}>
                <img src={p.url} alt={`${p.kind} photo`} className="w-full" />
                <figcaption className="px-3 py-2 text-xs flex justify-between" style={{ color: "var(--p-gray-600)" }}>
                  <span className="uppercase tracking-wider font-semibold">{p.kind}</span>
                  <span>{fmtTime(p.capturedAt)}</span>
                </figcaption>
              </figure>
            ))}
            <div className="p-card text-sm space-y-2">
              <Row k="Services">{q.data.services ? q.data.services.split(",").join(", ") : "Snow plowing"}</Row>
              {q.data.saltQty != null && <Row k="Material">{q.data.saltQty} lbs/bags</Row>}
              {q.data.arrivedAt && <Row k="Arrived">{fmtTime(q.data.arrivedAt)}</Row>}
              {q.data.completedAt && <Row k="Completed">{fmtTime(q.data.completedAt)}</Row>}
              {q.data.weather && <Row k="Conditions">{q.data.weather}</Row>}
              {q.data.lat != null && q.data.lng != null && <Row k="GPS"><span className="p-mono">{q.data.lat.toFixed(5)}, {q.data.lng.toFixed(5)}</span></Row>}
              {q.data.note && <Row k="Note">{q.data.note}</Row>}
            </div>
            {q.data.lat != null && q.data.lng != null && (
              <div className="p-card" style={{ padding: 0, height: 220, overflow: "hidden" }}>
                <PlowMap markers={[{ id: "p", lat: q.data.lat, lng: q.data.lng, label: "✓", kind: "done", title: q.data.address }]} />
              </div>
            )}
            <div className="text-center text-sm py-4" style={{ color: "var(--p-gray-600)" }}>
              <div className="font-bold text-base" style={{ color: "var(--p-ink-900)" }}>MDF Estes Park</div>
              Snow plowing · Excavation · Construction<br />
              <a href="tel:9708895771" className="underline">970-889-5771</a> · <a href="mailto:mdfestes@gmail.com" className="underline">mdfestes@gmail.com</a>
            </div>
          </>
        )}
      </main>
    </PlowShell>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="p-label w-24 shrink-0 pt-0.5">{k}</span>
      <span>{children}</span>
    </div>
  );
}

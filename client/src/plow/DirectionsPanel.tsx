import { useState } from "react";
import type { DirectionsInfo, LatLng } from "./PlowMap";
import { fmtDistance, getDeviceFix, navigateUrl } from "./geo";

/**
 * Shared "navigate in-app" state + panel. The map draws the route (via the
 * `directions` prop); this panel shows distance / ETA / turn-by-turn.
 */
export type NavTarget = { lat: number; lng: number; address: string; label: string };

export function useInAppDirections(here?: LatLng | null) {
  const [target, setTarget] = useState<NavTarget | null>(null);
  const [from, setFrom] = useState<LatLng | null>(null);
  const [info, setInfo] = useState<DirectionsInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  async function navigateTo(t: NavTarget) {
    setError(null);
    setInfo(null);
    setTarget(t);
    setLocating(true);
    // Prefer a fresh fix; fall back to the last known position
    const fix = (await getDeviceFix()) ?? (here ? { lat: here.lat, lng: here.lng } : null);
    setLocating(false);
    if (!fix) {
      setError("Couldn't get your location. Allow Location for this site, or use Open in Google Maps.");
      setFrom(null);
      return;
    }
    setFrom({ lat: fix.lat, lng: fix.lng });
  }
  function clear() {
    setTarget(null);
    setFrom(null);
    setInfo(null);
    setError(null);
  }
  const directions = target && from ? { from, to: { lat: target.lat, lng: target.lng } } : null;
  const onDirections = (i: DirectionsInfo | null, err?: string) => {
    setInfo(i);
    if (err) setError(err);
  };
  return { target, directions, info, error, locating, navigateTo, clear, onDirections };
}

export function DirectionsPanel({ nav }: { nav: ReturnType<typeof useInAppDirections> }) {
  const [expanded, setExpanded] = useState(true);
  if (!nav.target) return null;
  const t = nav.target;
  const mins = nav.info ? Math.max(1, Math.round(nav.info.durationS / 60)) : null;
  return (
    <div className="p-card" style={{ borderColor: "var(--p-blue)" }}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">🧭</span>
        <div className="flex-1 min-w-0">
          <div className="p-label">Directions to {t.label}</div>
          <div className="font-semibold truncate">{t.address}</div>
          <div className="text-sm p-mono" style={{ color: "var(--p-gray-400)" }}>
            {nav.locating && "Getting your location…"}
            {!nav.locating && nav.directions && !nav.info && !nav.error && "Calculating route…"}
            {nav.info && `${fmtDistance(nav.info.distanceM)} · about ${mins} min`}
          </div>
          {nav.error && <div className="text-sm mt-1" style={{ color: "var(--p-red)" }}>{nav.error}</div>}
        </div>
        <button className="p-btn p-btn-ghost p-btn-sm" onClick={nav.clear} aria-label="Close directions">✕</button>
      </div>
      {nav.info && nav.info.steps.length > 0 && (
        <div className="mt-3">
          <button className="p-btn p-btn-ghost p-btn-sm" onClick={() => setExpanded(e => !e)}>
            {expanded ? "Hide" : "Show"} {nav.info.steps.length} turns
          </button>
          {expanded && (
            <ol className="mt-2 space-y-1 text-sm max-h-64 overflow-auto">
              {nav.info.steps.map((s, i) => (
                <li key={i} className="flex gap-2 py-1" style={{ borderBottom: "1px solid var(--p-ink-700)" }}>
                  <span className="p-mono text-xs w-5 shrink-0 pt-0.5" style={{ color: "var(--p-gray-400)" }}>{i + 1}</span>
                  <span className="flex-1">{s.text}</span>
                  {s.distanceM > 0 && <span className="p-mono text-xs shrink-0" style={{ color: "var(--p-gray-400)" }}>{fmtDistance(s.distanceM)}</span>}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
      <a className="p-btn p-btn-ghost p-btn-sm mt-3" href={navigateUrl(t)} target="_blank" rel="noreferrer">
        Open in Google Maps for voice guidance ↗
      </a>
    </div>
  );
}

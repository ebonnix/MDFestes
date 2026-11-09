/**
 * Device location helpers for the driver app.
 *
 * Fallback chain for a proof photo:
 *   1. Device GPS (navigator.geolocation, high accuracy, two attempts)
 *   2. Property's geocoded coordinates (flagged locationSource = "property")
 *   3. Manual entry by the driver (locationSource = "manual")
 */

export type Fix = {
  lat: number;
  lng: number;
  accuracyM: number | null;
  source: "gps" | "property" | "manual";
  at: Date;
};

export function geolocationSupported(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

/** Permission state when the Permissions API is available ("granted" | "denied" | "prompt" | "unknown"). */
export async function locationPermission(): Promise<"granted" | "denied" | "prompt" | "unknown"> {
  try {
    if (!("permissions" in navigator)) return "unknown";
    const st = await navigator.permissions.query({ name: "geolocation" as PermissionName });
    return st.state;
  } catch {
    return "unknown";
  }
}

function once(opts: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, opts));
}

/**
 * Get the best GPS fix we can within ~25s. Tries a high-accuracy fix first
 * (true GPS on phones), then a quick low-accuracy fix (cell/wifi) so the
 * driver is never stuck waiting in a canyon with poor sky view.
 */
export async function getDeviceFix(): Promise<Fix | null> {
  if (!geolocationSupported()) return null;
  const attempts: PositionOptions[] = [
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
  ];
  let lastErr: unknown = null;
  for (const o of attempts) {
    try {
      const p = await once(o);
      return {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        accuracyM: p.coords.accuracy ?? null,
        source: "gps",
        at: new Date(p.timestamp || Date.now()),
      };
    } catch (e) {
      lastErr = e;
      // PERMISSION_DENIED (1): no point retrying
      if ((e as GeolocationPositionError)?.code === 1) break;
    }
  }
  console.warn("[plow/geo] no device fix:", lastErr);
  return null;
}

/** Start a background watch; returns a stop function. */
export function watchPosition(cb: (f: Fix) => void, onError?: (e: GeolocationPositionError) => void): () => void {
  if (!geolocationSupported()) return () => {};
  const id = navigator.geolocation.watchPosition(
    p =>
      cb({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        accuracyM: p.coords.accuracy ?? null,
        source: "gps",
        at: new Date(p.timestamp || Date.now()),
      }),
    e => onError?.(e),
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 },
  );
  return () => navigator.geolocation.clearWatch(id);
}

export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function fmtDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1609.344).toFixed(1)} mi`;
}

export function fmtCoord(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

/** Google Maps deep link — opens the Maps app on phones and uses the phone's GPS. */
export function navigateUrl(dest: { lat: number | null; lng: number | null; address: string }): string {
  const d = dest.lat != null && dest.lng != null ? `${dest.lat},${dest.lng}` : dest.address;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(d)}&travelmode=driving`;
}

/** Whole-route deep link (Google caps web links at ~9 waypoints). */
export function navigateRouteUrl(stops: Array<{ lat: number | null; lng: number | null; address: string }>): string {
  const pts = stops.map(s => (s.lat != null && s.lng != null ? `${s.lat},${s.lng}` : s.address));
  if (!pts.length) return "https://www.google.com/maps";
  const dest = pts[pts.length - 1];
  const way = pts.slice(0, -1).slice(0, 9);
  const u = new URL("https://www.google.com/maps/dir/");
  u.searchParams.set("api", "1");
  u.searchParams.set("destination", dest);
  if (way.length) u.searchParams.set("waypoints", way.join("|"));
  u.searchParams.set("travelmode", "driving");
  return u.toString();
}

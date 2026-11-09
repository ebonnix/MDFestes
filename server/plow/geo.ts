/**
 * Geocoding, distance and weather helpers for PlowOps.
 *
 * Geocoding: Google Geocoding API when GOOGLE_MAPS_API_KEY is set, otherwise
 * falls back to OpenStreetMap Nominatim (free, no key; 1 req/sec policy).
 * Weather: Open-Meteo (free, no key) — attached to each proof for the
 * slip-and-fall liability log.
 */

export type LatLng = { lat: number; lng: number };

// Estes Park, CO — used to bias geocoding results.
const BIAS: LatLng = { lat: 40.3772, lng: -105.5217 };

export async function geocodeAddress(address: string): Promise<(LatLng & { formatted: string }) | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const q = address.trim();
  if (!q) return null;

  if (key) {
    try {
      const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
      url.searchParams.set("address", q);
      url.searchParams.set("region", "us");
      url.searchParams.set("components", "country:US");
      url.searchParams.set("location", `${BIAS.lat},${BIAS.lng}`);
      url.searchParams.set("key", key);
      const res = await fetch(url);
      const json: any = await res.json();
      const hit = json?.results?.[0];
      if (hit?.geometry?.location) {
        return {
          lat: hit.geometry.location.lat,
          lng: hit.geometry.location.lng,
          formatted: hit.formatted_address ?? q,
        };
      }
    } catch (e) {
      console.warn("[plow/geo] Google geocode failed, falling back to OSM:", e);
    }
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "us");
    // Bias toward the Estes Park area
    url.searchParams.set("viewbox", `${BIAS.lng - 0.6},${BIAS.lat + 0.4},${BIAS.lng + 0.6},${BIAS.lat - 0.4}`);
    const res = await fetch(url, { headers: { "User-Agent": "MDF-PlowOps/1.0 (mdfestes.com)" } });
    const json: any = await res.json();
    const hit = json?.[0];
    if (hit) {
      return { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon), formatted: hit.display_name ?? q };
    }
  } catch (e) {
    console.warn("[plow/geo] OSM geocode failed:", e);
  }
  return null;
}

/** Haversine distance in meters. */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * Nearest-neighbour ordering of stops starting from `start` (driver's current
 * position or first stop). Good enough for a 10–40 stop plow route.
 */
export function nearestNeighborOrder<T extends { id: number; lat: number | null; lng: number | null }>(
  stops: T[],
  start?: LatLng | null,
): T[] {
  const remaining = [...stops];
  const ordered: T[] = [];
  let cur: LatLng | null = start ?? null;
  // stops without coordinates go to the end in original order
  const noCoords = remaining.filter(s => s.lat == null || s.lng == null);
  let pool = remaining.filter(s => s.lat != null && s.lng != null);
  if (!cur && pool.length) {
    const first = pool.shift()!;
    ordered.push(first);
    cur = { lat: first.lat!, lng: first.lng! };
  }
  while (pool.length && cur) {
    let bestIdx = 0;
    let best = Infinity;
    for (let i = 0; i < pool.length; i++) {
      const d = distanceMeters(cur, { lat: pool[i].lat!, lng: pool[i].lng! });
      if (d < best) {
        best = d;
        bestIdx = i;
      }
    }
    const next = pool.splice(bestIdx, 1)[0];
    ordered.push(next);
    cur = { lat: next.lat!, lng: next.lng! };
  }
  return [...ordered, ...noCoords];
}

/** Current weather snapshot as a short string, e.g. "24°F · snow 0.3 in/h · wind 12 mph". */
export async function weatherSnapshot(p: LatLng): Promise<string | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(p.lat));
    url.searchParams.set("longitude", String(p.lng));
    url.searchParams.set("current", "temperature_2m,precipitation,snowfall,wind_speed_10m,weather_code");
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("precipitation_unit", "inch");
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const json: any = await res.json();
    const c = json?.current;
    if (!c) return null;
    const parts = [`${Math.round(c.temperature_2m)}°F`];
    if (c.snowfall > 0) parts.push(`snow ${c.snowfall} in/h`);
    else if (c.precipitation > 0) parts.push(`precip ${c.precipitation} in/h`);
    parts.push(`wind ${Math.round(c.wind_speed_10m)} mph`);
    return parts.join(" · ");
  } catch {
    return null;
  }
}

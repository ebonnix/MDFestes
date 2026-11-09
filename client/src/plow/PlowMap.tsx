import { useEffect, useRef } from "react";

/**
 * Route map. Uses Google Maps JS when VITE_GOOGLE_MAPS_API_KEY is set,
 * otherwise falls back to Leaflet + OpenStreetMap tiles (no key needed) so
 * the app always shows a real map.
 */

export type MapMarker = {
  id: string | number;
  lat: number;
  lng: number;
  label: string; // short text inside the pin (stop number, "T", "ME")
  title?: string;
  kind: "stop" | "done" | "truck" | "me";
  onClick?: () => void;
};

export type LatLng = { lat: number; lng: number };
export type DirectionsStep = { text: string; distanceM: number };
export type DirectionsInfo = { distanceM: number; durationS: number; steps: DirectionsStep[]; provider: "google" | "osrm" };

type Props = {
  markers: MapMarker[];
  path?: LatLng[];
  className?: string;
  fitKey?: string; // change to re-fit bounds
  /** When set, draws driving directions from → to and reports the turn list via onDirections. */
  directions?: { from: LatLng; to: LatLng } | null;
  onDirections?: (info: DirectionsInfo | null, error?: string) => void;
};

const GKEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

let gmapsPromise: Promise<void> | null = null;
function loadGoogle(): Promise<void> {
  if (gmapsPromise) return gmapsPromise;
  gmapsPromise = new Promise((res, rej) => {
    if ((window as any).google?.maps) return res();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GKEY}&v=weekly&loading=async`;
    s.async = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error("Google Maps failed to load"));
    document.head.appendChild(s);
  });
  return gmapsPromise;
}

let leafletPromise: Promise<any> | null = null;
function loadLeaflet(): Promise<any> {
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise((res, rej) => {
    if ((window as any).L) return res((window as any).L);
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = () => res((window as any).L);
    s.onerror = () => rej(new Error("Leaflet failed to load"));
    document.head.appendChild(s);
  });
  return leafletPromise;
}

const COLORS: Record<MapMarker["kind"], string> = { stop: "#FF5C1C", done: "#1E9E5A", truck: "#1E62E0", me: "#FFC400" };

export default function PlowMap({ markers, path, className, fitKey, directions, onDirections }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const state = useRef<{ map?: any; layers: any[]; L?: any; kind?: "g" | "l"; dirLayers: any[]; dirRenderer?: any }>({ layers: [], dirLayers: [] });
  const onDirRef = useRef(onDirections);
  onDirRef.current = onDirections;

  // init
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!el.current) return;
      if (GKEY) {
        try {
          await loadGoogle();
          if (cancelled) return;
          const g = (window as any).google;
          state.current.map = new g.maps.Map(el.current, {
            center: { lat: 40.3772, lng: -105.5217 },
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            gestureHandling: "greedy",
          });
          state.current.kind = "g";
          render();
          return;
        } catch (e) {
          console.warn("[PlowMap] Google failed, using OSM", e);
        }
      }
      let L: any;
      try {
        L = await loadLeaflet();
      } catch (e) {
        console.warn("[PlowMap] map libraries unavailable", e);
        if (el.current) el.current.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:16px;text-align:center;color:#8496AB;font-size:14px">Map unavailable (no connection). Use the Navigate buttons — they open Google Maps with your phone\'s GPS.</div>';
        return;
      }
      if (cancelled || !el.current) return;
      state.current.L = L;
      state.current.kind = "l";
      state.current.map = L.map(el.current, { zoomControl: true }).setView([40.3772, -105.5217], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(state.current.map);
      render();
    })();
    return () => {
      cancelled = true;
      if (state.current.kind === "l" && state.current.map) state.current.map.remove();
      state.current = { layers: [], dirLayers: [] };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function render() {
    const st = state.current;
    if (!st.map) return;
    // clear
    for (const l of st.layers) {
      if (st.kind === "g") l.setMap(null);
      else l.remove();
    }
    st.layers = [];
    const pts = markers.map(m => ({ lat: m.lat, lng: m.lng }));
    if (st.kind === "g") {
      const g = (window as any).google;
      for (const m of markers) {
        const mk = new g.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map: st.map,
          title: m.title ?? m.label,
          label: { text: m.label, color: m.kind === "me" ? "#0E1B2C" : "#fff", fontFamily: "IBM Plex Mono, monospace", fontWeight: "600", fontSize: "12px" },
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: COLORS[m.kind],
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
          zIndex: m.kind === "me" || m.kind === "truck" ? 10 : 1,
        });
        if (m.onClick) mk.addListener("click", m.onClick);
        st.layers.push(mk);
      }
      if (path && path.length > 1) {
        st.layers.push(new g.maps.Polyline({ path, map: st.map, strokeColor: "#FF5C1C", strokeOpacity: 0.8, strokeWeight: 3 }));
      }
      if (pts.length) {
        const b = new g.maps.LatLngBounds();
        pts.forEach(p => b.extend(p));
        st.map.fitBounds(b, 48);
        if (pts.length === 1) st.map.setZoom(15);
      }
    } else if (st.kind === "l" && st.L) {
      const L = st.L;
      for (const m of markers) {
        const icon = L.divIcon({
          className: "",
          html: `<div class="p-marker ${m.kind}"><span>${m.label}</span></div>`,
          iconSize: [28, 28],
          iconAnchor: m.kind === "stop" || m.kind === "done" ? [4, 28] : [14, 14],
        });
        const mk = L.marker([m.lat, m.lng], { icon, title: m.title ?? m.label }).addTo(st.map);
        if (m.onClick) mk.on("click", m.onClick);
        st.layers.push(mk);
      }
      if (path && path.length > 1) {
        st.layers.push(L.polyline(path.map(p => [p.lat, p.lng]), { color: "#FF5C1C", weight: 3, opacity: 0.8 }).addTo(st.map));
      }
      if (pts.length) {
        const b = L.latLngBounds(pts.map(p => [p.lat, p.lng]));
        st.map.fitBounds(b, { padding: [40, 40], maxZoom: 16 });
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => render(), [markers, path, fitKey]);

  // ---- Driving directions overlay ----
  useEffect(() => {
    const st = state.current;
    let cancelled = false;
    const clear = () => {
      for (const l of st.dirLayers) (st.kind === "g" ? l.setMap(null) : l.remove());
      st.dirLayers = [];
      if (st.dirRenderer) {
        st.dirRenderer.setMap(null);
        st.dirRenderer = undefined;
      }
    };
    clear();
    if (!directions) return;
    const { from, to } = directions;
    // Map may still be loading — poll briefly until it exists
    const run = async () => {
      for (let i = 0; i < 40 && !st.map && !cancelled; i++) await new Promise(r => setTimeout(r, 150));
      if (cancelled || !st.map) return;
      if (st.kind === "g") {
        const g = (window as any).google;
        try {
          const svc = new g.maps.DirectionsService();
          const res = await svc.route({ origin: from, destination: to, travelMode: g.maps.TravelMode.DRIVING });
          if (cancelled) return;
          st.dirRenderer = new g.maps.DirectionsRenderer({ map: st.map, directions: res, suppressMarkers: true, preserveViewport: false, polylineOptions: { strokeColor: "#1E62E0", strokeWeight: 5, strokeOpacity: 0.9 } });
          const leg = res.routes[0].legs[0];
          onDirRef.current?.({
            provider: "google",
            distanceM: leg.distance.value,
            durationS: leg.duration.value,
            steps: leg.steps.map((s: any) => ({ text: String(s.instructions).replace(/<[^>]+>/g, ""), distanceM: s.distance.value })),
          });
          return;
        } catch (e) {
          console.warn("[PlowMap] Google directions failed, trying OSRM", e);
        }
      }
      // OSRM (free, no key) — used with the OSM map, or as a fallback if the Google Directions API isn't enabled
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true`;
        const json = await (await fetch(url)).json();
        if (cancelled) return;
        const route = json?.routes?.[0];
        if (!route) throw new Error(json?.message || "No route found");
        const coords: LatLng[] = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng }));
        if (st.kind === "g") {
          const g = (window as any).google;
          st.dirLayers.push(new g.maps.Polyline({ path: coords, map: st.map, strokeColor: "#1E62E0", strokeWeight: 5, strokeOpacity: 0.9 }));
          const b = new g.maps.LatLngBounds();
          coords.forEach(c => b.extend(c));
          st.map.fitBounds(b, 48);
        } else if (st.L) {
          const line = st.L.polyline(coords.map(c => [c.lat, c.lng]), { color: "#1E62E0", weight: 5, opacity: 0.9 }).addTo(st.map);
          st.dirLayers.push(line);
          st.map.fitBounds(line.getBounds(), { padding: [40, 40] });
        }
        const steps: DirectionsStep[] = route.legs[0].steps.map((s: any) => ({ text: osrmInstruction(s), distanceM: s.distance }));
        onDirRef.current?.({ provider: "osrm", distanceM: route.distance, durationS: route.duration, steps });
      } catch (e) {
        onDirRef.current?.(null, e instanceof Error ? e.message : String(e));
      }
    };
    run();
    return () => {
      cancelled = true;
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directions?.from.lat, directions?.from.lng, directions?.to.lat, directions?.to.lng]);

  return <div ref={el} className={`plow-map-root p-map ${className ?? ""}`} />;
}

/** Turn an OSRM step into a readable instruction. */
function osrmInstruction(step: any): string {
  const m = step.maneuver ?? {};
  const road = step.name ? ` onto ${step.name}` : "";
  const mod = (m.modifier ?? "").replace("slight ", "slight-").replace("sharp ", "sharp-");
  const dir = mod ? mod.replace("-", " ") : "";
  switch (m.type) {
    case "depart": return `Head ${dir || "out"}${step.name ? ` on ${step.name}` : ""}`;
    case "arrive": return `Arrive at destination${m.modifier ? ` (on the ${m.modifier})` : ""}`;
    case "turn": return `Turn ${dir}${road}`;
    case "new name": return `Continue${road}`;
    case "continue": return `Continue ${dir}${road}`;
    case "merge": return `Merge ${dir}${road}`;
    case "on ramp": return `Take the ramp ${dir}${road}`;
    case "off ramp": return `Take the exit ${dir}${road}`;
    case "fork": return `Keep ${dir} at the fork${road}`;
    case "end of road": return `At the end of the road turn ${dir}${road}`;
    case "roundabout":
    case "rotary": return `Enter the roundabout${m.exit ? ` and take exit ${m.exit}` : ""}${road}`;
    case "exit roundabout": return `Exit the roundabout${road}`;
    default: return `${m.type ? m.type[0].toUpperCase() + m.type.slice(1) : "Continue"} ${dir}${road}`.trim();
  }
}

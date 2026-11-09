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

type Props = {
  markers: MapMarker[];
  path?: Array<{ lat: number; lng: number }>;
  className?: string;
  fitKey?: string; // change to re-fit bounds
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

export default function PlowMap({ markers, path, className, fitKey }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const state = useRef<{ map?: any; layers: any[]; L?: any; kind?: "g" | "l" }>({ layers: [] });

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
      state.current = { layers: [] };
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

  return <div ref={el} className={`plow-map-root p-map ${className ?? ""}`} />;
}

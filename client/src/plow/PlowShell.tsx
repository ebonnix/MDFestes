import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import "./plow.css";

const FONTS = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..800&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

export function usePlowFonts() {
  useEffect(() => {
    if (document.querySelector('link[data-plow-fonts]')) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONTS;
    l.setAttribute("data-plow-fonts", "1");
    document.head.appendChild(l);
  }, []);
}

export function PlowShell({
  children,
  title,
  dark = true,
  right,
}: {
  children: ReactNode;
  title?: string;
  dark?: boolean;
  right?: ReactNode;
}) {
  usePlowFonts();
  useEffect(() => {
    document.title = title ? `${title} · MDF PlowOps` : "MDF PlowOps";
  }, [title]);
  return (
    <div className={`plow ${dark ? "plow-dark" : ""}`}>
      <header className="p-topbar">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/plow" className="flex items-center gap-2 no-underline text-white">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "var(--p-orange)" }} />
            <span className="font-extrabold tracking-tight" style={{ fontStretch: "125%" }}>
              MDF <span style={{ color: "var(--p-orange)" }}>PlowOps</span>
            </span>
            {title && <span className="hidden sm:inline text-sm" style={{ color: "var(--p-gray-400)" }}>/ {title}</span>}
          </Link>
          <div className="flex items-center gap-2">{right}</div>
        </div>
      </header>
      {children}
    </div>
  );
}

/** Logout button used in both admin and driver headers. */
export function LogoutButton() {
  const [, nav] = useLocation();
  const utils = trpc.useUtils();
  const logout = trpc.plow.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.plow.auth.me.invalidate();
      nav("/plow");
    },
  });
  return (
    <button className="p-btn p-btn-ghost p-btn-sm text-white" onClick={() => logout.mutate()}>
      Log out
    </button>
  );
}

/** Redirects to /plow (login) when the plow session is missing or wrong role. */
export function usePlowGuard(role?: "admin" | "driver") {
  const [, nav] = useLocation();
  const me = trpc.plow.auth.me.useQuery(undefined, { retry: false, staleTime: 60_000 });
  useEffect(() => {
    if (me.isLoading) return;
    if (!me.data) nav("/plow");
    else if (role === "admin" && me.data.role !== "admin") nav("/plow/driver");
  }, [me.isLoading, me.data, role, nav]);
  return me;
}

export function Spinner() {
  return <span className="p-spinner" aria-label="loading" />;
}

export function fmtDT(d: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", ...opts });
}

export function fmtTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleTimeString("en-US", { timeZone: "America/Denver", hour: "numeric", minute: "2-digit" });
}

export function todayDenver(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Denver" }).format(new Date());
}

export const SERVICE_OPTIONS = [
  { id: "plow", label: "Plow" },
  { id: "shovel", label: "Shovel walks" },
  { id: "salt", label: "Salt / de-ice" },
  { id: "sand", label: "Sand" },
] as const;
export type ServiceId = (typeof SERVICE_OPTIONS)[number]["id"];

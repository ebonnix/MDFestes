import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { PlowShell, Spinner } from "@/plow/PlowShell";

export default function PlowLogin() {
  const [, nav] = useLocation();
  const utils = trpc.useUtils();
  const status = trpc.plow.auth.status.useQuery(undefined, { retry: false });
  const me = trpc.plow.auth.me.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (me.data) nav(me.data.role === "admin" ? "/plow/admin" : "/plow/driver");
  }, [me.data, nav]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const login = trpc.plow.auth.login.useMutation({
    onSuccess: async u => {
      await utils.plow.auth.me.invalidate();
      nav(u.role === "admin" ? "/plow/admin" : "/plow/driver");
    },
    onError: e => setError(e.message),
  });

  // ---- first-run setup ----
  const [setup, setSetup] = useState({ sitePassword: "", username: "", password: "", name: "", phone: "", email: "" });
  const doSetup = trpc.plow.auth.setup.useMutation({
    onSuccess: async () => {
      await utils.plow.auth.me.invalidate();
      nav("/plow/admin");
    },
    onError: e => setError(e.message),
  });

  const needsSetup = status.data?.needsSetup;

  return (
    <PlowShell title={needsSetup ? "Setup" : "Sign in"}>
      <main className="max-w-md mx-auto px-4 py-10">
        <div className="p-card">
          {status.isLoading || me.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : needsSetup ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                setError(null);
                doSetup.mutate({
                  sitePassword: setup.sitePassword,
                  username: setup.username,
                  password: setup.password,
                  name: setup.name,
                  phone: setup.phone || undefined,
                  email: setup.email || undefined,
                });
              }}
              className="space-y-4"
            >
              <div>
                <div className="p-label mb-1">First-time setup</div>
                <h1 className="text-2xl">Create the owner account</h1>
                <p className="text-sm mt-1" style={{ color: "var(--p-gray-400)" }}>
                  This account manages drivers, properties and routes. Enter the website admin password to confirm you own the site.
                </p>
              </div>
              <Field label="Website admin password">
                <input className="p-input" type="password" required value={setup.sitePassword} onChange={e => setSetup({ ...setup, sitePassword: e.target.value })} />
              </Field>
              <Field label="Your name">
                <input className="p-input" required value={setup.name} onChange={e => setSetup({ ...setup, name: e.target.value })} placeholder="Mike" />
              </Field>
              <Field label="Username">
                <input className="p-input" required autoCapitalize="none" value={setup.username} onChange={e => setSetup({ ...setup, username: e.target.value })} placeholder="mike" />
              </Field>
              <Field label="Password (6+ characters)">
                <input className="p-input" type="password" required minLength={6} value={setup.password} onChange={e => setSetup({ ...setup, password: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone (optional)">
                  <input className="p-input" value={setup.phone} onChange={e => setSetup({ ...setup, phone: e.target.value })} />
                </Field>
                <Field label="Email (optional)">
                  <input className="p-input" type="email" value={setup.email} onChange={e => setSetup({ ...setup, email: e.target.value })} />
                </Field>
              </div>
              {error && <p className="text-sm" style={{ color: "var(--p-red)" }}>{error}</p>}
              <button className="p-btn p-btn-primary w-full" disabled={doSetup.isPending}>
                {doSetup.isPending ? <Spinner /> : "Create owner account"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                setError(null);
                login.mutate({ username, password });
              }}
              className="space-y-4"
            >
              <div>
                <div className="p-label mb-1">Driver &amp; owner sign in</div>
                <h1 className="text-2xl">Welcome back</h1>
              </div>
              <Field label="Username">
                <input className="p-input" required autoCapitalize="none" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} />
              </Field>
              <Field label="Password">
                <input className="p-input" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
              </Field>
              {error && <p className="text-sm" style={{ color: "var(--p-red)" }}>{error}</p>}
              <button className="p-btn p-btn-primary w-full" disabled={login.isPending}>
                {login.isPending ? <Spinner /> : "Sign in"}
              </button>
              <p className="text-xs text-center" style={{ color: "var(--p-gray-400)" }}>
                Drivers: your login was created by the owner. Forgot it? Call 970-889-5771.
              </p>
            </form>
          )}
        </div>
      </main>
    </PlowShell>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="p-label block mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs mt-1" style={{ color: "var(--p-gray-400)" }}>{hint}</span>}
    </label>
  );
}

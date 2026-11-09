/**
 * Proof-of-service delivery to property owners.
 *
 * Email: Resend HTTP API (RESEND_API_KEY, PLOW_FROM_EMAIL)
 * SMS:   Twilio REST API (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)
 *
 * Both use plain fetch — no new npm dependencies. When a provider is not
 * configured the function returns { ok: false, skipped: true } so the proof is
 * still saved and the owner can be notified later from the admin panel.
 */

export type DeliveryResult = { ok: boolean; skipped?: boolean; error?: string };

export function appBaseUrl(): string {
  return (process.env.APP_BASE_URL || "https://mdfestes.com").replace(/\/$/, "");
}

export function emailConfigured() {
  return !!process.env.RESEND_API_KEY;
}
export function smsConfigured() {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
}

export type ProofMessage = {
  ownerName: string;
  address: string;
  driverName: string;
  capturedAt: Date;
  lat: number | null;
  lng: number | null;
  services: string | null;
  weather: string | null;
  proofUrl: string; // public page
  photoUrl: string; // absolute image URL
  photoBase64?: string; // optional jpeg for email attachment
  cc?: string[]; // admin addresses copied on every proof email
};

function fmtDate(d: Date) {
  return d.toLocaleString("en-US", {
    timeZone: "America/Denver",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function sendProofEmail(to: string, m: ProofMessage): Promise<DeliveryResult> {
  if (!emailConfigured()) return { ok: false, skipped: true, error: "RESEND_API_KEY not set" };
  const from = process.env.PLOW_FROM_EMAIL || "MDF Estes Park <plow@mdfestes.com>";
  const services = m.services ? m.services.split(",").join(", ") : "snow plowing";
  const coords = m.lat != null && m.lng != null ? `${m.lat.toFixed(5)}, ${m.lng.toFixed(5)}` : "n/a";
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0E1B2C">
    <div style="background:#0E1B2C;color:#fff;padding:16px 20px">
      <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#FF5C1C">Proof of Service</div>
      <div style="font-size:20px;font-weight:bold">MDF Estes Park</div>
    </div>
    <div style="padding:20px">
      <p>Hi ${escapeHtml(m.ownerName)},</p>
      <p>Your property at <strong>${escapeHtml(m.address)}</strong> was serviced (${escapeHtml(services)}) by <strong>${escapeHtml(m.driverName)}</strong> on <strong>${fmtDate(m.capturedAt)}</strong> (Mountain Time).</p>
      <a href="${m.proofUrl}"><img src="${m.photoUrl}" alt="Proof photo" style="width:100%;border-radius:4px;border:1px solid #ddd"/></a>
      <table style="font-size:13px;margin-top:12px;border-collapse:collapse">
        <tr><td style="padding:4px 8px;color:#5F7288">GPS</td><td style="padding:4px 8px;font-family:monospace">${coords}</td></tr>
        ${m.weather ? `<tr><td style="padding:4px 8px;color:#5F7288">Weather</td><td style="padding:4px 8px">${escapeHtml(m.weather)}</td></tr>` : ""}
      </table>
      <p style="margin-top:16px"><a href="${m.proofUrl}" style="background:#FF5C1C;color:#fff;padding:10px 16px;text-decoration:none;border-radius:3px;font-weight:bold">View service record</a></p>
      <p style="font-size:12px;color:#5F7288;margin-top:24px">Questions? Call or text 970-889-5771 · mdfestes@gmail.com</p>
    </div>
  </div>`;

  const cc = (m.cc ?? []).map(e => e.trim().toLowerCase()).filter(e => e && e !== to.trim().toLowerCase());
  const body: Record<string, unknown> = {
    from,
    to: [to],
    ...(cc.length ? { cc: Array.from(new Set(cc)) } : {}),
    subject: `Plowed: ${m.address} — ${fmtDate(m.capturedAt)}`,
    html,
  };
  if (m.photoBase64) {
    body.attachments = [{ filename: "proof-of-service.jpg", content: m.photoBase64 }];
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function sendProofSms(to: string, m: ProofMessage): Promise<DeliveryResult> {
  if (!smsConfigured()) return { ok: false, skipped: true, error: "Twilio env not set" };
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_FROM_NUMBER!;
  const text = `MDF Estes Park: ${m.address} was plowed by ${m.driverName} on ${fmtDate(m.capturedAt)}. Photo + GPS proof: ${m.proofUrl}`;
  const params = new URLSearchParams({ To: normalizePhone(to), From: from, Body: text });
  // MMS with the stamped photo attached
  params.append("MediaUrl", m.photoUrl);
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { ok: false, error: `Twilio ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function normalizePhone(p: string): string {
  const digits = p.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return p.startsWith("+") ? p : `+${digits}`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

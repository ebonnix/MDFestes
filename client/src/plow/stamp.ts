/**
 * Burns a proof-of-service stamp into the bottom-right corner of a photo.
 *
 * Spec: the stamp block is 10% of the picture height, right-justified in the
 * bottom-right corner, and shows Address · Latitude/Longitude · Date · Time ·
 * Driver name. Returns a JPEG data URL plus a base64 body ready for upload.
 */

export type StampInfo = {
  address: string;
  lat: number | null;
  lng: number | null;
  when: Date;
  driverName: string;
  locationSource?: "gps" | "property" | "manual";
  accuracyM?: number | null;
};

const MAX_DIM = 1600; // keeps uploads ~300–600 KB

async function loadImage(file: Blob): Promise<{ draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; w: number; h: number }> {
  // createImageBitmap honours EXIF orientation so phone photos aren't sideways.
  if ("createImageBitmap" in window) {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
      return { w: bmp.width, h: bmp.height, draw: (ctx, w, h) => ctx.drawImage(bmp, 0, 0, w, h) };
    } catch {
      /* fall through */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    return { w: img.naturalWidth, h: img.naturalHeight, draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h) };
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export function formatStampLines(info: StampInfo): string[] {
  const date = info.when.toLocaleDateString("en-US", { timeZone: "America/Denver", month: "2-digit", day: "2-digit", year: "numeric" });
  const time = info.when.toLocaleTimeString("en-US", { timeZone: "America/Denver", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const coords =
    info.lat != null && info.lng != null
      ? `LAT ${info.lat.toFixed(6)}  LON ${info.lng.toFixed(6)}` +
        (info.locationSource === "property" ? " (property)" : info.locationSource === "manual" ? " (manual)" : info.accuracyM ? ` ±${Math.round(info.accuracyM)}m` : "")
      : "GPS UNAVAILABLE";
  return [info.address.toUpperCase(), coords, `${date}  ${time} MT`, `DRIVER: ${info.driverName.toUpperCase()}`];
}

export async function stampPhoto(file: Blob, info: StampInfo): Promise<{ dataUrl: string; base64: string; width: number; height: number }> {
  const src = await loadImage(file);
  const scale = Math.min(1, MAX_DIM / Math.max(src.w, src.h));
  const W = Math.round(src.w * scale);
  const H = Math.round(src.h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  src.draw(ctx, W, H);

  // ---- Stamp block: 10% of picture height, bottom-right ----
  const blockH = Math.round(H * 0.1);
  const margin = Math.round(Math.min(W, H) * 0.012);
  const pad = Math.round(blockH * 0.12);
  const lines = formatStampLines(info);
  const header = "MDF ESTES PARK · PROOF OF SERVICE";
  const rows = lines.length + 1; // header + 4 lines
  const lineH = (blockH - pad * 2) / rows;
  let fontPx = Math.floor(lineH * 0.78);

  const mono = (px: number, weight = 500) => `${weight} ${px}px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace`;

  // Shrink font until the widest line fits in 70% of the picture width.
  const maxBlockW = W * 0.7;
  let textW = 0;
  for (;;) {
    ctx.font = mono(fontPx, 500);
    textW = Math.max(...lines.map(l => ctx.measureText(l).width));
    ctx.font = mono(Math.round(fontPx * 0.8), 600);
    textW = Math.max(textW, ctx.measureText(header).width);
    if (textW + pad * 2 <= maxBlockW || fontPx <= 8) break;
    fontPx -= 1;
  }
  const blockW = Math.round(textW + pad * 2);
  const x = W - margin - blockW;
  const y = H - margin - blockH;

  // Background + orange accent bar (right edge)
  ctx.fillStyle = "rgba(14, 27, 44, 0.82)";
  ctx.fillRect(x, y, blockW, blockH);
  ctx.fillStyle = "#FF5C1C";
  ctx.fillRect(x + blockW - Math.max(3, Math.round(blockW * 0.008)), y, Math.max(3, Math.round(blockW * 0.008)), blockH);

  // Text, right-justified
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const rightX = x + blockW - pad - Math.max(4, Math.round(blockW * 0.012));
  let cy = y + pad + lineH / 2;
  ctx.font = mono(Math.round(fontPx * 0.8), 600);
  ctx.fillStyle = "#FF5C1C";
  ctx.fillText(header, rightX, cy);
  cy += lineH;
  ctx.font = mono(fontPx, 500);
  ctx.fillStyle = "#FFFFFF";
  for (const l of lines) {
    ctx.fillText(l, rightX, cy);
    cy += lineH;
  }

  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return { dataUrl, base64: dataUrl.split(",")[1], width: W, height: H };
}

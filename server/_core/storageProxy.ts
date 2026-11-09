import type { Express } from "express";
import { storageGetObject } from "../storage";

export function registerStorageProxy(app: Express) {
  // Support both old /manus-storage/ paths and new /mdf-storage/ paths.
  // Bytes are served directly from the database (no external storage).
  app.get(["/manus-storage/*", "/mdf-storage/*"], async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    try {
      const obj = await storageGetObject(key);
      if (!obj) {
        res.status(404).send("Not found");
        return;
      }
      res.set("Content-Type", obj.contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.send(obj.data);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

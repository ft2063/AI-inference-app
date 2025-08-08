// index.js — full, debug-friendly MP4 server
import express from "express";
import multer from "multer";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import OpenAI from "openai";

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ensure folders exist
await fsp.mkdir("uploads", { recursive: true });
await fsp.mkdir("debug", { recursive: true });

// Always save as .mp4 so Whisper recognizes the container
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, "upload.m4a"),
  });
const upload = multer({ storage });

// Health
app.get("/", (_, res) =>
  res.type("text/plain").send("OK – POST /transcribe with multipart field 'file'")
);
app.get("/health", async (_, res) => res.json({ ok: true }));

app.post("/transcribe", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });

    // Basic request logs
    console.log("---- Incoming upload ----");
    console.log("originalname:", req.file.originalname);
    console.log("mimetype    :", req.file.mimetype);
    console.log("saved path  :", req.file.path);
    console.log("size bytes  :", req.file.size);

    // Save a copy to debug/ with timestamp (for manual playback)
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const debugCopy = path.join("debug", `rec-${stamp}.mp4`);
    await fsp.copyFile(req.file.path, debugCopy);

    // Peek header (should include 'ftyp')
    const fd = await fsp.open(req.file.path, "r");
    const buf = Buffer.alloc(12);
    await fd.read(buf, 0, 12, 0);
    await fd.close();
    console.log("header bytes:", buf.toString("ascii"));
    console.log("-------------------------");

    if (req.file.size < 12000) {
      console.warn("⚠️ File is very small; likely silent mic or permissions issue.");
    }

    // Optional: force language via query (?lang=en)
    const forcedLang = (req.query.lang || "").toString().trim() || undefined;

    // Log the API call details
    const apiCall = {
      filePath: req.file.path,
      model: "whisper-1",
      response_format: "verbose_json",
      temperature: 0,
      ...(forcedLang ? { language: forcedLang } : {}),
    };
    console.log(">>> Sending to OpenAI Whisper API with:");
    console.log(apiCall);

    // Call Whisper
    const result = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
      response_format: "verbose_json",
      temperature: 0,
      ...(forcedLang ? { language: forcedLang } : {}),
    });

    // Log raw response
    console.log("<<< Whisper API raw response:");
    console.dir(result, { depth: null });

    // Pretty print transcript + segments
    console.log("\n===== TRANSCRIPT =====");
    console.log(result.text || "(empty)");
    console.log("======================\n");

    if (Array.isArray(result.segments)) {
      console.log("Segments:", result.segments.length, " Duration(s):", result.duration);
      for (const s of result.segments) {
        const t0 = Number(s.start ?? 0).toFixed(2);
        const t1 = Number(s.end ?? 0).toFixed(2);
        console.log(`[${t0}s–${t1}s] ${s.text}`);
      }
      console.log("==== END SEGMENTS ====\n");
    }

    // Cleanup temp
    fsp.unlink(req.file.path).catch(() => {});

    res.json({
      text: result.text || "",
      duration: result.duration ?? null,
      segments: result.segments ?? [],
      debugFile: debugCopy,
    });
  } catch (e) {
    console.error("Transcription error:", e);
    res.status(500).send(String(e));
  }
});

app.listen(3001, "0.0.0.0", () => console.log("Transcribe server → http://0.0.0.0:3001"));

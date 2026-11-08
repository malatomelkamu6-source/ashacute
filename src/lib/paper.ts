/* Shared, browser-safe helpers for scanned exam papers. */
export type ScannedQuestion = { text: string; options: [string, string, string, string]; answer: number | null; marks: number };

/** Turns the reader's reply into four-choice questions in paper order; skips anything without a question and two choices. */
export function normalizeScanned(parsed: unknown): ScannedQuestion[] {
  const list = (parsed as { questions?: unknown })?.questions;
  if (!Array.isArray(list)) return [];
  const out: ScannedQuestion[] = [];
  for (const q of list) {
    if (!q || typeof q !== "object") continue;
    const r = q as Record<string, unknown>;
    const text = String(r["text"] ?? "").replace(/^\s*(?:Q(?:uestion)?\s*)?\d+\s*[.):-]\s*/i, "").trim().slice(0, 2000);
    const opts = (Array.isArray(r["options"]) ? r["options"] : [])
      .map((o) => String(o ?? "").replace(/^\s*\(?[A-Da-d][.)]\s*/, "").trim().slice(0, 500))
      .filter(Boolean);
    if (!text || opts.length < 2) continue;
    const options = [opts[0] ?? "", opts[1] ?? "", opts[2] ?? "", opts[3] ?? ""] as [string, string, string, string];
    const shown = !("answer_evidence" in r) || (typeof r["answer_evidence"] === "string" && r["answer_evidence"].trim() !== "");
    const letter = shown && typeof r["answer"] === "string" ? r["answer"].trim().toUpperCase().replace(/[^A-D]/g, "").charAt(0) : "";
    const idx = "ABCD".indexOf(letter);
    const answer = idx >= 0 && options[idx] ? idx : null;
    const m = Math.round(Number(r["marks"]));
    out.push({ text, options, answer, marks: Number.isFinite(m) && m > 0 ? Math.min(10, m) : 1 });
  }
  return out.slice(0, 300);
}

export const PAPER_ACCEPT = ".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp";
export const MAX_PAPER_BYTES = 15 * 1024 * 1024;

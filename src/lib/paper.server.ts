/* Reads an uploaded exam paper (PDF, photo, or text pulled from Word/text files)
   and returns its multiple-choice questions in order, each choice in its place. */
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

export type ScannedQuestion = { text: string; options: [string, string, string, string]; answer: number | null; marks: number };

const PROMPT = `You are reading a school multiple-choice exam paper. Extract EVERY question in the exact order it appears.
For each question return:
- "text": the full question wording without its number (keep any passage, table text or formula written inline),
- "options": its choices in order (A, B, C, D ...) without the letter labels,
- "answer": the letter of the correct choice ONLY if the paper shows an answer key, a marked/underlined/bold correct choice or "Answer: X"; otherwise null,
- "marks": the marks shown for the question, or 1 if not shown.
Ignore headers, instructions, school names and page numbers. Do not invent or solve questions.
Reply as json: {"questions":[{"text":string,"options":string[],"answer":"A"|"B"|"C"|"D"|null,"marks":number}]}`;

export type PaperInput = { fileName: string; mime: string; base64?: string; text?: string };

export async function scanPaper(input: PaperInput): Promise<ScannedQuestion[]> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Paper scanning is not configured.");
  const content: unknown[] = [{ type: "text", text: PROMPT }];
  if (input.text) content.push({ type: "text", text: `Exam paper "${input.fileName}":\n\n${input.text}` });
  else if (input.base64 && input.mime === "application/pdf") content.push({ type: "file", file: { filename: input.fileName, file_data: `data:application/pdf;base64,${input.base64}` } });
  else if (input.base64 && input.mime.startsWith("image/")) content.push({ type: "image_url", image_url: { url: `data:${input.mime};base64,${input.base64}` } });
  else throw new Error("This file type can't be read. Upload a PDF, Word (.docx), photo or text file.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({ model: MODEL, messages: [{ role: "user", content }], response_format: { type: "json_object" } }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Paper scan failed [${res.status}]: ${body}`);
    if (res.status === 429) throw new Error("The paper reader is busy. Please try again in a minute.");
    if (res.status === 402) throw new Error("The paper reader has run out of credits. Please tell the IT Admin.");
    if (res.status === 400) throw new Error("This file could not be read. Make sure it is not empty or password-protected.");
    throw new Error("The paper reader is unavailable right now. Please try again.");
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = json.choices?.[0]?.message?.content ?? "";
  let parsed: unknown;
  try { parsed = JSON.parse(raw.replace(/^\s*```(?:json)?|```\s*$/g, "").trim()); } catch { throw new Error("The paper could not be read clearly. Try a clearer PDF or photo."); }
  return normalizeScanned(parsed);
}

/** Turns the reader's reply into exactly-four-choice questions; skips anything without a question and two choices. */
export function normalizeScanned(parsed: unknown): ScannedQuestion[] {
  const list = (parsed as { questions?: unknown })?.questions;
  if (!Array.isArray(list)) return [];
  const out: ScannedQuestion[] = [];
  for (const q of list) {
    if (!q || typeof q !== "object") continue;
    const r = q as Record<string, unknown>;
    const text = String(r["text"] ?? "").trim().slice(0, 2000);
    const opts = (Array.isArray(r["options"]) ? r["options"] : []).map((o) => String(o ?? "").trim().slice(0, 500)).filter(Boolean);
    if (!text || opts.length < 2) continue;
    const options = [opts[0] ?? "", opts[1] ?? "", opts[2] ?? "", opts[3] ?? ""] as [string, string, string, string];
    const letter = typeof r["answer"] === "string" ? r["answer"].trim().toUpperCase().charAt(0) : "";
    const idx = "ABCD".indexOf(letter);
    const answer = idx >= 0 && options[idx] ? idx : null;
    const m = Math.round(Number(r["marks"]));
    out.push({ text, options, answer, marks: Number.isFinite(m) ? Math.min(10, Math.max(1, m)) : 1 });
  }
  return out.slice(0, 300);
}

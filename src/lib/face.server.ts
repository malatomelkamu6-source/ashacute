const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function ask(content: unknown[]): Promise<Record<string, unknown>> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Face verification is not configured.");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({ model: MODEL, messages: [{ role: "user", content }], response_format: { type: "json_object" } }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Face check failed [${res.status}]: ${body}`);
    if (res.status === 402) throw new Error("Face verification is paused because the school's AI credit is used up. Please tell IT Admin.");
    if (res.status === 429) throw new Error("Face verification is busy. Please try again in a minute.");
    throw new Error("Face verification is unavailable right now. Please try again.");
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = json.choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(text.replace(/^```json|```$/g, "").trim()); } catch { return {}; }
}

export const COVERED_MSG = "Face verification failed: Your face must be completely uncovered and visible without masks or coverings.";
export const DUPLICATE_MSG = "This face is already registered to another account.";

/** Throws if no single, fully uncovered face is visible. */
export async function checkUncovered(dataUrl: string) {
  const r = await ask([
    { type: "text", text: 'Inspect this webcam photo for an exam identity check. Reply as json: {"face_count": number, "fully_uncovered": boolean, "reason": string}. fully_uncovered is false if any mask, scarf over mouth/nose, sunglasses, hand, hood or object hides part of the face, or if the face is too dark/blurred to see clearly.' },
    { type: "image_url", image_url: { url: dataUrl } },
  ]);
  if (Number(r["face_count"]) !== 1) throw new Error("Face verification failed: exactly one face must be clearly visible.");
  if (r["fully_uncovered"] !== true) throw new Error(COVERED_MSG);
}

/** Throws if the new face matches any of the existing photos (signed URLs). */
export async function checkNotDuplicate(dataUrl: string, existing: string[]) {
  for (let i = 0; i < existing.length; i += 10) {
    const batch = existing.slice(i, i + 10);
    const r = await ask([
      { type: "text", text: `Image 0 is a new student. Images 1-${batch.length} are already registered students. Is the person in image 0 the same human as any other image? Judge by facial identity only, not clothing or background. Reply as json: {"match_index": number|null, "confidence": number}.` },
      { type: "image_url", image_url: { url: dataUrl } },
      ...batch.map((url) => ({ type: "image_url", image_url: { url } })),
    ]);
    if (typeof r["match_index"] === "number" && r["match_index"] > 0 && Number(r["confidence"] ?? 1) >= 0.7) throw new Error(DUPLICATE_MSG);
  }
}

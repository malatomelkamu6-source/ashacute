/* Reads an uploaded exam paper (PDF, photo, or text pulled from Word/text files)
   and returns its multiple-choice questions in order, each choice in its place. */
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output, jsonSchema, NoObjectGeneratedError, type ModelMessage } from "ai";
import { createLovableAiGatewayRunIdFetch } from "@/lib/ai/run-id.server";
import { normalizeScanned, type ScannedQuestion } from "@/lib/paper";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

const INSTRUCTIONS = `You read school multiple-choice exam papers and copy their questions exactly.
Extract EVERY question in the exact order it appears, never skipping or merging questions.
For each question:
- text: the full question wording without its number (keep any passage, table text or formula written inline).
- options: its choices in order (A, B, C, D ...) without the letter labels.
- answer: the letter of the correct choice ONLY if the paper shows it (an answer key, a marked/underlined/bold choice or "Answer: X"); otherwise null. Never solve questions yourself.
- marks: the marks shown for the question, or 1 if not shown.
Ignore headers, general instructions, school names and page numbers.`;

const schema = jsonSchema<{ questions: { text: string; options: string[]; answer: string | null; marks: number }[] }>({
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["text", "options", "answer", "marks"],
        properties: {
          text: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: ["string", "null"] },
          marks: { type: "number" },
        },
      },
    },
  },
});

export type PaperInput = { fileName: string; mime: string; base64?: string; text?: string };

function paperContent(input: PaperInput): ModelMessage["content"] {
  const intro = { type: "text" as const, text: `Extract all multiple-choice questions from the exam paper "${input.fileName}".` };
  if (input.text) return [intro, { type: "text" as const, text: input.text }];
  if (input.base64 && input.mime === "application/pdf") return [intro, { type: "file" as const, data: input.base64, mediaType: "application/pdf", filename: input.fileName }];
  if (input.base64 && input.mime.startsWith("image/")) return [intro, { type: "image" as const, image: new URL(`data:${input.mime};base64,${input.base64}`) }];
  throw new Error("This file type can't be read. Upload a PDF, Word (.docx), photo or text file.");
}

function friendly(err: unknown): Error {
  const status = (err as { statusCode?: number })?.statusCode;
  console.error("Paper scan failed", status, err instanceof Error ? err.message : err);
  if (status === 429) return new Error("The paper reader is busy. Please try again in a minute.");
  if (status === 402) return new Error("The paper reader has run out of AI credits. Please tell the IT Admin.");
  if (status === 403) return new Error("The paper reader is not allowed for this school's account right now. Please tell the IT Admin.");
  if (status === 400) return new Error("This file could not be read. Make sure it is not empty or password-protected.");
  return new Error("The paper reader is unavailable right now. Please try again.");
}

export async function scanPaper(input: PaperInput): Promise<ScannedQuestion[]> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Paper scanning is not configured.");
  const content = paperContent(input);
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  let streamError: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content } as ModelMessage],
    output: Output.object({ schema }),
    onError: ({ error }) => { streamError = error; },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  try {
    const output = await result.output;
    return normalizeScanned(output);
  } catch (err) {
    if (NoObjectGeneratedError.isInstance(err) && err.text) {
      try { return normalizeScanned(JSON.parse(err.text)); } catch { /* fall through */ }
    }
    if (streamError || (err as { statusCode?: number })?.statusCode) throw friendly(streamError ?? err);
    console.error("Paper scan produced no questions", err);
    throw new Error("The paper could not be read clearly. Try a clearer PDF or photo.");
  }
}

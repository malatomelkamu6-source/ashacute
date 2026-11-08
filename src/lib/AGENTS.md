# src/lib notes

- Mathematics teachers may also upload and view SAT papers (`uploadSubjects`); a paper's `target_stream` comes from the teacher, so a Social Science teacher's SAT reaches only Social Science students.
- One active paper per stream: `exam_settings.active_bank_id` (Natural) and `social_bank_id` (Social) can be live together; every exam call resolves the student's paper by stream.
- Student devices heartbeat every `HEARTBEAT_MS`; the client freezes its timer the instant it detects offline and reports `connectionLost` on reconnect, and the server freezes the attempt at `last_seen_at` so no time is lost.
- Teacher paper import: the browser turns .docx/.txt into text (mammoth) and sends PDFs/photos as base64 to `teacherScanPaper`, which reads them through the AI gateway in `src/lib/paper.server.ts`; `normalizeScanned` in `src/lib/paper.ts` keeps an answer only when the paper shows proof of it, so the teacher fills in the rest before submitting.

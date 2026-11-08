# src/lib notes

- Mathematics teachers may also upload and view SAT papers (`uploadSubjects`); a paper's `target_stream` comes from the teacher, so a Social Science teacher's SAT reaches only Social Science students.
- One active paper per stream: `exam_settings.active_bank_id` (Natural) and `social_bank_id` (Social) can be live together; every exam call resolves the student's paper by stream.
- Student devices heartbeat every `HEARTBEAT_MS`; the client freezes its timer the instant it detects offline and reports `connectionLost` on reconnect, and the server freezes the attempt at `last_seen_at` so no time is lost.
- Teacher paper import: the browser turns .docx/.txt into text (mammoth) and sends PDFs/photos as base64 to `teacherScanPaper`, which reads them through the AI gateway in `src/lib/paper.server.ts`; `normalizeScanned` in `src/lib/paper.ts` keeps an answer only when the paper shows proof of it, so the teacher fills in the rest before submitting.
- The exam screen never uses native prompt/confirm/alert (they drop browsers out of fullscreen); it uses in-page dialogs and the cross-browser helpers in `src/lib/fullscreen.ts`, re-entering fullscreen on any tap until the exam ends.
- Exam Help requests are `exam_events` rows of kind `help` (one per student per `HELP_COOLDOWN_SEC`), pinned to the top of the Director's alerts.

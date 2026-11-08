import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileUp, PenSquare, Send, Trash2, Plus, Lock, Save, Flag, KeyRound, LogOut, Table2, Search, Loader2 } from "lucide-react";
import { PAPER_ACCEPT, MAX_PAPER_BYTES, type ScannedQuestion } from "@/lib/paper";
import logo from "@/assets/logo.jpg.asset.json";
import { Shell, Panel, Btn } from "@/components/Shell";
import { listTeachers, teacherDashboard, teacherSaveBank, teacherRemoveBank, teacherRemoveFlag, teacherChangePassword, teacherMarks, teacherScanPaper, type Question } from "@/lib/exam.functions";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [
      { title: "Teacher Portal — Burka Harbu Exams" },
      { name: "description", content: "Build subject question banks and submit them to the Director's exam queue." },
      { property: "og:title", content: "Teacher Portal — Burka Harbu Exams" },
      { property: "og:description", content: "Subject-locked question bank editor for Burka Harbu teachers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Teacher,
});

type Draft = { id?: string; subject: string; title: string; status: "draft" | "queued"; questions: Question[] };

function Teacher() {
  const list = useServerFn(listTeachers);
  const dash = useServerFn(teacherDashboard);
  const { data: teachers = [] } = useQuery({ queryKey: ["teachers"], queryFn: () => list() });
  const [stream, setStream] = useState("");
  const [tid, setTid] = useState("");
  const [pw, setPw] = useState("");
  const [auth, setAuth] = useState<{ tid: string; pw: string } | null>(null);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  if (!auth) return (
    <Shell title="Teacher Portal" subtitle="Subject specialist workspace" help>
      <form className="tile mx-auto max-w-sm space-y-3" onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setErr("");
        try { await dash({ data: { passcode: pw, teacherId: tid } }); setAuth({ tid, pw }); setPw(""); }
        catch (e) { setErr(e instanceof Error ? e.message : "Could not sign in."); } finally { setBusy(false); }
      }}>
        <img src={logo.url} alt="Burka Harbu logo" className="mx-auto h-20 w-20 rounded-full ring-2 ring-primary/40 glow" />
        <h2 className="text-center font-semibold">Teacher sign in</h2>
        <select className="field" value={stream} onChange={(e) => { setStream(e.target.value); setTid(""); }} required aria-label="Stream">
          <option value="">First, choose your stream</option>
          <option>Natural Science</option>
          <option>Social Science</option>
        </select>
        <select className="field" value={tid} onChange={(e) => setTid(e.target.value)} required disabled={!stream} aria-label="Teacher">
          <option value="">{stream ? "Then, select your name" : "Choose your stream first"}</option>
          {teachers.filter((t) => t.id.startsWith(stream === "Social Science" ? "T-SOC" : "T-NAT")).map((t) => <option key={t.id} value={t.id}>{t.full_name} — {t.subjects.join(", ")}</option>)}
        </select>
        <input type="password" className="field" placeholder="Teacher password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
        <Btn className="w-full" disabled={busy || !stream || !tid || !pw}>{busy ? "Checking…" : "Sign in"}</Btn>
      </form>
    </Shell>
  );
  return <Workspace auth={auth} onOut={() => setAuth(null)} onPassword={(next) => setAuth({ ...auth, pw: next })} />;
}

function Workspace({ auth, onOut, onPassword }: { auth: { tid: string; pw: string }; onOut: () => void; onPassword: (p: string) => void }) {
  const dash = useServerFn(teacherDashboard);
  const save = useServerFn(teacherSaveBank);
  const removeBank = useServerFn(teacherRemoveBank);
  const removeFlag = useServerFn(teacherRemoveFlag);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["teacher", auth.tid], queryFn: () => dash({ data: { passcode: auth.pw, teacherId: auth.tid } }), refetchInterval: 5000 });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [picked, setPicked] = useState("");
  const [view, setView] = useState<"banks" | "marks">("banks");
  const subjects = data?.teacher.subjects ?? [];
  const subject = subjects.includes(picked) ? picked : subjects[0] ?? "";
  useEffect(() => { if (data && !draft && data.banks[0]) { const b = data.banks[0]; setDraft({ id: b.id, subject: b.subject, title: b.title, status: b.status as Draft["status"], questions: b.questions }); } }, [data, draft]);
  if (!data) return <Shell title="Teacher Portal" subtitle="Loading…"><p className="text-muted-foreground">Loading…</p></Shell>;
  const newBank = (title = `${subject} Mock ${data.banks.filter((b) => b.subject === subject).length + 1}`, questions: Question[] = []) => setDraft({ subject, title, status: "draft", questions });
  const persist = async (status: Draft["status"]) => {
    if (!draft) return; setErr(""); setMsg("");
    try { const r = await save({ data: { passcode: auth.pw, teacherId: auth.tid, ...draft, status } }); setDraft({ ...draft, id: r.id, status }); setMsg(status === "queued" ? "Submitted to the Director." : "Saved."); qc.invalidateQueries({ queryKey: ["teacher"] }); }
    catch (e) { setErr(e instanceof Error ? e.message : "Could not save."); }
  };
  const run = async (fn: () => Promise<unknown>, done: string) => {
    setErr(""); setMsg("");
    try { await fn(); setMsg(done); await qc.invalidateQueries({ queryKey: ["teacher"] }); }
    catch (e) { setErr(e instanceof Error ? e.message : "Action failed."); }
  };
  return (
    <Shell title="Teacher Portal" subtitle={data.teacher.full_name} help>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary"><Lock className="h-3 w-3" />Locked to {data.teacher.subjects.join(", ")}</span>
        <div className="flex gap-1 rounded-full border border-border bg-secondary/50 p-1">
          <button type="button" onClick={() => setView("banks")} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${view === "banks" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><PenSquare className="h-3.5 w-3.5" />Question banks</button>
          <button type="button" onClick={() => setView("marks")} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${view === "marks" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Table2 className="h-3.5 w-3.5" />My students' marks</button>
        </div>
        <Btn variant="ghost" className="ml-auto" onClick={onOut}><LogOut className="h-4 w-4" />Sign out</Btn>
      </div>
      {view === "marks" ? <Marks auth={auth} /> : <>
      {err && <p role="alert" className="mb-3 text-sm text-destructive">{err}</p>}
      {msg && <p role="status" className="mb-3 text-sm text-accent">{msg}</p>}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <Panel title="Question banks" icon={<PenSquare className="h-4 w-4" />} action={<Btn variant="ghost" className="px-2 py-1 text-xs" onClick={() => newBank()}><Plus className="h-3 w-3" />New {subject}</Btn>}>
            {subjects.length > 1 && <label className="mb-3 block text-xs text-muted-foreground">Subject for the next new bank
              <select aria-label="Subject to upload" className="field mt-1" value={subject} onChange={(e) => setPicked(e.target.value)}>{subjects.map((x) => <option key={x}>{x}</option>)}</select>
            </label>}
            <div className="space-y-2">
              {data.banks.length === 0 && <p className="text-sm text-muted-foreground">No banks yet.</p>}
              {data.banks.map((b) => (
                <div key={b.id} className={`flex items-stretch gap-1 rounded-lg border ${draft?.id === b.id ? "border-primary glow" : "border-border"}`}>
                  <button onClick={() => setDraft({ id: b.id, subject: b.subject, title: b.title, status: b.status as Draft["status"], questions: b.questions })} className="min-w-0 flex-1 p-3 text-left">
                    <div className="break-words text-sm font-medium">{b.title}</div>
                    <div className="text-xs text-muted-foreground">{b.subject} · {b.questions.length} questions · <span className={b.status === "draft" ? "text-warning" : "text-accent"}>{b.status === "queued" ? "submitted" : "draft"}</span></div>
                  </button>
                  <button aria-label={`Remove ${b.title}`} title="Remove question bank" className="px-3 text-muted-foreground hover:text-destructive" onClick={() => confirm(`Remove "${b.title}"? It is taken off the Director's queue too. Students' saved marks are kept.`) && run(async () => { await removeBank({ data: { passcode: auth.pw, teacherId: auth.tid, id: b.id } }); if (draft?.id === b.id) setDraft(null); }, "Question bank removed.")}><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Flagged questions" icon={<Flag className="h-4 w-4" />}>
            <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
              {data.flags.map((f) => <li key={f.id} className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-2"><div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString()} · {f.student_code}</div><div className="break-words">{f.message}</div></div><button aria-label="Remove flag" title="Remove flag" className="p-1 text-muted-foreground hover:text-destructive" onClick={() => run(() => removeFlag({ data: { passcode: auth.pw, teacherId: auth.tid, id: f.id } }), "Flag removed.")}><Trash2 className="h-4 w-4" /></button></li>)}
              {!data.flags.length && <li className="text-muted-foreground">No flags from students.</li>}
            </ul>
          </Panel>
          <Importer auth={auth} onImport={(title, qs) => { newBank(title, qs); setMsg(`${qs.length} questions placed in a new bank. Check them, then press “Submit to Director”.`); }} />
          <TeacherPassword tid={auth.tid} onChanged={onPassword} />
        </div>
        <div className="lg:col-span-2">{draft ? <Editor draft={draft} setDraft={setDraft} onSave={persist} /> : <Panel title="Editor"><p className="text-sm text-muted-foreground">Create a bank to begin.</p></Panel>}</div>
      </div>
      </>}
    </Shell>
  );
}

const readBase64 = (f: File) => new Promise<string>((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(",")[1] ?? "");
  r.onerror = () => rej(new Error("Could not open the file."));
  r.readAsDataURL(f);
});
const IMAGE_MIMES: Record<string, "image/png" | "image/jpeg" | "image/webp"> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };

function Importer({ auth, onImport }: { auth: { tid: string; pw: string }; onImport: (title: string, q: Question[]) => void }) {
  const scan = useServerFn(teacherScanPaper);
  const [busy, setBusy] = useState(""); const [err, setErr] = useState("");
  const [preview, setPreview] = useState<{ name: string; qs: ScannedQuestion[] } | null>(null);
  const load = async (f: File) => {
    setErr(""); setPreview(null);
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!f.size) return setErr("This file is empty.");
    if (f.size > MAX_PAPER_BYTES) return setErr("This file is too large. Please upload a paper under 15 MB.");
    if (ext === "doc") return setErr("Old Word (.doc) files can't be read. In Word, choose “Save As” → .docx or PDF, then upload again.");
    try {
      setBusy("Opening the paper…");
      let payload: { mime: "application/pdf" | "image/png" | "image/jpeg" | "image/webp" | "text/plain"; base64?: string; text?: string };
      if (ext === "pdf") payload = { mime: "application/pdf", base64: await readBase64(f) };
      else if (IMAGE_MIMES[ext]) payload = { mime: IMAGE_MIMES[ext]!, base64: await readBase64(f) };
      else if (ext === "docx") {
        const mammoth = await import("mammoth");
        const { value } = await mammoth.extractRawText({ arrayBuffer: await f.arrayBuffer() });
        payload = { mime: "text/plain", text: value };
      } else if (ext === "txt" || ext === "md") payload = { mime: "text/plain", text: await f.text() };
      else throw new Error("Please upload a PDF, Word (.docx), photo (JPG/PNG) or text file.");
      if (payload.text !== undefined && !payload.text.trim()) throw new Error("No text was found in this file. If it is a scanned paper, upload it as a PDF or photo instead.");
      setBusy("Reading every question and choice… this can take up to a minute for long papers.");
      const r = await scan({ data: { passcode: auth.pw, teacherId: auth.tid, fileName: f.name, ...payload } });
      setPreview({ name: f.name, qs: r.questions });
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not read this paper."); }
    finally { setBusy(""); }
  };
  const missing = preview ? preview.qs.filter((q) => q.answer === null).length : 0;
  return (
    <Panel title="Exam paper importer" icon={<FileUp className="h-4 w-4" />}>
      <label className={`block rounded-xl border-2 border-dashed border-border p-5 text-center text-sm ${busy ? "cursor-wait opacity-60" : "cursor-pointer hover:border-primary"}`}>
        {busy ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-primary" />{busy}</span> : <>Upload exam paper<span className="mt-1 block text-xs text-muted-foreground">PDF, Word (.docx), photo or text</span></>}
        <input type="file" accept={PAPER_ACCEPT} hidden disabled={!!busy} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) load(f); }} />
      </label>
      <p className="mt-2 text-xs text-muted-foreground">The system reads each question and puts its choices A–D in their places. Answers are filled in when the paper shows them.</p>
      {err && <p role="alert" className="mt-2 text-xs text-destructive">{err}</p>}
      {preview && (
        <div className="mt-3 space-y-2">
          <div className="break-words text-xs font-medium">{preview.name}</div>
          <div className="text-xs text-accent">{preview.qs.length} questions found</div>
          {missing > 0 && <p className="rounded-lg border border-warning/40 bg-warning/10 p-2 text-xs text-warning">{missing} question(s) have no answer on the paper. Choose the correct answer for them in the editor before submitting.</p>}
          <ol className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-border p-2 text-xs">
            {preview.qs.map((q, i) => (
              <li key={i}>
                <div className="break-words font-medium"><span className="text-primary">{i + 1}.</span> {q.text}</div>
                <div className="mt-0.5 grid gap-x-3 sm:grid-cols-2">{q.options.map((o, k) => o && <span key={k} className={`break-words ${q.answer === k ? "text-accent" : "text-muted-foreground"}`}>{"ABCD"[k]}. {o}</span>)}</div>
              </li>
            ))}
          </ol>
          <Btn className="w-full" onClick={() => {
            const stamp = Date.now();
            onImport(preview.name.replace(/\.\w+$/, "").slice(0, 120), preview.qs.map((q, i) => ({ id: `q${stamp}${i}`, text: q.text, options: q.options, answer: q.answer ?? 0, marks: q.marks })));
            setPreview(null);
          }}>Create bank from paper</Btn>
        </div>
      )}
    </Panel>
  );
}

function Editor({ draft, setDraft, onSave }: { draft: Draft; setDraft: (d: Draft) => void; onSave: (s: Draft["status"]) => void }) {
  const update = (fn: (qs: Question[]) => Question[]) => setDraft({ ...draft, questions: fn(draft.questions) });
  const setQ = (i: number, patch: Partial<Question>) => update((qs) => qs.map((q, j) => j === i ? { ...q, ...patch } : q));
  const totalMarks = draft.questions.reduce((a, q) => a + q.marks, 0);
  return (
    <Panel title={`${draft.subject} · ${draft.title}`} icon={<PenSquare className="h-4 w-4" />}
      action={<div className="flex gap-2"><Btn variant="ghost" onClick={() => onSave("draft")}><Save className="h-4 w-4" />Save</Btn><Btn disabled={!draft.questions.length} onClick={() => onSave("queued")}><Send className="h-4 w-4" />Submit to Director</Btn></div>}>
      <div className="mb-4 flex items-center gap-3">
        <input className="field" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <span className="whitespace-nowrap text-xs text-muted-foreground">{draft.questions.length} Q · {totalMarks} marks</span>
      </div>
      <div className="space-y-3">
        {draft.questions.map((q, i) => (
          <div key={q.id} className="rounded-xl border border-border p-4">
            <div className="flex gap-2">
              <span className="font-mono text-sm text-primary">{i + 1}.</span>
              <textarea className="field min-h-14" value={q.text} placeholder="Question text" onChange={(e) => setQ(i, { text: e.target.value })} />
              <button aria-label="Delete question" onClick={() => update((qs) => qs.filter((_, j) => j !== i))} className="self-start text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, k) => (
                <label key={k} className={`flex items-center gap-2 rounded-lg border p-1.5 pl-2 ${q.answer === k ? "border-accent bg-accent/10" : "border-border"}`}>
                  <input type="radio" name={`ans-${q.id}`} checked={q.answer === k} onChange={() => setQ(i, { answer: k })} />
                  <span className="font-mono text-xs">{"ABCD"[k]}</span>
                  <input className="w-full bg-transparent text-sm outline-none" value={o} placeholder={`Option ${"ABCD"[k]}`} onChange={(e) => { const opts = [...q.options] as Question["options"]; opts[k] = e.target.value; setQ(i, { options: opts }); }} />
                </label>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">Marks <input type="number" min={1} max={10} className="field w-20 py-1" value={q.marks} onChange={(e) => setQ(i, { marks: Math.min(10, Math.max(1, +e.target.value)) })} /> · Correct answer: <b className="text-accent">{"ABCD"[q.answer]}</b></div>
          </div>
        ))}
        <Btn variant="ghost" className="w-full" onClick={() => update((qs) => [...qs, { id: `q${Date.now()}`, text: "", options: ["", "", "", ""], answer: 0, marks: 1 }])}><Plus className="h-4 w-4" />Add question</Btn>
      </div>
    </Panel>
  );
}

function TeacherPassword({ tid, onChanged }: { tid: string; onChanged: (p: string) => void }) {
  const change = useServerFn(teacherChangePassword);
  const [cur, setCur] = useState(""); const [next, setNext] = useState("");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  return (
    <Panel title="My password" icon={<KeyRound className="h-4 w-4" />}>
      <form className="space-y-2" onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setErr(""); setMsg("");
        try { await change({ data: { teacherId: tid, current: cur, next } }); onChanged(next); setMsg("Password changed — use it from now on."); setCur(""); setNext(""); }
        catch (e) { setErr(e instanceof Error ? e.message : "Could not change the password."); }
        finally { setBusy(false); }
      }}>
        <input type="password" autoComplete="current-password" aria-label="Current password" className="field" placeholder="Current password" value={cur} onChange={(e) => setCur(e.target.value)} required />
        <input type="password" autoComplete="new-password" aria-label="New password" className="field" placeholder="New password (min 4 characters)" value={next} onChange={(e) => setNext(e.target.value)} required minLength={4} maxLength={100} />
        {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
        {msg && <p role="status" className="text-xs text-accent">{msg}</p>}
        <Btn className="w-full" disabled={busy || !cur || next.length < 4}>{busy ? "Saving…" : "Change password"}</Btn>
        <p className="text-xs text-muted-foreground">This password is only for you. If you forget it, IT Admin can reset it.</p>
      </form>
    </Panel>
  );
}

function Marks({ auth }: { auth: { tid: string; pw: string } }) {
  const fn = useServerFn(teacherMarks);
  const { data, error } = useQuery({ queryKey: ["teacher-marks", auth.tid], queryFn: () => fn({ data: { passcode: auth.pw, teacherId: auth.tid } }), refetchInterval: 15000 });
  const [subject, setSubject] = useState("all"); const [round, setRound] = useState("all"); const [section, setSection] = useState("all"); const [q, setQ] = useState("");
  if (error) return <p role="alert" className="text-sm text-destructive">{error instanceof Error ? error.message : "Could not load marks."}</p>;
  if (!data) return <p className="text-muted-foreground">Loading marks…</p>;
  const rounds = [...new Set(data.rows.map((r) => r.round))].sort((a, b) => a - b);
  const sections = [...new Set(data.rows.map((r) => r.section))].sort();
  const term = q.trim().toLowerCase().replace(/[\s-]/g, "");
  const rows = data.rows
    .filter((r) => (subject === "all" || r.subject === subject) && (round === "all" || String(r.round) === round) && (section === "all" || r.section === section))
    .filter((r) => !term || `${r.name}${r.studentCode}`.toLowerCase().replace(/[\s-]/g, "").includes(term))
    .sort((a, b) => (b.total ? b.score / b.total : 0) - (a.total ? a.score / a.total : 0));
  const pct = (r: { score: number; total: number }) => r.total ? Math.round((r.score / r.total) * 100) : 0;
  const avg = rows.length ? Math.round(rows.reduce((a, r) => a + pct(r), 0) / rows.length) : null;
  return (
    <Panel title={`My students' marks · ${data.stream}`} icon={<Table2 className="h-4 w-4" />}>
      <p className="mb-3 text-xs text-muted-foreground">Only {data.subjects.join(" and ")} marks of {data.stream} students are shown here.</p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {data.subjects.length > 1 && <select aria-label="Subject" className="field w-auto" value={subject} onChange={(e) => setSubject(e.target.value)}><option value="all">All my subjects</option>{data.subjects.map((x) => <option key={x}>{x}</option>)}</select>}
        <select aria-label="Round" className="field w-auto" value={round} onChange={(e) => setRound(e.target.value)}><option value="all">All rounds</option>{rounds.map((r) => <option key={r} value={r}>Round {r}</option>)}</select>
        <select aria-label="Section" className="field w-auto" value={section} onChange={(e) => setSection(e.target.value)}><option value="all">All sections</option>{sections.map((x) => <option key={x} value={x}>Section {x}</option>)}</select>
        <div className="relative w-full max-w-xs"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input aria-label="Search student" className="field pl-9" placeholder="Search name or ID" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <span className="ml-auto text-xs text-muted-foreground">{rows.length} result(s){avg !== null ? ` · average ${avg}%` : ""}</span>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-muted-foreground"><th className="p-2">#</th><th className="p-2">Student</th><th className="p-2">ID</th><th className="p-2">Sec</th><th className="p-2">Exam</th><th className="p-2">Round</th><th className="p-2">Marks</th><th className="p-2">%</th><th className="p-2">Submitted</th></tr></thead>
        <tbody>{rows.map((r, i) => <tr key={r.id} className="border-t border-border">
          <td className="p-2 font-mono text-xs text-muted-foreground">{i + 1}</td><td className="p-2">{r.name}</td><td className="p-2 font-mono text-xs">{r.studentCode}</td><td className="p-2">{r.section}</td>
          <td className="p-2"><div className="break-words">{r.title}</div><div className="text-xs text-muted-foreground">{r.subject}{r.status === "blocked" ? " · blocked" : ""}</div></td>
          <td className="p-2">{r.round}</td><td className="p-2 font-mono">{r.score}/{r.total}</td><td className={`p-2 font-semibold ${pct(r) >= 50 ? "text-accent" : "text-destructive"}`}>{pct(r)}</td>
          <td className="p-2 text-xs">{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}</td>
        </tr>)}</tbody>
      </table>{!rows.length && <p className="py-6 text-center text-muted-foreground">No marks yet for your subject.</p>}</div>
    </Panel>
  );
}

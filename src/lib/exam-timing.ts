export function canStartExam(open: boolean, start: string | null, close: string | null, time = Date.now()) {
  return open && !!start && !!close && time >= Date.parse(start) && time < Date.parse(close);
}

export function personalDeadline(startedAt: string, durationSec: number, extensionSec = 0) {
  return new Date(Date.parse(startedAt) + (durationSec + extensionSec) * 1000).toISOString();
}

export function remainingSeconds(deadline: string | null, time = Date.now()) {
  return deadline ? Math.max(0, Math.ceil((Date.parse(deadline) - time) / 1000)) : 0;
}
/** A student's device that stops reporting for this long (power cut, lost internet) has its timer frozen. */
export const DISCONNECT_GRACE_SEC = 10;

/** A connection-paused student is back online when their device reported again after the pause and within the last 20 seconds. */
export function backOnline(lastSeen: string | null, pausedAt: string | null, time = Date.now()) {
  if (!lastSeen || !pausedAt) return false;
  const seen = Date.parse(lastSeen);
  return seen > Date.parse(pausedAt) && time - seen < 20_000;
}

export function admittedToRoom(code: string, selected: string[] | null) { return selected === null || selected.includes(code); }
export function activeBankIds(s: { active_bank_id: string | null; social_bank_id: string | null }) { return [s.active_bank_id, s.social_bank_id].filter((id): id is string => !!id); }

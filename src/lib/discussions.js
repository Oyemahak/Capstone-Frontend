// src/lib/discussions.js
// Tiny localStorage chat store (swap with real API later)

const K = (id) => `chat:${id}`;

export function readThread(id) {
  try { return JSON.parse(localStorage.getItem(K(id)) || "[]"); } catch { return []; }
}
export function writeThread(id, msgs) {
  try { localStorage.setItem(K(id), JSON.stringify(msgs || [])); } catch {}
}
export function postMessage(id, msg) {
  const next = [...readThread(id), {
    id: crypto?.randomUUID?.() || String(Date.now()),
    ts: Date.now(),
    ...msg,
  }];
  writeThread(id, next);
  return next;
}
export function dmChannelId(a, b) {
  // stable DM ID no matter who opens it
  const [x, y] = [String(a), String(b)].sort();
  return `dm:${x}:${y}`;
}
// src/lib/profile.js
function keyFor(user) {
  const k = user?._id || user?.email || "unknown";
  return `avatar:${k}`;
}

export function readAvatar(user) {
  try { return localStorage.getItem(keyFor(user)) || ""; } catch { return ""; }
}
export function saveAvatar(user, dataUrl) {
  try { localStorage.setItem(keyFor(user), dataUrl || ""); } catch {}
}
export function clearAvatar(user) {
  try { localStorage.removeItem(keyFor(user)); } catch {}
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
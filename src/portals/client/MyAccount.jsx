// src/portals/client/MyAccount.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

/* Local draft until backend endpoints exist */
const LSK = "client:myaccount:draft";
const readDraft = () => { try { return JSON.parse(localStorage.getItem(LSK) || "{}"); } catch { return {}; } };
const writeDraft = (v) => { try { localStorage.setItem(LSK, JSON.stringify(v || {})); } catch {} };

function niceSize(n = 0) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MyAccount() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");

  // avatar (local preview only)
  const [avatarFile, setAvatarFile] = useState(null); // {name,size,type,__blob?}
  const [avatarUrl, setAvatarUrl] = useState("");
  const [msg, setMsg] = useState("");

  // restore draft
  useEffect(() => {
    const d = readDraft();
    if (d?.name) setName(d.name);
    if (d?.avatarMeta) {
      // meta only; blob preview only works during the current session
      setAvatarFile(d.avatarMeta);
    }
  }, []);

  // live preview object URL
  const revokeRef = useRef(null);
  useEffect(() => {
    if (revokeRef.current) {
      URL.revokeObjectURL(revokeRef.current);
      revokeRef.current = null;
    }
    if (avatarFile?.__blob) {
      const u = URL.createObjectURL(avatarFile.__blob);
      setAvatarUrl(u);
      revokeRef.current = u;
    } else {
      setAvatarUrl("");
    }
    return () => {
      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current);
        revokeRef.current = null;
      }
    };
  }, [avatarFile]);

  function pickAvatar() {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "image/*";
    el.onchange = () => {
      const f = el.files?.[0];
      if (!f) return;
      setAvatarFile({ name: f.name, size: f.size, type: f.type, __blob: f });
    };
    el.click();
  }
  function clearAvatar() { setAvatarFile(null); }

  function save() {
    if (pwd && pwd !== pwd2) { setMsg("Passwords do not match."); return; }
    writeDraft({
      name,
      avatarMeta: avatarFile ? { name: avatarFile.name, size: avatarFile.size, type: avatarFile.type } : null,
    });
    setMsg("Saved locally. We’ll wire server updates next.");
    setTimeout(() => setMsg(""), 1500);
  }

  const avatarSubtitle = useMemo(() => {
    if (!avatarFile) return "PNG / JPG / SVG";
    const parts = [avatarFile.name];
    const s = niceSize(avatarFile.size); if (s) parts.push(s);
    return parts.join(" • ");
  }, [avatarFile]);

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <h2 className="page-title">My account</h2>
        <div />
      </div>

      {/* Identity */}
      <div className="card-surface card-pad space-stack max-w-3xl">
        <div className="text-muted-xs">Client · {user?.email}</div>

        <label className="block">
          <div className="form-label">Email</div>
          <input className="form-input" value={user?.email || ""} disabled />
          <div className="row-sub mt-1">Email can’t be changed.</div>
        </label>

        <label className="block">
          <div className="form-label">Full name</div>
          <input className="form-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your display name" />
        </label>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <div className="form-label">New password</div>
            <input className="form-input" type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="(optional)" />
          </label>
          <label className="block">
            <div className="form-label">Confirm new password</div>
            <input className="form-input" type="password" value={pwd2} onChange={(e)=>setPwd2(e.target.value)} placeholder="(optional)" />
          </label>
        </div>
      </div>

      {/* Avatar */}
      <div className="card-surface card-pad max-w-3xl">
        <div className="card-title mb-3">Profile picture</div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-white/60">
            {avatarUrl
              ? <img alt="avatar" src={avatarUrl} className="w-full h-full object-cover" />
              : <span className="text-sm">No image</span>}
          </div>

          <div className="flex-1">
            <div className="text-sm text-white/80">{avatarSubtitle}</div>
            <div className="text-xs text-white/50">Shown across your client portal.</div>
            <div className="mt-2 flex gap-2">
              <button className="btn btn-outline btn-sm" onClick={pickAvatar}>Upload image</button>
              {avatarFile && <button className="btn btn-outline btn-sm" onClick={clearAvatar}>Remove</button>}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-3xl">
        {msg && <div className="text-success mb-3">{msg}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
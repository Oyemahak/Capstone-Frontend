// src/portals/client/MyAccount.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { users } from "@/lib/api.js";

function niceSize(n = 0) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MyAccount() {
  const { user, updateUser } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");
  const [fileMeta, setFileMeta] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const pickRef = useRef(null);
  const revokeRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(user?.avatarUrl || "");
    setFileMeta(null);
    setFileBlob(null);
  }, [user?._id, user?.avatarUrl]);

  function onPick(e) {
    const f = (e.target.files || [])[0];
    if (!f) return;
    setFileMeta({ name: f.name, size: f.size, type: f.type });
    setFileBlob(f);

    if (revokeRef.current) {
      URL.revokeObjectURL(revokeRef.current);
      revokeRef.current = null;
    }
    const u = URL.createObjectURL(f);
    setPreviewUrl(u);
    revokeRef.current = u;
  }

  function removeAvatar() {
    setFileMeta(null);
    setFileBlob(null);
    setPreviewUrl("");
  }

  async function save() {
    if (pwd && pwd !== pwd2) {
      setMsg("Passwords do not match.");
      setTimeout(() => setMsg(""), 1200);
      return;
    }

    try {
      setBusy(true);
      // 1) Upload new avatar if picked
      if (fileBlob) {
        const { avatarUrl } = await users.uploadMyAvatar(fileBlob);
        // 2) reflect immediately in header
        updateUser({ avatarUrl });
        setMsg("Saved.");
      } else if (!previewUrl && user?.avatarUrl) {
        // user clicked Remove then Save
        await users.deleteMyAvatar();
        updateUser({ avatarUrl: "" });
        setMsg("Removed.");
      } else {
        setMsg("Saved.");
      }
    } catch (e) {
      setMsg(e?.message || "Failed to save.");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(""), 1000);
      if (pickRef.current) pickRef.current.value = "";
      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current);
        revokeRef.current = null;
      }
    }
  }

  const avatarSubtitle = useMemo(() => {
    if (!previewUrl && !user?.avatarUrl) return "PNG / JPG / SVG";
    if (!fileMeta?.name) return "Current image";
    const s = niceSize(fileMeta.size);
    return [fileMeta.name, s].filter(Boolean).join(" • ");
  }, [previewUrl, user?.avatarUrl, fileMeta]);

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <h2 className="page-title">My account</h2>
        <div />
      </div>

      {/* Identity (email and name are read-only for clients) */}
      <div className="card-surface card-pad space-stack max-w-3xl">
        <div className="text-muted-xs">Client · {user?.email}</div>

        <label className="block">
          <div className="form-label">Email</div>
          <input className="form-input" value={user?.email || ""} disabled />
          <div className="row-sub mt-1">Email can’t be changed.</div>
        </label>

        <label className="block">
          <div className="form-label">Full name</div>
          <input className="form-input" value={user?.name || ""} disabled />
          <div className="row-sub mt-1">
            Need a correction? <Link className="subtle-link" to="/client/support">Open a support ticket</Link>.
          </div>
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
            {(previewUrl || user?.avatarUrl)
              ? <img alt="avatar" src={previewUrl || user?.avatarUrl} className="w-full h-full object-cover" />
              : <span className="text-sm">No image</span>}
          </div>

          <div className="flex-1">
            <div className="text-sm text-white/80">{avatarSubtitle}</div>
            <div className="text-xs text-white/50">Shown in the header and across your client portal.</div>
            <div className="mt-2 flex gap-2">
              <input ref={pickRef} type="file" accept="image/*" className="sr-only" onChange={onPick} />
              <label className="btn btn-outline btn-sm" onClick={() => pickRef.current?.click()}>
                Upload image
              </label>
              {(previewUrl || user?.avatarUrl) && (
                <button className="btn btn-outline btn-sm" onClick={removeAvatar}>Remove</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl">
        {msg && <div className="text-success mb-3">{msg}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
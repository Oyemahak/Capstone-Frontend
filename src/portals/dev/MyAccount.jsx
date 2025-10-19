// src/portals/dev/MyAccount.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { users } from "@/lib/api.js";

export default function DevMyAccount() {
  const { user, updateUser } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");
  const [fileBlob, setFileBlob] = useState(null);
  const [ok, setOk] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [busy, setBusy] = useState(false);
  const pickRef = useRef(null);
  const revokeRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(user?.avatarUrl || "");
    setFileBlob(null);
  }, [user?._id, user?.avatarUrl]);

  function onPick(e) {
    const f = (e.target.files || [])[0];
    if (!f) return;
    if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    const u = URL.createObjectURL(f);
    revokeRef.current = u;
    setPreviewUrl(u);
    setFileBlob(f);
  }
  function removeAvatar(){ setFileBlob(null); setPreviewUrl(""); }

  async function save() {
    if (pwd && pwd !== pwd2) { setOk("Passwords do not match."); setTimeout(()=>setOk(""), 1200); return; }
    try {
      setBusy(true);
      if (fileBlob) {
        const { avatarUrl } = await users.uploadMyAvatar(fileBlob);
        updateUser({ avatarUrl });
        setOk("Saved");
      } else if (!previewUrl && user?.avatarUrl) {
        await users.deleteMyAvatar();
        updateUser({ avatarUrl: "" });
        setOk("Removed");
      } else {
        setOk("Saved");
      }
    } catch (e) {
      setOk(e?.message || "Failed");
    } finally {
      setBusy(false);
      setTimeout(()=>setOk(""), 900);
      if (pickRef.current) pickRef.current.value = "";
      if (revokeRef.current) { URL.revokeObjectURL(revokeRef.current); revokeRef.current = null; }
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2 className="page-title">My account</h2>
        <div />
      </div>

      <div className="card-surface card-pad space-stack max-w-3xl">
        <div className="text-muted-xs">Developer · {user?.email}</div>

        <label className="block">
          <div className="form-label">Email</div>
          <input className="form-input" value={user?.email || ""} disabled />
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

      <div className="card-surface card-pad max-w-3xl">
        <div className="card-title mb-3">Profile picture</div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden grid place-items-center">
            {(previewUrl || user?.avatarUrl)
              ? <img src={previewUrl || user?.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <span className="text-sm text-white/60">No image</span>}
          </div>
          <div className="flex-1">
            <div className="text-xs text-white/60">Shown in the header and across the developer portal.</div>
            <div className="mt-2 flex gap-2">
              <input ref={pickRef} type="file" accept="image/*" className="sr-only" onChange={onPick} />
              <label className="btn btn-outline btn-sm" onClick={() => pickRef.current?.click()}>Upload image</label>
              {(previewUrl || user?.avatarUrl) && <button className="btn btn-outline btn-sm" onClick={removeAvatar}>Remove</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl">
        {ok && <div className="text-success mb-3">{ok}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
        </div>
      </div>
    </div>
  );
}
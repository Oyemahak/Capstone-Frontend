// src/portals/admin/MyAccount.jsx
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { users } from "@/lib/api.js";

export default function AdminMyAccount() {
  const { user, logout, updateUser } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(user?.avatarUrl || "");
  const [fileBlob, setFileBlob] = useState(null);
  const [msg, setMsg] = useState("");
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
    try {
      setBusy(true);
      if (fileBlob) {
        const { avatarUrl } = await users.uploadMyAvatar(fileBlob);
        updateUser({ avatarUrl });
        setMsg("Saved");
      } else if (!previewUrl && user?.avatarUrl) {
        await users.deleteMyAvatar();
        updateUser({ avatarUrl: "" });
        setMsg("Removed");
      } else {
        setMsg("Saved");
      }
    } catch (e) {
      setMsg(e?.message || "Failed");
    } finally {
      setBusy(false);
      setTimeout(()=>setMsg(""), 900);
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
        <div className="text-muted-xs">Admin · {user?.email}</div>

        <label className="block">
          <div className="form-label">Email</div>
          <input className="form-input" value={user?.email || ""} disabled />
        </label>
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
            <div className="text-xs text-white/60">Shown in the header and across the admin portal.</div>
            <div className="mt-2 flex gap-2">
              <input ref={pickRef} type="file" accept="image/*" className="sr-only" onChange={onPick} />
              <label className="btn btn-outline btn-sm" onClick={() => pickRef.current?.click()}>Upload image</label>
              {(previewUrl || user?.avatarUrl) && <button className="btn btn-outline btn-sm" onClick={removeAvatar}>Remove</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl space-y-3">
        {msg && <div className="text-success">{msg}</div>}
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
          <button className="btn btn-outline text-rose-300" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
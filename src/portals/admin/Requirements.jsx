// src/portals/admin/Requirements.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projects as api, requirements as reqApi } from "@/lib/api.js";
import RequirementsViewer from "@/components/requirements/RequirementsViewer.jsx";

export default function AdminRequirements() {
  const { projectId } = useParams();
  const [proj, setProj] = useState(null);
  const [req, setReq] = useState(null);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setErr("");
    try {
      const [p, r] = await Promise.all([
        api.one(projectId),
        reqApi.get(projectId).catch(() => ({ requirement: null })),
      ]);
      setProj(p.project || p);
      setReq(r.requirement || null);
    } catch (e) { setErr(e.message || "Failed to load"); }
  }

  useEffect(() => { load(); }, [projectId]);

  async function clearAll() {
    if (!confirm("Delete all uploaded requirements for this project? This cannot be undone.")) return;
    setBusy(true); setErr(""); setOk("");
    try {
      await reqApi.remove(projectId);
      setOk("Requirements removed.");
      setReq(null);
      setTimeout(() => setOk(""), 1000);
    } catch (e) { setErr(e.message || "Failed to delete"); }
    finally { setBusy(false); }
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <h2 className="page-title">{proj?.title || "Requirements"}</h2>
        <div className="flex items-center gap-2">
          <Link to={`/admin/projects/${projectId}`} className="btn btn-outline">Back to project</Link>
          {req?.reviewedByDev && <span className="badge">Reviewed by Dev</span>}
          {!!req && (
            <button className="btn btn-outline text-rose-300" onClick={clearAll} disabled={busy}>
              {busy ? "Deleting…" : "Delete all"}
            </button>
          )}
        </div>
      </div>

      {(err || ok) && (
        <div className="space-stack">
          {err && <div className="text-error">{err}</div>}
          {ok && <div className="text-success">{ok}</div>}
        </div>
      )}

      <div className="card card-pad">
        <div className="card-title mb-2">Client requirements</div>
        <RequirementsViewer req={req} />
      </div>
    </div>
  );
}
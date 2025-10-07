// src/portals/dev/Requirements.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projects as api, requirements as reqApi } from "@/lib/api.js";
import RequirementsViewer from "@/components/requirements/RequirementsViewer.jsx";

export default function DevRequirements() {
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

  async function markReviewed() {
    setBusy(true); setOk(""); setErr("");
    try {
      const d = await reqApi.setReview(projectId, true);
      setReq(d.requirement || d);
      setOk("Marked reviewed.");
      setTimeout(() => setOk(""), 1000);
    } catch (e) { setErr(e.message || "Failed"); }
    finally { setBusy(false); }
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <h2 className="page-title">{proj?.title || "Requirements"}</h2>
        <div className="flex items-center gap-2">
          <Link to={`/dev/projects/${projectId}`} className="btn btn-outline">Back to project</Link>
          {req && !req.reviewedByDev && (
            <button className="btn btn-primary" onClick={markReviewed} disabled={busy}>
              {busy ? "Saving…" : "Mark reviewed"}
            </button>
          )}
          {req?.reviewedByDev && <span className="badge">Reviewed</span>}
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
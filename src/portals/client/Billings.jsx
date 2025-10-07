// src/portals/client/Billings.jsx
import { Fragment, useEffect, useMemo, useState } from "react";
import { projects as api, invoices as invApi } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

function StatusBadge({ inv }) {
  if (!inv) return <span className="text-muted-xs">—</span>;
  if (inv.status === "paid") return <span className="badge">Paid</span>;
  return <span className="badge">Uploaded</span>;
}

function Preview({ file }) {
  if (!file?.url) return null;
  const isPDF = file.type?.includes("pdf");
  return isPDF ? (
    <iframe title={file.name || "invoice"} className="w-full h-64 rounded-xl border border-white/10" src={file.url} />
  ) : (
    <img alt={file.name || "invoice"} className="w-full rounded-xl border border-white/10" src={file.url} />
  );
}

function InvoiceCard({ title, inv }) {
  return (
    <div className="card-surface p-5 space-y-3">
      <div className="card-title">{title}</div>
      {!inv ? (
        <div className="text-muted-xs">No invoice uploaded yet.</div>
      ) : (
        <>
          <div className="text-sm">
            <StatusBadge inv={inv} />
            <span className="text-white/80 ml-2">{inv.file?.name || "Invoice"}</span>
          </div>
          <Preview file={inv.file} />
          <div className="form-actions">
            <a className="btn btn-outline" href={inv.file?.url} download={inv.file?.name || "invoice"}>
              Download
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function ReadonlyRow({ p }) {
  const [snap, setSnap] = useState({ advance: null, final: null });

  useEffect(() => {
    (async () => {
      try {
        const d = await invApi.list(p._id);
        const list = d.invoices || [];
        setSnap({
          advance: list.find((x) => x.kind === "advance") || null,
          final: list.find((x) => x.kind === "final") || null,
        });
      } catch {}
    })();
  }, [p._id]);

  return (
    <tr className="row-edit">
      <td colSpan={5}>
        <div className="grid md:grid-cols-2 gap-5">
          <InvoiceCard title="Advance payment (50%)" inv={snap.advance} />
          <InvoiceCard title="Final invoice (after delivery)" inv={snap.final} />
        </div>
        <div className="text-muted-xs mt-4">
          If anything is missing or incorrect, please contact support.
        </div>
      </td>
    </tr>
  );
}

export default function ClientBillings() {
  const { user } = useAuth();

  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const d = await api.list();
      const mine = (d.projects || []).filter((p) => String(p.client?._id) === String(user?._id));
      setRows(mine);
    } catch (e) { setErr(e.message || "Failed to fetch projects"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [user?._id]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows || []).filter((p) => !needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle));
  }, [rows, q]);

  return (
    <div className="page-shell space-y-5">
      <div className="page-header">
        <h2 className="page-title">Billing</h2>
        <div />
      </div>

      {err && <div className="text-error">{err}</div>}

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Project</th>
              <th className="w-24">Manager</th>
              <th className="w-20">Advance</th>
              <th className="w-20">Final</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <Fragment key={p._id}>
                <tr className="table-row-hover">
                  <td>
                    <div className="font-medium">{p.title}</div>
                    {p.summary && <div className="row-sub line-clamp-1">{p.summary}</div>}
                  </td>
                  <td className="text-white/80">{p.developer?.name || "—"}</td>
                  <ClientBadges projectId={p._id} />
                  <td className="actions-cell">
                    <button
                      className="btn btn-outline"
                      onClick={() => setOpenId((v) => (v === p._id ? null : p._id))}
                      title="View invoices & download"
                    >
                      {openId === p._id ? "Close" : "View invoices"}
                    </button>
                  </td>
                </tr>
                {openId === p._id && <ReadonlyRow p={p} />}
              </Fragment>
            ))}
            {!filtered.length && (
              <tr><td colSpan="5" className="empty-cell">{loading ? "Loading…" : "No projects found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  function ClientBadges({ projectId }) {
    const [snap, setSnap] = useState({ advance: null, final: null });
    useEffect(() => {
      (async () => {
        try {
          const d = await invApi.list(projectId);
          const list = d.invoices || [];
          setSnap({
            advance: list.find((x) => x.kind === "advance") || null,
            final: list.find((x) => x.kind === "final") || null,
          });
        } catch {}
      })();
    }, [projectId]);
    return (
      <>
        <td><StatusBadge inv={snap.advance} /></td>
        <td><StatusBadge inv={snap.final} /></td>
      </>
    );
  }
}
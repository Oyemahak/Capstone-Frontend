// src/portals/client/Billings.jsx
import { Fragment, useEffect, useMemo, useState } from "react";
import { projects as api } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

/* ───────────────────────────────────────────────────────────
   Shared temp storage scheme (compatible with Admin Billings)
   ─────────────────────────────────────────────────────────── */
const LS_KEY = (id) => `billing:${id}`;
const readBilling = (id) => {
  try { return JSON.parse(localStorage.getItem(LS_KEY(id)) || "{}"); }
  catch { return {}; }
};

/* Small badge renderer */
function StatusBadge({ inv }) {
  if (!inv) return <span className="text-muted-xs">—</span>;
  if (inv.status === "paid") return <span className="badge">Paid</span>;
  if (inv.url) return <span className="badge">Uploaded</span>;
  return <span className="text-muted-xs">—</span>;
}

/* Preview for PDF/image */
function Preview({ file }) {
  if (!file?.url) return null;
  const isPDF = file.type?.includes("pdf");
  return isPDF ? (
    <iframe
      title={file.name || "invoice"}
      className="w-full h-64 rounded-xl border border-white/10"
      src={file.url}
    />
  ) : (
    <img
      alt={file.name || "invoice"}
      className="w-full rounded-xl border border-white/10"
      src={file.url}
    />
  );
}

/* Read-only invoice card */
function InvoiceCard({ title, inv }) {
  return (
    <div className="card-surface p-5 space-y-3">
      <div className="card-title">{title}</div>

      {!inv ? (
        <div className="text-muted-xs">No invoice uploaded yet.</div>
      ) : (
        <>
          <div className="text-sm">
            <span className="badge mr-2">
              {inv.status === "paid" ? "Paid" : "Uploaded"}
            </span>
            <span className="text-white/80">{inv.name || "Invoice"}</span>
          </div>

          <Preview file={inv} />

          <div className="form-actions">
            <a className="btn btn-outline" href={inv.url} download={inv.name || "invoice"}>
              Download
            </a>
          </div>
        </>
      )}
    </div>
  );
}

/* Expandable row content */
function ReadonlyRow({ p }) {
  const local = readBilling(p._id);
  const advance = local.advance || null;
  const finalInv = local.final || null;

  return (
    <tr className="row-edit">
      <td colSpan={5}>
        <div className="grid md:grid-cols-2 gap-5">
          <InvoiceCard title="Advance payment (50%)" inv={advance} />
          <InvoiceCard title="Final invoice (after delivery)" inv={finalInv} />
        </div>

        <div className="text-muted-xs mt-4">
          Note: Invoices are uploaded by your project manager. If anything is missing or incorrect,
          please contact support via the Support page.
        </div>
      </td>
    </tr>
  );
}

export default function ClientBillings() {
  const { user } = useAuth();

  // data
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ui
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0); // in case admin updates while client is on page

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const d = await api.list();
      // Only projects that belong to this client
      const mine = (d.projects || []).filter(
        (p) => String(p.client?._id) === String(user?._id)
      );
      setRows(mine);
    } catch (e) {
      setErr(e.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [user?._id]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows || []).filter(
      (p) => !needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle)
    );
  }, [rows, q, refreshTick]);

  return (
    <div className="page-shell space-y-5">
      {/* Title */}
      <div className="page-header">
        <h2 className="page-title">Billing</h2>
        <div />
      </div>

      {/* Filters */}
      <div className="card card-pad filters-grid">
        <input
          className="form-input"
          placeholder="Search projects…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={load} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setRefreshTick((v) => v + 1)}
            title="Re-read local invoice cache"
          >
            Reload invoices
          </button>
        </div>
      </div>

      {err && <div className="text-error">{err}</div>}

      {/* Table */}
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
            {filtered.map((p) => {
              const local = readBilling(p._id);
              return (
                <Fragment key={p._id}>
                  <tr className="table-row-hover">
                    <td>
                      <div className="font-medium">{p.title}</div>
                      {p.summary && (
                        <div className="row-sub line-clamp-1">{p.summary}</div>
                      )}
                    </td>

                    <td className="text-white/80">
                      {p.developer?.name || "—"}
                    </td>

                    <td><StatusBadge inv={local.advance} /></td>
                    <td><StatusBadge inv={local.final} /></td>

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
              );
            })}

            {!filtered.length && (
              <tr>
                <td colSpan="5" className="empty-cell">
                  {loading ? "Loading…" : "No projects found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-muted-xs">
        Invoices appear here once uploaded by the admin. You can preview PDFs or
        images inline, and download a copy for your records.
      </div>
    </div>
  );
}
// src/portals/admin/Billings.jsx
import { Fragment, useEffect, useMemo, useState } from "react";
import { projects as api } from "@/lib/api.js";

/* ───────────────────────────────────────────────────────────
   Temp storage (so the page works before backend endpoints)
   ─────────────────────────────────────────────────────────── */
const LS_KEY = (id) => `billing:${id}`;
const readBilling = (id) => {
  try { return JSON.parse(localStorage.getItem(LS_KEY(id)) || "{}"); } catch { return {}; }
};
const writeBilling = (id, data) => {
  try { localStorage.setItem(LS_KEY(id), JSON.stringify(data || {})); } catch {}
};
const fileToDataURL = (file) =>
  new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file); });

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
    <iframe title="invoice" className="w-full h-64 rounded-xl border border-white/10" src={file.url} />
  ) : (
    <img alt="invoice" className="w-full rounded-xl border border-white/10" src={file.url} />
  );
}

/* Clean file picker: hidden input + styled trigger + filename */
function FilePicker({ id, value, label = "Upload invoice (PDF or image)", onPick, disabled }) {
  return (
    <div className="space-y-2">
      <div className="form-label">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="file"
          accept="application/pdf,image/*"
          className="sr-only"
          onChange={(e) => onPick(e.target.files?.[0] || null)}
          disabled={disabled}
        />
        <label htmlFor={id} className={`btn btn-outline btn-sm ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
          Choose file
        </label>
        <span className="text-sm text-white/70 truncate max-w-[260px]">
          {value?.name || "No file chosen"}
        </span>
      </div>
    </div>
  );
}

export default function Billings() {
  // data
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ui
  const [q, setQ] = useState("");
  const [openEditId, setOpenEditId] = useState(null);
  const [busyId, setBusyId] = useState("");

  // local billing cache (projectId -> { advance, final })
  const [cacheVersion, setCacheVersion] = useState(0); // bump to re-read badges after edits

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const d = await api.list();
      setRows(d.projects || []);
    } catch (e) {
      setErr(e.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (rows || []).filter((p) => !needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle));
  }, [rows, q]);

  /* Inline editor row */
  function EditorRow({ p }) {
    const [advance, setAdvance] = useState(() => readBilling(p._id).advance || null);
    const [finalInv, setFinalInv] = useState(() => readBilling(p._id).final || null);

    function persist(next) {
      const merged = { ...(readBilling(p._id) || {}), ...next };
      writeBilling(p._id, merged);
      setCacheVersion((v) => v + 1); // refresh status badges in table
    }

    async function handlePick(kind, file) {
      if (!file) return;
      setBusyId(p._id);
      try {
        const url = await fileToDataURL(file);
        const data = { name: file.name, type: file.type, url, status: "unpaid" };
        if (kind === "advance") { setAdvance(data); persist({ advance: data }); }
        else { setFinalInv(data); persist({ final: data }); }
      } finally {
        setBusyId("");
      }
    }

    function markPaid(kind) {
      if (kind === "advance" && advance) {
        const next = { ...advance, status: "paid" };
        setAdvance(next); persist({ advance: next });
      } else if (kind === "final" && finalInv) {
        const next = { ...finalInv, status: "paid" };
        setFinalInv(next); persist({ final: next });
      }
    }

    function clearFile(kind) {
      if (kind === "advance") { setAdvance(null); persist({ advance: null }); }
      else { setFinalInv(null); persist({ final: null }); }
    }

    return (
      <tr className="row-edit">
        <td colSpan={5}>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Advance */}
            <div className="card-surface p-5 space-y-3">
              <div className="card-title">Advance payment (50%)</div>

              {!advance ? (
                <FilePicker
                  id={`adv-${p._id}`}
                  value={advance}
                  onPick={(file) => handlePick("advance", file)}
                  disabled={busyId === p._id}
                />
              ) : (
                <>
                  <div className="text-sm">
                    <span className="badge mr-2">{advance.status === "paid" ? "Paid" : "Uploaded"}</span>
                    <span className="text-white/80">{advance.name}</span>
                  </div>
                  <Preview file={advance} />
                  <div className="form-actions">
                    <a className="btn btn-outline" href={advance.url} download={advance.name}>Download</a>
                    {advance.status !== "paid" && (
                      <button className="btn btn-primary" onClick={() => markPaid("advance")}>Mark as paid</button>
                    )}
                    <button className="btn btn-outline" onClick={() => clearFile("advance")}>Remove</button>
                  </div>
                </>
              )}
            </div>

            {/* Final */}
            <div className="card-surface p-5 space-y-3">
              <div className="card-title">Final invoice (after delivery)</div>

              {!finalInv ? (
                <FilePicker
                  id={`fin-${p._id}`}
                  value={finalInv}
                  onPick={(file) => handlePick("final", file)}
                  disabled={busyId === p._id}
                />
              ) : (
                <>
                  <div className="text-sm">
                    <span className="badge mr-2">{finalInv.status === "paid" ? "Paid" : "Uploaded"}</span>
                    <span className="text-white/80">{finalInv.name}</span>
                  </div>
                  <Preview file={finalInv} />
                  <div className="form-actions">
                    <a className="btn btn-outline" href={finalInv.url} download={finalInv.name}>Download</a>
                    {finalInv.status !== "paid" && (
                      <button className="btn btn-primary" onClick={() => markPaid("final")}>Mark as paid</button>
                    )}
                    <button className="btn btn-outline" onClick={() => clearFile("final")}>Remove</button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="text-muted-xs mt-4">
            Tip: these are stored locally for now and immediately reflect in the table status.
          </div>
        </td>
      </tr>
    );
  }

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
        <button className="btn btn-outline" onClick={load} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {err && <div className="text-error">{err}</div>}

      {/* Table */}
      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Project</th>
              <th className="w-24">Client</th>
              <th className="w-20">Advance</th>
              <th className="w-20">Final</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody key={cacheVersion /* force redraw badges after edits */}>
            {filtered.map((p) => {
              const local = readBilling(p._id);
              return (
                <Fragment key={p._id}>
                  <tr className="table-row-hover">
                    <td>
                      <div className="font-medium">{p.title}</div>
                      {p.summary && <div className="row-sub line-clamp-1">{p.summary}</div>}
                    </td>
                    <td className="text-white/80">{p.client?.name || "—"}</td>

                    <td><StatusBadge inv={local.advance} /></td>
                    <td><StatusBadge inv={local.final} /></td>

                    <td className="actions-cell">
                      <button
                        className="btn btn-outline"
                        onClick={() => setOpenEditId((v) => (v === p._id ? null : p._id))}
                        disabled={busyId === p._id}
                        title="Upload invoices, preview, download, mark as paid"
                      >
                        {openEditId === p._id ? "Close" : "Manage billing"}
                      </button>
                    </td>
                  </tr>

                  {openEditId === p._id && <EditorRow p={p} />}
                </Fragment>
              );
            })}

            {!filtered.length && (
              <tr><td colSpan="5" className="empty-cell">{loading ? "Loading…" : "No projects found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
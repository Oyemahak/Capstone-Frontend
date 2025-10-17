// frontend/src/portals/admin/ProjectDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  admin,
  projects as api,
  requirements as reqApi,
  files as fileApi,
} from "@/lib/api.js";

export default function AdminProjectDetail() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("overview"); // overview | requirements | updates | evidence | edit

  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  // Requirements snapshot
  const [reqSnap, setReqSnap] = useState(null);
  const [reqBusy, setReqBusy] = useState(false);

  async function loadReq() {
    try {
      setReqBusy(true);
      const d = await reqApi.get(projectId).catch(() => ({ requirement: null }));
      setReqSnap(d.requirement || null);
    } catch (e) {
      setErr(e.message || "Failed to load requirements");
    } finally {
      setReqBusy(false);
    }
  }

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [aBusy, setABusy] = useState(false);
  const [aErr, setAErr] = useState("");
  const [titleA, setTitleA] = useState("");
  const [bodyA, setBodyA] = useState("");

  async function loadAnnouncements() {
    setAErr("");
    try {
      const d = await api.listAnnouncements(projectId); // { ok, items }
      setAnnouncements(d.items || []);
    } catch (e) {
      setAErr(e?.message || "Failed to load announcements");
    }
  }

  async function publishAnnouncement() {
    if (!titleA.trim()) return;
    setABusy(true);
    setAErr("");
    try {
      await api.createAnnouncement(projectId, { title: titleA.trim(), body: bodyA.trim() });
      setTitleA("");
      setBodyA("");
      await loadAnnouncements();
    } catch (e) {
      setAErr(e?.message || "Failed to publish");
    } finally {
      setABusy(false);
    }
  }

  async function removeAnnouncement(idx) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await api.deleteAnnouncement(projectId, idx);
      await loadAnnouncements();
    } catch (e) {
      setAErr(e?.message || "Delete failed");
    }
  }

  // Evidence
  const [evTitle, setEvTitle] = useState("");
  const [evLink, setEvLink] = useState("");
  const [evFiles, setEvFiles] = useState([]);
  const [evBusy, setEvBusy] = useState(false);
  const [evErr, setEvErr] = useState("");
  const [evOk, setEvOk] = useState("");

  const pickInputId = "admin-ev-files";
  function onPickFiles(e) {
    const files = Array.from(e.target.files || []);
    const accepted = files.filter((f) => f.type.startsWith("image/") && f.size <= 15 * 1024 * 1024);
    if (accepted.length !== files.length) alert("Only images up to 15MB are allowed.");
    setEvFiles((prev) => [...prev, ...accepted].slice(0, 12));
    e.target.value = "";
  }
  function removePicked(i) {
    const copy = evFiles.slice();
    copy.splice(i, 1);
    setEvFiles(copy);
  }
  async function addProgress() {
    setEvErr("");
    if (!evTitle.trim() && !evLink.trim() && evFiles.length === 0) return;
    try {
      setEvBusy(true);
      const uploaded = [];
      for (const f of evFiles) {
        const up = await fileApi.upload(f);
        uploaded.push({ name: up.file?.name || f.name, type: up.file?.type || f.type, url: up.file?.url });
      }
      await api.addEvidence(projectId, {
        title: evTitle.trim() || "Update",
        links: evLink.trim() ? [evLink.trim()] : [],
        images: uploaded,
        ts: Date.now(),
      });
      const p = await api.one(projectId);
      setProject(p.project || p);
      setEvOk("Entry added");
      setTimeout(() => setEvOk(""), 1000);
      setEvTitle(""); setEvLink(""); setEvFiles([]);
    } catch (e) {
      setEvErr(e?.message || "Failed to add entry");
    } finally { setEvBusy(false); }
  }

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [p, u] = await Promise.all([api.one(projectId), admin.users()]);
        if (!live) return;
        setProject(p.project || p);
        setUsers(u.users || []);
      } catch (e) {
        if (live) setErr(e.message || "Failed to load");
      }
    })();
    loadReq();
    loadAnnouncements();
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const clients = useMemo(() => users.filter((u) => u.role === "client"), [users]);
  const devs = useMemo(() => users.filter((u) => u.role === "developer"), [users]);

  async function patch(body) {
    try {
      const d = await api.update(projectId, body);
      const p = d.project || d;
      setProject(p);
      setOk("Saved");
      setTimeout(() => setOk(""), 1200);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function removeProject() {
    if (!confirm("Delete this project?")) return;
    try {
      await api.remove(projectId);
      window.location.assign("/admin/projects");
    } catch (e) {
      setErr(e.message);
    }
  }

  async function markReviewed(v) {
    try {
      await reqApi.setReview(projectId, !!v);
      await loadReq();
      setOk(v ? "Marked reviewed" : "Review cleared");
      setTimeout(() => setOk(""), 1000);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function deleteAllRequirements() {
    if (!confirm("Delete ALL uploaded requirements for this project?")) return;
    try {
      await reqApi.remove(projectId);
      await loadReq();
      setOk("Requirements cleared");
      setTimeout(() => setOk(""), 1000);
    } catch (e) {
      setErr(e.message);
    }
  }

  if (!project) {
    return (
      <div className="page-shell">
        {err ? <div className="text-error">{err}</div> : "Loading…"}
      </div>
    );
  }

  return (
    <div className="page-shell space-y-5">
      <div className="page-header">
        <h2 className="page-title">Project · {project.title}</h2>
        <div className="flex items-center gap-2">
          <button onClick={removeProject} className="btn btn-outline">Delete Project</button>
        </div>
      </div>

      {(ok || err) && (
        <div className="space-y-1">
          {ok && <div className="text-success">{ok}</div>}
          {err && <div className="text-error">{err}</div>}
        </div>
      )}

      {/* Tabs — Chat removed */}
      <div className="card-surface p-3">
        <div className="flex gap-2">
          {["overview", "requirements", "updates", "evidence", "edit"].map((k) => (
            <button
              key={k}
              className={`btn h-10 px-4 rounded-lg ${tab === k ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTab(k)}
            >
              {k === "overview" ? "Overview" :
                k === "requirements" ? "Requirements" :
                k === "updates" ? "Announcements" :
                k === "evidence" ? "Evidence" : "Edit"}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="grid-2">
          <div className="card-surface card-pad space-stack">
            <div className="card-title">Summary</div>
            <div className="text-muted">{project.summary || "—"}</div>
            <div className="text-muted-xs">
              Client: <b>{project.client?.name || "—"}</b> · Developer: <b>{project.developer?.name || "—"}</b>
            </div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Latest announcements</div>
            <ul className="space-stack text-sm">
              {(announcements || []).slice(0, 3).map((a, i) => (
                <li key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="font-medium">{a.title}</div>
                  {a.body && <div className="text-muted mt-1">{a.body}</div>}
                </li>
              ))}
              {!(announcements || []).length && <li className="text-muted-xs">No announcements yet.</li>}
            </ul>
          </div>
        </div>
      )}

      {/* REQUIREMENTS (admin tools) */}
      {tab === "requirements" && (
        <div className="card-surface card-pad space-stack">
          <div className="flex items-center justify-between">
            <div className="card-title">Client requirements</div>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm" onClick={loadReq} disabled={reqBusy}>
                {reqBusy ? "Refreshing…" : "Reload"}
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => markReviewed(!reqSnap?.reviewedByDev)} disabled={!reqSnap}>
                {reqSnap?.reviewedByDev ? "Clear review" : "Mark reviewed"}
              </button>
              <button className="btn btn-outline btn-sm text-rose-300" onClick={deleteAllRequirements} disabled={!reqSnap}>
                Delete all
              </button>
            </div>
          </div>

          {!reqSnap ? (
            <div className="text-muted-xs">No requirements uploaded yet.</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="row-sub">Logo</div>
                  {reqSnap.logo ? (
                    <a className="subtle-link" href={reqSnap.logo.url} target="_blank" rel="noreferrer">{reqSnap.logo.name}</a>
                  ) : "—"}
                </div>
                <div>
                  <div className="row-sub">Brief</div>
                  {reqSnap.brief ? (
                    <a className="subtle-link" href={reqSnap.brief.url} target="_blank" rel="noreferrer">{reqSnap.brief.name}</a>
                  ) : "—"}
                </div>
              </div>

              <div>
                <div className="row-sub mb-1">Supporting documents</div>
                {(reqSnap.supporting || []).length ? (
                  <ul className="list-disc pl-5 text-sm">
                    {reqSnap.supporting.map((f, i) => (
                      <li key={i}><a className="subtle-link" href={f.url} target="_blank" rel="noreferrer">{f.name}</a></li>
                    ))}
                  </ul>
                ) : "—"}
              </div>

              <div>
                <div className="row-sub mb-1">Pages</div>
                {(reqSnap.pages || []).length ? (
                  <div className="space-stack">
                    {reqSnap.pages.map((p, i) => (
                      <div key={`${p.name}-${i}`} className="bg-white/5 rounded-lg p-3">
                        <div className="font-semibold">{p.name}</div>
                        {p.note && <div className="text-white/70 text-sm mt-1 whitespace-pre-wrap">{p.note}</div>}
                        {!!(p.files || []).length && (
                          <ul className="list-disc pl-5 text-sm mt-1">
                            {p.files.map((f, k) => (
                              <li key={k}><a className="subtle-link" href={f.url} target="_blank" rel="noreferrer">{f.name}</a></li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : "—"}
              </div>

              <div className="text-muted-xs">
                Updated: {reqSnap.updatedAt ? new Date(reqSnap.updatedAt).toLocaleString() : "—"}
                {reqSnap.reviewedByDev ? " · Reviewed" : ""}
              </div>
            </>
          )}
        </div>
      )}

      {/* ANNOUNCEMENTS */}
      {tab === "updates" && (
        <div className="grid-2">
          <div className="card-surface card-pad space-stack">
            <div className="card-title">Post announcement</div>
            {aErr && <div className="text-error">{aErr}</div>}
            <input className="form-input" placeholder="Title" value={titleA} onChange={(e) => setTitleA(e.target.value)} />
            <textarea className="form-textarea-sm" placeholder="What’s new or planned?" value={bodyA} onChange={(e) => setBodyA(e.target.value)} />
            <div className="form-actions">
              <button className="btn btn-primary" onClick={publishAnnouncement} disabled={aBusy || !titleA.trim()}>
                {aBusy ? "Publishing…" : "Publish"}
              </button>
              <button className="btn btn-outline" onClick={loadAnnouncements} disabled={aBusy}>Reload</button>
            </div>
            <div className="text-muted-xs">Visible to Client & Developer.</div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Recent announcements</div>
            <div className="space-stack">
              {(announcements || []).map((a, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-extrabold">{a.title}</div>
                      {a.body && <div className="text-muted mt-1 whitespace-pre-wrap">{a.body}</div>}
                      <div className="text-muted-xs mt-1">{new Date(a.ts).toLocaleString()}</div>
                    </div>
                    <button className="btn btn-outline btn-xs" onClick={() => removeAnnouncement(i)}>Delete</button>
                  </div>
                </div>
              ))}
              {!(announcements || []).length && <div className="text-muted-xs">Nothing yet.</div>}
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE */}
      {tab === "evidence" && (
        <div className="grid-2">
          <div className="card-surface card-pad space-stack">
            <div className="card-title">Add progress evidence</div>

            {(evOk || evErr) && (
              <div className="space-y-1">
                {evOk && <div className="text-success">{evOk}</div>}
                {evErr && <div className="text-error">{evErr}</div>}
              </div>
            )}

            <input className="form-input" placeholder="Short title (e.g., 'Home page & Nav')" value={evTitle} onChange={(e) => setEvTitle(e.target.value)} />
            <input className="form-input" placeholder="Link (optional, e.g., staging URL)" value={evLink} onChange={(e) => setEvLink(e.target.value)} />

            <div className="space-y-2">
              <div className="form-label">Screenshots (PNG/JPG)</div>
              <input id={pickInputId} type="file" accept="image/*" multiple className="sr-only" onChange={onPickFiles} />
              <label htmlFor={pickInputId} className="inline-block">
                <span className="btn btn-outline">Choose files</span>
              </label>

              {!!evFiles.length && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {evFiles.map((f, i) => (
                    <figure key={`${f.name}-${i}`} className="relative rounded-lg overflow-hidden border border-white/10">
                      <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-28 object-cover" />
                      <figcaption className="px-2 py-1 text-[11px] bg-black/40 backdrop-blur">
                        <span className="truncate block" title={f.name}>{f.name}</span>
                      </figcaption>
                      <button type="button" onClick={() => removePicked(i)} className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full h-6 w-6 text-xs">×</button>
                    </figure>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={addProgress} disabled={evBusy}>
                {evBusy ? "Adding…" : "Add entry"}
              </button>
            </div>
            <div className="text-muted-xs">Visible to Client & Developer.</div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Evidence timeline</div>
            <div className="space-stack">
              {(project.evidence || []).map((it, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="font-extrabold">{it.title}</div>
                  {!!(it.links || []).length && (
                    <ul className="text-sm mt-1">
                      {it.links.map((l, k) => (
                        <li key={k}><a className="subtle-link" href={l} target="_blank" rel="noreferrer">{l}</a></li>
                      ))}
                    </ul>
                  )}
                  {!!(it.images || []).length && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {it.images.map((im, k) => (
                        <img key={k} alt="" src={im.url} className="rounded-lg border border-white/10" />
                      ))}
                    </div>
                  )}
                  <div className="text-muted-xs mt-1">{new Date(it.ts).toLocaleString()}</div>
                </div>
              ))}
              {!((project.evidence || []).length) && <div className="text-muted-xs">No evidence yet.</div>}
            </div>
          </div>
        </div>
      )}

      {/* EDIT */}
      {tab === "edit" && (
        <div className="grid-2">
          <div className="card card-pad-lg form-stack">
            <label className="form-field">
              <div className="form-label">Title</div>
              <input
                className="form-input"
                value={project.title || ""}
                onChange={(e) => setProject((p) => ({ ...p, title: e.target.value }))}
                onBlur={() => patch({ title: (project.title || "").trim() })}
              />
            </label>

            <label className="form-field">
              <div className="form-label">Summary</div>
              <textarea
                className="form-input form-textarea"
                value={project.summary || ""}
                onChange={(e) => setProject((p) => ({ ...p, summary: e.target.value }))}
                onBlur={() => patch({ summary: (project.summary || "").trim() })}
              />
            </label>

            <label className="form-field">
              <div className="form-label">Status</div>
              <select
                className="form-input bg-transparent"
                value={project.status || "draft"}
                onChange={(e) => patch({ status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>

          <div className="card card-pad-lg form-stack">
            <label className="form-field">
              <div className="form-label">Client</div>
              <select
                className="form-input bg-transparent"
                value={project.client?._id || ""}
                onChange={(e) => patch({ client: e.target.value || null })}
              >
                <option value="">— Unassigned —</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.email}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <div className="form-label">Developer</div>
              <select
                className="form-input bg-transparent"
                value={project.developer?._id || ""}
                onChange={(e) => patch({ developer: e.target.value || null })}
              >
                <option value="">— Unassigned —</option>
                {devs.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.email}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
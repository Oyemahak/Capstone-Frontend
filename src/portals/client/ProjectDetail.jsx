import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { projects as api, requirements as reqApi, files as fileApi } from "@/lib/api.js";

export default function DevProjectDetail() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [fatalErr, setFatalErr] = useState("");
  const [tab, setTab] = useState("overview"); // overview | requirements | updates | evidence | chat

  // Requirements (read-only) + error isolated to this tab
  const [reqSnap, setReqSnap] = useState(null);
  const [reqBusy, setReqBusy] = useState(false);
  const [reqErr, setReqErr] = useState("");

  async function loadReq() {
    setReqErr("");
    try {
      setReqBusy(true);
      const d = await reqApi.get(projectId);
      setReqSnap(d.requirement || null);
    } catch (e) {
      setReqErr(e?.message || "Failed to load requirements");
      setReqSnap(null);
    } finally {
      setReqBusy(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const p = await api.one(projectId);
        setProject(p.project || p);
      } catch (e) {
        setFatalErr(e.message || "Failed to load project");
      }
    })();
    loadReq();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const clientName = useMemo(() => project?.client?.name || "—", [project]);

  /* ---------- Announcements (local-only) ---------- */
  const [announcements, setAnn] = useState([]);
  const [titleA, setTitleA] = useState("");
  const [bodyA, setBodyA] = useState("");
  function addAnnouncement() {
    if (!titleA.trim()) return;
    const item = { title: titleA.trim(), body: bodyA.trim(), ts: Date.now() };
    setAnn((prev) => [item, ...prev]);
    setTitleA("");
    setBodyA("");
  }

  /* ---------- Evidence (persisted to backend) ---------- */
  const [evTitle, setEvTitle] = useState("");
  const [evLink, setEvLink] = useState("");
  const [evFiles, setEvFiles] = useState([]); // File[]
  const [evBusy, setEvBusy] = useState(false);
  const [evErr, setEvErr] = useState("");
  const [evOk, setEvOk] = useState("");

  const pickInputId = "dev-ev-files";

  function onPickFiles(e) {
    const incoming = Array.from(e.target.files || []);
    if (!incoming.length) return;
    const accepted = incoming.filter(
      (f) => f.type.startsWith("image/") && f.size <= 15 * 1024 * 1024
    );
    if (accepted.length !== incoming.length) {
      alert("Some files were skipped (only images up to 15MB are allowed).");
    }
    setEvFiles((prev) => [...prev, ...accepted].slice(0, 12));
    e.target.value = "";
  }

  function removePicked(idx) {
    const next = evFiles.slice();
    next.splice(idx, 1);
    setEvFiles(next);
  }

  async function addProgress() {
    setEvErr("");
    if (!evTitle.trim() && !evLink.trim() && evFiles.length === 0) return;

    try {
      setEvBusy(true);

      const uploaded = [];
      for (const f of evFiles) {
        const up = await fileApi.upload(f); // -> { file: { name,type,size,path,url } }
        uploaded.push({
          name: up.file?.name || f.name,
          type: up.file?.type || f.type,
          url: up.file?.url,
        });
      }

      const entry = {
        title: evTitle.trim() || "Update",
        links: evLink.trim() ? [evLink.trim()] : [],
        images: uploaded,
        ts: Date.now(),
      };

      // use POST /projects/:id/evidence — allowed for assigned developer
      const saved = await api.addEvidence(projectId, entry);
      const savedProject = saved.project || saved;

      setProject(savedProject);
      setEvOk("Entry added");
      setTimeout(() => setEvOk(""), 1000);

      setEvTitle("");
      setEvLink("");
      setEvFiles([]);
    } catch (e) {
      setEvErr(e?.message || "Failed to add entry");
    } finally {
      setEvBusy(false);
    }
  }

  /* ---------- Chat (local) ---------- */
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  function sendMessage(from = "developer") {
    if (!msg.trim()) return;
    setChat((prev) => [...prev, { from, text: msg.trim(), ts: Date.now() }]);
    setMsg("");
  }

  if (!project) {
    return (
      <div className="page-shell">
        {fatalErr ? <div className="text-error">{fatalErr}</div> : "Loading…"}
      </div>
    );
  }

  return (
    <div className="page-shell space-y-5">
      <div className="page-header">
        <h2 className="page-title">Project · {project.title}</h2>
        {/* READ-ONLY status badge for devs */}
        <div className="flex items-center gap-2">
          <span className="badge capitalize">{project.status || "draft"}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-surface p-3">
        <div className="flex gap-2">
          {["overview", "requirements", "updates", "evidence", "chat"].map((k) => (
            <button
              key={k}
              className={`btn h-10 px-4 rounded-lg ${
                tab === k ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setTab(k)}
            >
              {k === "overview"
                ? "Overview"
                : k === "requirements"
                ? "Requirements"
                : k === "updates"
                ? "Announcements"
                : k === "evidence"
                ? "Evidence"
                : "Chat"}
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
              Client: <b>{clientName}</b>
            </div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Latest activity</div>
            <ul className="space-stack text-sm">
              {announcements.slice(0, 3).map((a, i) => (
                <li key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="font-medium">{a.title}</div>
                  {a.body && <div className="text-muted mt-1">{a.body}</div>}
                </li>
              ))}
              {!announcements.length && (
                <li className="text-muted-xs">No announcements yet.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* REQUIREMENTS (read-only) */}
      {tab === "requirements" && (
        <div className="card-surface card-pad space-stack">
          <div className="flex items-center justify-between">
            <div className="card-title">Client requirements</div>
            <button className="btn btn-outline btn-sm" onClick={loadReq} disabled={reqBusy}>
              {reqBusy ? "Refreshing…" : "Reload"}
            </button>
          </div>

          {reqErr && <div className="text-error">{reqErr}</div>}

          {!reqErr && !reqSnap && (
            <div className="text-muted-xs">No requirements uploaded yet.</div>
          )}

          {!reqErr && reqSnap && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="row-sub">Logo</div>
                  {reqSnap.logo ? (
                    <a
                      className="subtle-link"
                      href={reqSnap.logo.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {reqSnap.logo.name}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <div className="row-sub">Brief</div>
                  {reqSnap.brief ? (
                    <a
                      className="subtle-link"
                      href={reqSnap.brief.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {reqSnap.brief.name}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              <div>
                <div className="row-sub mb-1">Supporting documents</div>
                {(reqSnap.supporting || []).length ? (
                  <ul className="list-disc pl-5 text-sm">
                    {reqSnap.supporting.map((f, i) => (
                      <li key={i}>
                        <a
                          className="subtle-link"
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {f.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "—"
                )}
              </div>

              <div>
                <div className="row-sub mb-1">Pages</div>
                {(reqSnap.pages || []).length ? (
                  <div className="space-stack">
                    {reqSnap.pages.map((p, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-3">
                        <div className="font-semibold">{p.name}</div>
                        {p.note && (
                          <div className="text-white/70 text-sm mt-1">{p.note}</div>
                        )}
                        {!!(p.files || []).length && (
                          <ul className="list-disc pl-5 text-sm mt-1">
                            {p.files.map((f, k) => (
                              <li key={k}>
                                <a
                                  className="subtle-link"
                                  href={f.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {f.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </div>

              <div className="text-muted-xs">
                Updated: {new Date(reqSnap.updatedAt).toLocaleString()}
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
            <input
              className="form-input"
              placeholder="Title"
              value={titleA}
              onChange={(e) => setTitleA(e.target.value)}
            />
            <textarea
              className="form-textarea-sm"
              placeholder="What did you complete / plan?"
              value={bodyA}
              onChange={(e) => setBodyA(e.target.value)}
            />
            <div className="form-actions">
              <button className="btn btn-primary" onClick={addAnnouncement}>
                Publish
              </button>
            </div>
            <div className="text-muted-xs">
              Client and Admin can see these updates.
            </div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Recent announcements</div>
            <div className="space-stack">
              {announcements.map((a, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="font-extrabold">{a.title}</div>
                  {a.body && (
                    <div className="text-muted mt-1 whitespace-pre-wrap">
                      {a.body}
                    </div>
                  )}
                  <div className="text-muted-xs mt-1">
                    {new Date(a.ts).toLocaleString()}
                  </div>
                </div>
              ))}
              {!announcements.length && (
                <div className="text-muted-xs">Nothing yet.</div>
              )}
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

            <input
              className="form-input"
              placeholder="Short title (e.g., 'Home page & Nav')"
              value={evTitle}
              onChange={(e) => setEvTitle(e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Link (optional, e.g., staging URL)"
              value={evLink}
              onChange={(e) => setEvLink(e.target.value)}
            />

            {/* Simple, consistent picker */}
            <div className="space-y-2">
              <div className="form-label">Screenshots (PNG/JPG)</div>
              <input
                id={pickInputId}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={onPickFiles}
              />
              <label htmlFor={pickInputId} className="inline-block">
                <span className="btn btn-outline">Choose files</span>
              </label>

              {!!evFiles.length && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {evFiles.map((f, i) => (
                    <figure
                      key={`${f.name}-${i}`}
                      className="relative rounded-lg overflow-hidden border border-white/10"
                    >
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="w-full h-28 object-cover"
                      />
                      <figcaption className="px-2 py-1 text-[11px] bg-black/40 backdrop-blur">
                        <span className="truncate block" title={f.name}>
                          {f.name}
                        </span>
                      </figcaption>
                      <button
                        type="button"
                        onClick={() => removePicked(i)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full h-6 w-6 text-xs"
                        title="Remove"
                      >
                        ×
                      </button>
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
            <div className="text-muted-xs">Visible to Client and Admin.</div>
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
                        <li key={k}>
                          <a className="subtle-link" href={l} target="_blank" rel="noreferrer">
                            {l}
                          </a>
                        </li>
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
                  <div className="text-muted-xs mt-1">
                    {new Date(it.ts).toLocaleString()}
                  </div>
                </div>
              ))}
              {!((project.evidence || []).length) && (
                <div className="text-muted-xs">No evidence yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHAT */}
      {tab === "chat" && (
        <div className="grid-2">
          <div className="card-surface card-pad">
            <div className="card-title mb-2">Project chat (Client ↔ Developer)</div>
            <div className="bg-white/5 rounded-xl p-3 h-80 overflow-auto space-y-2">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    m.from === "developer" ? "bg-primary/20" : "bg-white/10"
                  }`}
                >
                  <div className="text-xs text-white/60 mb-1">
                    {m.from} · {new Date(m.ts).toLocaleString()}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
              {!chat.length && <div className="text-muted-xs">No messages yet.</div>}
            </div>

            <div className="form-actions mt-tight">
              <input
                className="form-input"
                placeholder="Type a message for the client…"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <button className="btn btn-primary" onClick={() => sendMessage("developer")}>
                Send
              </button>
            </div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Guidance</div>
            <ul className="text-sm text-muted space-stack">
              <li>Status is read-only for developers.</li>
              <li>Evidence is saved to the backend; announcements/chat are local for now.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
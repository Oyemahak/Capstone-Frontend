// src/portals/dev/ProjectDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { projects as api, admin } from "@/lib/api.js";

/* Local cache (swap with real endpoints later) */
const LSK = (id) => `dev:project:${id}`;
const readLocal = (id) => { try { return JSON.parse(localStorage.getItem(LSK(id)) || "{}"); } catch { return {}; } };
const writeLocal = (id, obj) => { try { localStorage.setItem(LSK(id), JSON.stringify(obj || {})); } catch {} };
const fileToDataURL = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file); });

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [tab, setTab] = useState("overview"); // overview | updates | evidence | chat

  useEffect(() => {
    (async () => {
      try {
        const [p, u] = await Promise.all([api.one(projectId), admin.users()]);
        setProject(p.project || p);
        setUsers(u.users || []);
      } catch (e) { setErr(e.message || "Failed to load"); }
    })();
  }, [projectId]);

  const client = useMemo(() => users.find(x => x._id === project?.client?._id) || project?.client, [users, project]);

  async function setStatus(v) {
    try {
      const d = await api.update(projectId, { status: v });
      setProject(d.project || d);
      setOk("Status updated");
      setTimeout(() => setOk(""), 1000);
    } catch (e) { setErr(e.message); }
  }

  // Local boards
  const store = useMemo(() => readLocal(projectId), [projectId, project?.updatedAt]); // re-read when page changes
  const [progress, setProgress] = useState(() => store.progress || []);       // [{title, links[], images[]}]
  const [announcements, setAnn] = useState(() => store.announcements || []);  // [{title, body, ts}]
  const [chat, setChat] = useState(() => store.chat || []);                   // [{from, text, ts}]

  function persist(next) {
    writeLocal(projectId, {
      progress,
      announcements,
      chat,
      ...next,
    });
  }

  /* ── Updates (announcements) ── */
  const [titleA, setTitleA] = useState("");
  const [bodyA, setBodyA] = useState("");
  function addAnnouncement() {
    if (!titleA.trim()) return;
    const item = { title: titleA.trim(), body: bodyA.trim(), ts: Date.now() };
    const next = [item, ...announcements];
    setAnn(next); persist({ announcements: next });
    setTitleA(""); setBodyA("");
  }

  /* ── Evidence (links + screenshots) ── */
  const [evTitle, setEvTitle] = useState("");
  const [evLink, setEvLink] = useState("");
  const [evImages, setEvImages] = useState([]);
  async function onPickFiles(e) {
    const files = Array.from(e.target.files || []);
    const out = [];
    for (const f of files) {
      const url = await fileToDataURL(f);
      out.push({ name: f.name, type: f.type, url });
    }
    setEvImages(prev => [...prev, ...out]);
  }
  function addProgress() {
    if (!evTitle.trim() && evImages.length === 0 && !evLink.trim()) return;
    const item = {
      title: evTitle.trim() || "Update",
      links: evLink.trim() ? [evLink.trim()] : [],
      images: evImages,
      ts: Date.now(),
    };
    const next = [item, ...progress];
    setProgress(next); persist({ progress: next });
    setEvTitle(""); setEvLink(""); setEvImages([]);
  }

  /* ── Chat (per project) ── */
  const [msg, setMsg] = useState("");
  function sendMessage(from = "developer") {
    if (!msg.trim()) return;
    const item = { from, text: msg.trim(), ts: Date.now() };
    const next = [...chat, item];
    setChat(next); persist({ chat: next });
    setMsg("");
  }

  if (!project) {
    return <div className="page-shell">{err ? <div className="text-error">{err}</div> : "Loading…"}</div>;
  }

  return (
    <div className="page-shell space-y-5">
      <div className="page-header">
        <h2 className="page-title">Project · {project.title}</h2>
        <div className="flex items-center gap-2">
          <select
            className="form-input bg-transparent"
            value={project.status || "draft"}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {ok && <div className="text-success">{ok}</div>}
      {err && <div className="text-error">{err}</div>}

      {/* Tabs */}
      <div className="card-surface p-3">
        <div className="flex gap-2">
          {["overview","updates","evidence","chat"].map(k => (
            <button
              key={k}
              className={`btn h-10 px-4 rounded-lg ${tab === k ? "btn-primary" : "btn-outline"}`}
              onClick={() => setTab(k)}
            >
              {k === "overview" ? "Overview" : k === "updates" ? "Announcements" : k === "evidence" ? "Evidence" : "Chat"}
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
              Client: <b>{client?.name || project.client?.name || "—"}</b>
            </div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Latest activity</div>
            <ul className="space-stack text-sm">
              {(announcements.slice(0,3)).map((a, i) => (
                <li key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="font-medium">{a.title}</div>
                  {a.body && <div className="text-muted mt-1">{a.body}</div>}
                </li>
              ))}
              {!announcements.length && <li className="text-muted-xs">No announcements yet.</li>}
            </ul>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS */}
      {tab === "updates" && (
        <div className="grid-2">
          <div className="card-surface card-pad space-stack">
            <div className="card-title">Post announcement</div>
            <input className="form-input" placeholder="Title" value={titleA} onChange={(e)=>setTitleA(e.target.value)} />
            <textarea className="form-textarea-sm" placeholder="What did you complete / plan?" value={bodyA} onChange={(e)=>setBodyA(e.target.value)} />
            <div className="form-actions">
              <button className="btn btn-primary" onClick={addAnnouncement}>Publish</button>
            </div>
            <div className="text-muted-xs">Client and Admin can see these updates.</div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Recent announcements</div>
            <div className="space-stack">
              {announcements.map((a,i)=>(
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="font-extrabold">{a.title}</div>
                  {a.body && <div className="text-muted mt-1 whitespace-pre-wrap">{a.body}</div>}
                  <div className="text-muted-xs mt-1">{new Date(a.ts).toLocaleString()}</div>
                </div>
              ))}
              {!announcements.length && <div className="text-muted-xs">Nothing yet.</div>}
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE */}
      {tab === "evidence" && (
        <div className="grid-2">
          <div className="card-surface card-pad space-stack">
            <div className="card-title">Add progress evidence</div>
            <input className="form-input" placeholder="Short title (e.g., 'Home page & Nav')" value={evTitle} onChange={(e)=>setEvTitle(e.target.value)} />
            <input className="form-input" placeholder="Link (optional, e.g., staging URL)" value={evLink} onChange={(e)=>setEvLink(e.target.value)} />
            <label className="block">
              <div className="form-label">Screenshots (PNG/JPG)</div>
              <input type="file" accept="image/*" multiple className="form-input" onChange={onPickFiles} />
            </label>

            {!!evImages.length && (
              <div className="grid grid-cols-3 gap-2">
                {evImages.map((im, idx)=>(
                  <img key={idx} alt="" src={im.url} className="rounded-lg border border-white/10" />
                ))}
              </div>
            )}

            <div className="form-actions">
              <button className="btn btn-primary" onClick={addProgress}>Add entry</button>
            </div>
            <div className="text-muted-xs">Visible to Client and Admin.</div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Evidence timeline</div>
            <div className="space-stack">
              {progress.map((it, i)=>(
                <div key={i} className="bg-white/5 rounded-xl p-3">
                  <div className="font-extrabold">{it.title}</div>
                  {!!(it.links||[]).length && (
                    <ul className="text-sm mt-1">
                      {it.links.map((l, k)=>(
                        <li key={k}><a className="subtle-link" href={l} target="_blank" rel="noreferrer">{l}</a></li>
                      ))}
                    </ul>
                  )}
                  {!!(it.images||[]).length && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {it.images.map((im, k)=>(
                        <img key={k} alt="" src={im.url} className="rounded-lg border border-white/10" />
                      ))}
                    </div>
                  )}
                  <div className="text-muted-xs mt-1">{new Date(it.ts).toLocaleString()}</div>
                </div>
              ))}
              {!progress.length && <div className="text-muted-xs">No evidence yet.</div>}
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
              {chat.map((m, i)=>(
                <div key={i} className={`p-2 rounded-lg ${m.from === "developer" ? "bg-primary/20" : "bg-white/10"}`}>
                  <div className="text-xs text-white/60 mb-1">{m.from} · {new Date(m.ts).toLocaleString()}</div>
                  <div>{m.text}</div>
                </div>
              ))}
              {!chat.length && <div className="text-muted-xs">No messages yet.</div>}
            </div>

            <div className="form-actions mt-tight">
              <input className="form-input" placeholder="Type a message for the client…" value={msg} onChange={(e)=>setMsg(e.target.value)} />
              <button className="btn btn-primary" onClick={()=>sendMessage("developer")}>Send</button>
            </div>
          </div>

          <div className="card-surface card-pad">
            <div className="card-title mb-2">Guidance</div>
            <ul className="text-sm text-muted space-stack">
              <li>All activity here is visible to Admin and the Client tied to this project.</li>
              <li>Status changes are saved to the backend; announcements/evidence/chat are local for now.</li>
              <li>You can replace local storage with real API endpoints when ready.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
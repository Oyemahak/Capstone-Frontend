// src/portals/client/ProjectDetail.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projects as api, rooms } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

/* ───────────────────────────────────────────────────────────
   Local persistence for requirements (until backend uploads)
   ─────────────────────────────────────────────────────────── */
const LSK = (pid) => `client:req:${pid}`;
const readReq = (pid) => {
  try { return JSON.parse(localStorage.getItem(LSK(pid)) || "{}"); } catch { return {}; }
};
const writeReq = (pid, v) => {
  try { localStorage.setItem(LSK(pid), JSON.stringify(v || {})); } catch {}
};

/* keep small file meta only */
const fileToMeta = (file) =>
  file ? { name: file.name, type: file.type || "", size: file.size || 0 } : null;

/* suggestions for quick add */
const COMMON_PAGES = [
  "Home", "Services", "About", "Contact",
  "Portfolio", "Blog", "FAQ", "Pricing",
  "Careers", "Privacy Policy", "Terms",
];

/* clean picker consistent with your UI */
function FilePicker({ id, value, label, accept, onPick, hint }) {
  return (
    <div className="space-y-2">
      <div className="form-label">{label}</div>
      <div className="flex items-center gap-2">
        <input id={id} type="file" accept={accept} className="sr-only"
               onChange={(e) => onPick(e.target.files?.[0] || null)} />
        <label htmlFor={id} className="btn btn-outline btn-sm cursor-pointer">Choose file</label>
        <span className="text-sm text-white/70 truncate max-w-[260px]">
          {value?.name || "No file chosen"}
        </span>
      </div>
      {hint && <div className="text-muted-xs">{hint}</div>}
    </div>
  );
}

/* Collapsible block for each page */
function Accordion({ items, openKey, onToggle, children }) {
  return (
    <div className="space-y-3">
      {items.map(({ key, title, subtitle, actions, content }) => {
        const open = openKey === key;
        return (
          <div key={key} className="rounded-xl bg-white/5 border border-white/10">
            <button
              type="button"
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 rounded-xl"
              onClick={() => onToggle(open ? "" : key)}
              aria-expanded={open}
            >
              <div className="flex-1">
                <div className="font-semibold">{title}</div>
                {subtitle && <div className="row-sub line-clamp-1">{subtitle}</div>}
              </div>
              <div className="flex items-center gap-2">
                {actions}
                <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>
            {open && <div className="px-4 pb-4">{content}</div>}
          </div>
        );
      })}
      {children}
    </div>
  );
}

/* one page's attachment list */
function Attachments({ files = [], onAdd, onRemove }) {
  return (
    <div className="space-stack">
      <div className="form-actions">
        <button className="btn btn-outline btn-sm" onClick={onAdd}>Add file</button>
      </div>
      {!files.length ? (
        <div className="empty-cell">No files yet.</div>
      ) : (
        files.map((f, i) => (
          <div key={`${f.name}-${i}`} className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
            <div className="text-sm">
              {f.name}{f.size ? <span className="text-white/50 ml-2">({Math.round(f.size/1024)} KB)</span> : null}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => onRemove(i)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}

function ChatBubble({ me, m }) {
  const mine = String(m.author) === String(me?._id);
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-primary text-white" : "bg-white/10"}`}>
        {!mine && <div className="text-xs text-white/60 mb-0.5">{m.authorRoleAtSend}</div>}
        <div>{m.text}</div>
        <div className="text-[10px] opacity-70 mt-1">{new Date(m.sentAt || m.ts).toLocaleString()}</div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { user } = useAuth();
  const { projectId } = useParams();

  const [proj, setProj] = useState(null);

  /* top tabs */
  const [tab, setTab] = useState("overview");

  /* chat */
  const [roomId, setRoomId] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  /* requirements (local) */
  const [logo, setLogo] = useState(null);
  const [reqDoc, setReqDoc] = useState(null);
  const [supporting, setSupporting] = useState([]);                 // [{name,size,type}]
  const [pages, setPages] = useState([]);                            // ["Home", ...]
  const [pageFiles, setPageFiles] = useState({});                    // { page: [{...}] }
  const [notes, setNotes] = useState({});                            // { page: "..." }
  const [openPageKey, setOpenPageKey] = useState("");               // accordion control

  /* quick add state */
  const [quickPick, setQuickPick] = useState(COMMON_PAGES[0]);
  const [customPage, setCustomPage] = useState("");

  /* savedAt for “overview” stats */
  const [savedAt, setSavedAt] = useState(null);

  /* ───────── load project & chat ───────── */
  useEffect(() => {
    (async () => {
      const d = await api.one(projectId);
      setProj(d.project || null);
    })();
  }, [projectId]);

  useEffect(() => {
    (async () => {
      const { roomId: rid, messages } = await rooms.get(projectId);
      setRoomId(rid);
      setMsgs(messages || []);
      setTimeout(() => listRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 0);
    })();
  }, [projectId]);

  /* restore local req draft */
  useEffect(() => {
    const saved = readReq(projectId);
    setLogo(saved.logo || null);
    setReqDoc(saved.reqDoc || null);
    setSupporting(saved.supporting || []);
    setPages(saved.pages || (saved.dynamicPages || [])); // backward compat
    setPageFiles(saved.pageFiles || {});
    setNotes(saved.notes || {});
    setSavedAt(saved.savedAt || null);
  }, [projectId]);

  /* ───────── chat ───────── */
  async function send() {
    if (!text.trim() || !roomId) return;
    const { message } = await rooms.send(projectId, { text: text.trim(), attachments: [] });
    setMsgs((prev) => [...prev, message]);
    setText("");
    setTimeout(() => listRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 0);
  }

  /* ───────── req save ───────── */
  function persistReq(next) {
    const payload = {
      logo, reqDoc, supporting, pages, pageFiles, notes,
      savedAt: Date.now(),
      ...next,
    };
    setSavedAt(payload.savedAt);
    writeReq(projectId, payload);
  }

  function saveRequirements() {
    persistReq({});
    // eslint-disable-next-line no-alert
    alert("Requirements saved (locally). We’ll wire backend uploads next.");
  }

  /* supportive docs */
  function addSupporting() {
    const el = document.createElement("input");
    el.type = "file";
    el.onchange = () => {
      const f = el.files?.[0]; if (!f) return;
      const next = [...supporting, fileToMeta(f)];
      setSupporting(next);
      persistReq({ supporting: next });
    };
    el.click();
  }

  /* pages: add, remove, attach */
  function ensureContainers(name) {
    setPageFiles((pf) => ({ ...pf, [name]: pf[name] || [] }));
    setNotes((n) => ({ ...n, [name]: n[name] || "" }));
  }

  function addPage(name) {
    if (!name) return;
    if (pages.includes(name)) { setOpenPageKey(name); return; }
    const next = [...pages, name];
    setPages(next);
    ensureContainers(name);
    setOpenPageKey(name);
    persistReq({ pages: next });
  }

  function addQuickPage() { addPage(quickPick); }
  function addCustom() {
    const n = customPage.trim(); if (!n) return;
    addPage(n); setCustomPage("");
  }

  function removePage(name) {
    const nextPages = pages.filter((p) => p !== name);
    const { [name]: _f, ...restFiles } = pageFiles;
    const { [name]: _n, ...restNotes } = notes;
    setPages(nextPages);
    setPageFiles(restFiles);
    setNotes(restNotes);
    setOpenPageKey("");
    persistReq({ pages: nextPages, pageFiles: restFiles, notes: restNotes });
  }

  function addPageFile(name) {
    const el = document.createElement("input");
    el.type = "file";
    el.onchange = () => {
      const f = el.files?.[0]; if (!f) return;
      setPageFiles((prev) => {
        const next = { ...prev, [name]: [...(prev[name] || []), fileToMeta(f)] };
        persistReq({ pageFiles: next });
        return next;
      });
    };
    el.click();
  }

  function removePageFile(name, idx) {
    setPageFiles((prev) => {
      const arr = [...(prev[name] || [])];
      arr.splice(idx, 1);
      const next = { ...prev, [name]: arr };
      persistReq({ pageFiles: next });
      return next;
    });
  }

  /* overview metrics */
  const filesTotal = useMemo(() => {
    const pageCount = Object.values(pageFiles || {}).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    return pageCount + supporting.length + (logo ? 1 : 0) + (reqDoc ? 1 : 0);
  }, [pageFiles, supporting, logo, reqDoc]);

  /* build accordion items for pages */
  const pageItems = pages.map((name) => ({
    key: name,
    title: name,
    subtitle: (pageFiles[name]?.length || 0) ? `${pageFiles[name].length} file(s)` : "No files yet",
    actions: (
      <button
        type="button"
        className="btn btn-outline btn-xs"
        onClick={(e) => { e.stopPropagation(); removePage(name); }}
        title="Remove page"
      >
        Remove
      </button>
    ),
    content: (
      <div className="space-stack">
        <Attachments
          files={pageFiles[name] || []}
          onAdd={() => addPageFile(name)}
          onRemove={(i) => removePageFile(name, i)}
        />
        <div>
          <div className="form-label">Notes</div>
          <textarea
            className="form-input min-h-[120px]"
            placeholder={`Tell us anything specific for the ${name} page…`}
            value={notes[name] || ""}
            onChange={(e) => {
              const v = e.target.value;
              setNotes((n) => {
                const next = { ...n, [name]: v };
                persistReq({ notes: next });
                return next;
              });
            }}
          />
        </div>
      </div>
    ),
  }));

  /* simple, roomy pill tabs */
  function TabButton({ id, children }) {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className={[
          "px-4 py-2 rounded-full font-medium transition-colors",
          active ? "bg-white/10" : "hover:bg-white/5"
        ].join(" ")}
        aria-current={active ? "page" : undefined}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="page-shell space-y-6">
      {/* Header + breadcrumb */}
      <div className="page-header">
                <h2 className="page-title">{proj?.title || "Project"}</h2>
        <div />
      </div>

      {/* Tab bar (spacious, separated pills) */}
      <div className="card-surface py-2 px-3">
        <div className="flex items-center gap-2">
          <TabButton id="overview">Overview</TabButton>
          <TabButton id="requirements">Requirements</TabButton>
          <TabButton id="discussions">Discussions</TabButton>
          <Link to={`/client/discussions/${projectId}`} className="ml-auto subtle-link">
            Open full discussion
          </Link>
        </div>
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="grid gap-5 md:grid-cols-2">
          {/* Summary with page badges */}
          <div className="card-surface p-4 space-y-3">
            <div className="card-title">Summary</div>
            <div className="text-white/80">{proj?.summary || "No summary yet."}</div>

            <div className="mt-2">
              <div className="row-sub mb-2">Pages added</div>
              {pages.length ? (
                <div className="flex flex-wrap gap-2">
                  {pages.map((p) => (
                    <span key={p} className="badge">{p}</span>
                  ))}
                </div>
              ) : (
                <div className="text-white/60 text-sm">No pages added yet.</div>
              )}
            </div>
          </div>

          {/* Meaningful details */}
          <div className="card-surface p-4">
            <div className="card-title mb-2">Details</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="row-sub">Developer</div>
                <div className="font-medium">{proj?.developer?.name || "—"}</div>
              </div>
              <div>
                <div className="row-sub">Pages selected</div>
                <div className="font-medium">{pages.length}</div>
              </div>
              <div>
                <div className="row-sub">Total files</div>
                <div className="font-medium">{filesTotal}</div>
              </div>
              <div>
                <div className="row-sub">Last saved</div>
                <div className="font-medium">
                  {savedAt ? new Date(savedAt).toLocaleString() : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENTS (unchanged behavior) */}
      {tab === "requirements" && (
        <div className="stack">
          {/* Core */}
          <div className="card-surface p-4">
            <div className="card-title mb-3">Core uploads</div>
            <div className="grid gap-4 md:grid-cols-2">
              <FilePicker id="logo" label="Upload Logo" value={logo} accept="image/*"
                          onPick={(f) => { const m=fileToMeta(f); setLogo(m); persistReq({ logo: m }); }}
                          hint="PNG/SVG preferred." />
              <FilePicker id="reqdoc" label="Requirement Document" value={reqDoc}
                          accept=".pdf,.doc,.docx,.txt,.md"
                          onPick={(f) => { const m=fileToMeta(f); setReqDoc(m); persistReq({ reqDoc: m }); }}
                          hint="Upload your brief/spec, if available." />
            </div>
          </div>

          {/* Supportive docs */}
          <div className="card-surface p-4">
            <div className="card-strip between">
              <div className="card-title">Supportive documents</div>
              <button type="button" className="btn btn-outline btn-sm" onClick={addSupporting}>Add file</button>
            </div>
            <div className="stack">
              {supporting.map((f, i) => (
                <div key={`${f.name}-${i}`} className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                  <div className="text-sm">
                    {f.name}{f.size ? <span className="text-white/50 ml-2">({Math.round(f.size/1024)} KB)</span> : null}
                  </div>
                  <button className="btn btn-outline btn-sm"
                          onClick={() => {
                            const next = supporting.filter((_, x) => x !== i);
                            setSupporting(next);
                            persistReq({ supporting: next });
                          }}>
                    Remove
                  </button>
                </div>
              ))}
              {!supporting.length && <div className="empty-cell">No files yet.</div>}
            </div>
          </div>

          {/* Dynamic Pages — quick add + custom add */}
          <div className="card-surface p-4">
            <div className="card-title mb-3">Website Pages</div>
            <div className="grid md:grid-cols-[minmax(200px,240px)_auto] gap-3 items-end">
              <div className="space-y-2">
                <div className="form-label">Quick add</div>
                <select className="form-input bg-transparent" value={quickPick} onChange={(e)=>setQuickPick(e.target.value)}>
                  {COMMON_PAGES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline" onClick={addQuickPage}>Add page</button>
                <div className="flex-1" />
              </div>
            </div>

            <div className="grid md:grid-cols-[minmax(200px,240px)_auto] gap-3 items-end mt-3">
              <div className="space-y-2">
                <div className="form-label">Custom page</div>
                <input className="form-input" placeholder="e.g. Case Studies"
                       value={customPage} onChange={(e)=>setCustomPage(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline" onClick={addCustom} disabled={!customPage.trim()}>Add custom page</button>
                <div className="flex-1" />
              </div>
            </div>
          </div>

          {/* Accordion for per-page content */}
          <Accordion
            items={pageItems}
            openKey={openPageKey}
            onToggle={setOpenPageKey}
          />

          <div className="toolbar-bottom">
            <button className="btn btn-primary" onClick={saveRequirements}>Save Requirements</button>
          </div>
        </div>
      )}

      {/* DISCUSSIONS */}
      {tab === "discussions" && (
        <div className="card-surface flex flex-col h-[70vh]">
          <div className="card-strip">
            <div className="card-title">Room</div>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {!msgs.length && <div className="empty-note">No messages yet.</div>}
            {msgs.map((m) => <ChatBubble key={m._id || m.id} me={user} m={m} />)}
          </div>
          <div className="border-t border-white/10 p-3 flex gap-2">
            <input className="form-input flex-1" placeholder="Message…"
                   value={text} onChange={(e)=>setText(e.target.value)}
                   onKeyDown={(e)=> e.key==="Enter" && send()} disabled={!roomId} />
            <button className="btn btn-primary" onClick={send} disabled={!roomId || !text.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
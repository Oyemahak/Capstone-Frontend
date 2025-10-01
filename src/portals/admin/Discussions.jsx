// src/portals/admin/Discussions.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { projects as api } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

/* Local thread store: project room */
const ROOM_KEY = (projectId) => `room:${projectId}`;
const loadRoom = (id) => { try { return JSON.parse(localStorage.getItem(ROOM_KEY(id)) || "[]"); } catch { return []; } };
const saveRoom = (id, arr) => { try { localStorage.setItem(ROOM_KEY(id), JSON.stringify(arr)); } catch {} };

function Message({ me, m }) {
  const mine = m.authorId === me?._id;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-primary text-white" : "bg-white/10"}`}>
        {!mine && <div className="text-xs text-white/60 mb-0.5">{m.authorName} · {m.role}</div>}
        <div>{m.text}</div>
        <div className="text-[10px] opacity-70 mt-1">{new Date(m.ts).toLocaleString()}</div>
      </div>
    </div>
  );
}

export default function Discussions() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { projectId } = useParams();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [curr, setCurr] = useState(projectId || "");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  const listRef = useRef(null);

  useEffect(() => {
    (async () => {
      const d = await api.list();
      setRows(d.projects || []);
    })();
  }, []);

  useEffect(() => {
    if (!curr) return;
    setMsgs(loadRoom(curr));
  }, [curr]);

  useEffect(() => {
    if (!projectId && rows.length) return; // keep selection
    if (projectId) {
      setCurr(projectId);
    }
  }, [projectId, rows.length]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return (rows || []).filter(p => !n || `${p.title} ${p.summary}`.toLowerCase().includes(n));
  }, [rows, q]);

  function send() {
    if (!text.trim() || !curr) return;
    const next = [
      ...msgs,
      {
        id: crypto.randomUUID(),
        authorId: user?._id,
        authorName: user?.name || "Admin",
        role: "admin",
        text: text.trim(),
        ts: Date.now(),
      },
    ];
    saveRoom(curr, next);
    setMsgs(next);
    setText("");
    setTimeout(() => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 0);
  }

  return (
    <div className="page-shell grid gap-5 md:grid-cols-[320px_1fr]">
      {/* Left: projects */}
      <div>
        <div className="card-surface p-4 mb-3">
          <div className="card-title mb-2">Projects</div>
          <input className="form-input" placeholder="Search…" value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>

        <div className="card-surface">
          <div className="list">
            {filtered.map(p => (
              <button
                key={p._id}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 ${curr===p._id ? "bg-white/10" : ""}`}
                onClick={() => { setCurr(p._id); nav(`/admin/discussions/${p._id}`, { replace: true }); }}
                title="Open project room"
              >
                <div className="font-semibold line-clamp-1">{p.title}</div>
                {p.summary && <div className="row-sub line-clamp-1">{p.summary}</div>}
              </button>
            ))}
            {!filtered.length && <div className="empty-cell">No projects.</div>}
          </div>
        </div>
      </div>

      {/* Right: room */}
      <div className="card-surface flex flex-col h-[70vh]">
        <div className="card-strip between">
          <div className="card-title">Room</div>
          {curr && <Link className="subtle-link" to={`/admin/projects/${curr}`}>Open project</Link>}
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {!curr && <div className="empty-note">Pick a project on the left.</div>}
          {curr && !msgs.length && <div className="empty-note">No messages yet.</div>}
          {msgs.map(m => <Message key={m.id} me={user} m={m} />)}
        </div>

        <div className="border-t border-white/10 p-3 flex gap-2">
          <input
            className="form-input flex-1"
            placeholder="Write a message…"
            value={text}
            onChange={(e)=>setText(e.target.value)}
            onKeyDown={(e)=> e.key==="Enter" && send()}
            disabled={!curr}
          />
          <button className="btn btn-primary" onClick={send} disabled={!curr || !text.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { projects as api, rooms } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

function Bubble({ me, m }) {
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

export default function Discussions() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { projectId } = useParams();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [curr, setCurr] = useState(projectId || "");
  const [roomId, setRoomId] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  // Dev sees only assigned projects
  useEffect(() => {
    (async () => {
      const d = await api.list();
      const mine = (d.projects || []).filter(p => p.developer?._id === user?._id);
      setRows(mine);
    })();
  }, [user?._id]);

  // Load messages when project changes
  useEffect(() => {
    (async () => {
      if (!curr) { setMsgs([]); setRoomId(""); return; }
      const { roomId: rid, messages } = await rooms.get(curr);
      setRoomId(rid);
      setMsgs(messages || []);
      setTimeout(() => listRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 0);
    })();
  }, [curr]);

  useEffect(() => { if (projectId) setCurr(projectId); }, [projectId]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return (rows || []).filter(p => !n || `${p.title} ${p.summary}`.toLowerCase().includes(n));
  }, [rows, q]);

  async function send() {
    if (!text.trim() || !curr) return;
    const { message } = await rooms.send(curr, { text: text.trim(), attachments: [] });
    setMsgs(prev => [...prev, message]);
    setText("");
    setTimeout(() => listRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 0);
  }

  return (
    <div className="page-shell grid gap-5 md:grid-cols-[320px_1fr]">
      <div>
        <div className="card-surface p-4 mb-3">
          <div className="card-title mb-2">My Projects</div>
          <input className="form-input" placeholder="Search…" value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        <div className="card-surface">
          <div className="list">
            {filtered.map(p => (
              <button
                key={p._id}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 ${curr===p._id ? "bg-white/10" : ""}`}
                onClick={() => { setCurr(p._id); nav(`/dev/discussions/${p._id}`, { replace: true }); }}
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

      <div className="card-surface flex flex-col h-[70vh]">
        <div className="card-strip between">
          <div className="card-title">Room</div>
          {curr && <Link className="subtle-link" to={`/dev/projects/${curr}`}>Open project</Link>}
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {!curr && <div className="empty-note">Pick a project on the left.</div>}
          {curr && !msgs.length && <div className="empty-note">No messages yet.</div>}
          {msgs.map(m => <Bubble key={m._id || m.id} me={user} m={m} />)}
        </div>

        <div className="border-t border-white/10 p-3 flex gap-2">
          <input className="form-input flex-1" placeholder="Write a message…" value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=> e.key==="Enter" && send()} disabled={!roomId} />
          <button className="btn btn-primary" onClick={send} disabled={!roomId || !text.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}
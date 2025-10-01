// src/portals/admin/Discussions.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { projects as api, rooms } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

function Message({ me, m }) {
  const mine = m.author === me?._id;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-primary text-white" : "bg-white/10"}`}>
        {!mine && <div className="text-xs text-white/60 mb-0.5">{m.authorRoleAtSend}</div>}
        <div>{m.text}</div>
        <div className="text-[10px] opacity-70 mt-1">{new Date(m.sentAt).toLocaleString()}</div>
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
    (async () => {
      const d = await rooms.get(curr);
      setMsgs(d.messages || []);
    })();
  }, [curr]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter(
      (p) => !n || `${p.title} ${p.summary}`.toLowerCase().includes(n)
    );
  }, [rows, q]);

  async function send() {
    if (!text.trim() || !curr) return;
    const { message } = await rooms.send(curr, { text });
    setMsgs((m) => [...m, message]);
    setText("");
    setTimeout(() => listRef.current?.scrollTo({ top: 999999 }), 0);
  }

  return (
    <div className="page-shell grid gap-5 md:grid-cols-[320px_1fr]">
      <div>
        <div className="card-surface p-4 mb-3">
          <div className="card-title">Projects</div>
          <input className="form-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
        </div>
        <div className="card-surface">
          {filtered.map((p) => (
            <button key={p._id} className={`w-full text-left px-4 py-3 hover:bg-white/5 ${curr === p._id ? "bg-white/10" : ""}`}
              onClick={() => { setCurr(p._id); nav(`/admin/discussions/${p._id}`, { replace: true }); }}>
              <div className="font-semibold">{p.title}</div>
              <div className="row-sub">{p.summary}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface flex flex-col h-[70vh]">
        <div className="card-strip between">
          <div className="card-title">Room</div>
          {curr && <Link className="subtle-link" to={`/admin/projects/${curr}`}>Open project</Link>}
        </div>
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {!msgs.length && <div className="empty-note">No messages yet.</div>}
          {msgs.map((m) => <Message key={m._id} me={user} m={m} />)}
        </div>
        <div className="border-t border-white/10 p-3 flex gap-2">
          <input className="form-input flex-1" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
          <button className="btn btn-primary" onClick={send} disabled={!text.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}
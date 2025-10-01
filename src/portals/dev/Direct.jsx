import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { directory, dm } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Direct() {
  const { user } = useAuth();
  const { peerId } = useParams();
  const { state } = useLocation();

  const [people, setPeople] = useState([]);
  const [q, setQ] = useState("");

  const [peer, setPeer] = useState(null);
  const [threadId, setThreadId] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const boxRef = useRef(null);

  // Load directory (admins + developers), excluding me
  useEffect(() => {
    (async () => {
      try {
        const d = await directory.list();
        const rows = (d.users || []).filter(u => u._id !== user?._id);
        setPeople(rows);
      } catch {
        setPeople([]);
      }
    })();
  }, [user?._id]);

  // When peerId changes, ensure thread and load messages
  useEffect(() => {
    (async () => {
      setMsgs([]);
      setThreadId("");
      if (!peerId) { setPeer(null); return; }

      const found =
        people.find(u => u._id === peerId) ||
        (state?.peerEmail ? { _id: peerId, name: state?.peerName, email: state?.peerEmail } : null);

      if (!found) { setPeer(null); return; }
      setPeer(found);

      // open/ensure thread, then load messages
      const opened = await dm.open(found._id);
      setThreadId(opened.threadId);

      const resp = await dm.get(opened.threadId);
      setMsgs(resp.messages || []);

      // scroll
      setTimeout(() => boxRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 0);
    })();
  }, [peerId, people, state?.peerEmail, state?.peerName]);

  async function send() {
    if (!text.trim() || !threadId) return;
    const { message } = await dm.send(threadId, { text: text.trim(), attachments: [] });
    setMsgs(prev => [...prev, message]);
    setText("");
    setTimeout(() => boxRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 0);
  }

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return people.filter(u => !n || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(n));
  }, [people, q]);

  return (
    <div className="page-shell grid gap-5 md:grid-cols-[320px_1fr]">
      {/* People */}
      <div>
        <div className="card-surface p-4 mb-3">
          <div className="card-title mb-2">People</div>
          <input className="form-input" placeholder={`Search… (${filtered.length} users)`} value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        <div className="card-surface">
          <div className="list">
            {filtered.map(u => (
              <Link key={u._id} to={`/dev/direct/${u._id}`} className={`block px-4 py-3 hover:bg-white/5 ${peerId===u._id ? "bg-white/10" : ""}`}>
                <div className="font-semibold line-clamp-1">{u.name || "—"}</div>
                <div className="row-sub">{u.email} · <span className="capitalize">{u.role}</span></div>
              </Link>
            ))}
            {!filtered.length && <div className="empty-cell">No users.</div>}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="card-surface flex flex-col h-[70vh]">
        <div className="card-strip">
          <div className="card-title">{peer ? (peer.name || peer.email || "Direct") : "Direct"}</div>
        </div>

        <div ref={boxRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {!peer && <div className="empty-note">Pick someone on the left.</div>}
          {peer && !msgs.length && <div className="empty-note">No messages yet.</div>}
          {msgs.map(m => {
            const mine = String(m.author) === String(user?._id);
            return (
              <div key={m._id || m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-primary text-white" : "bg-white/10"}`}>
                  <div>{m.text}</div>
                  <div className="text-[10px] opacity-70 mt-1">{new Date(m.sentAt || m.ts).toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-3 flex gap-2">
          <input className="form-input flex-1" placeholder="Message…" value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=> e.key==="Enter" && send()} disabled={!threadId} />
          <button className="btn btn-primary" onClick={send} disabled={!threadId || !text.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}
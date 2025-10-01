// src/portals/admin/Direct.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { dm } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Direct() {
  const { user } = useAuth();
  const { peerId } = useParams();
  const { state } = useLocation();

  const [threadId, setThreadId] = useState("");
  const [peer, setPeer] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!peerId) return;
      setPeer({ _id: peerId, name: state?.peerName, email: state?.peerEmail });
      const { threadId } = await dm.open(peerId);
      setThreadId(threadId);
      const d = await dm.get(threadId);
      setMsgs(d.messages || []);
    })();
  }, [peerId, state?.peerEmail, state?.peerName]);

  async function send() {
    if (!text.trim() || !threadId) return;
    const { message } = await dm.send(threadId, { text });
    setMsgs((m) => [...m, message]);
    setText("");
    setTimeout(
      () => boxRef.current?.scrollTo({ top: 999999, behavior: "smooth" }),
      0
    );
  }

  return (
    <div className="page-shell space-y-4">
      <div className="page-header">
        <h2 className="page-title">
          {peer ? peer.name || peer.email : "Direct"}
        </h2>
        <div />
      </div>

      <div className="card-surface flex flex-col h-[70vh]">
        <div ref={boxRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {!msgs.length && <div className="empty-note">No messages yet.</div>}
          {msgs.map((m) => {
            const mine = m.author === user?._id;
            return (
              <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-primary text-white" : "bg-white/10"}`}>
                  <div>{m.text}</div>
                  <div className="text-[10px] opacity-70 mt-1">{new Date(m.sentAt).toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-3 flex gap-2">
          <input
            className="form-input flex-1"
            placeholder="Message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="btn btn-primary" onClick={send} disabled={!text.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
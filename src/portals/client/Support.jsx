import { useState } from "react";

export default function Support() {
  const [subj, setSubj] = useState("");
  const [body, setBody] = useState("");

  function send() {
    if (!subj.trim() || !body.trim()) return alert("Please write a subject and message.");
    alert("Thanks! Your message has been sent (demo). We’ll wire support email next.");
    setSubj(""); setBody("");
  }

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <h2 className="page-title">Support</h2>
        <div />
      </div>

      <div className="card-surface p-4 space-y-4">
        <div>
          <div className="text-sm mb-1">Subject</div>
          <input className="form-input" value={subj} onChange={(e)=>setSubj(e.target.value)} />
        </div>
        <div>
          <div className="text-sm mb-1">Message</div>
          <textarea className="form-input min-h-[160px]" value={body} onChange={(e)=>setBody(e.target.value)} />
        </div>
        <div className="toolbar-bottom">
          <button className="btn btn-primary" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
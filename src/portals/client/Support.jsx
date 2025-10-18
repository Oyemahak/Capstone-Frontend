// src/portals/client/Support.jsx
import { useMemo, useRef, useState } from "react";
import { support as sendSupport } from "@/lib/forms.js";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Support() {
  const { user } = useAuth();
  const [subj, setSubj] = useState("");
  const [body, setBody] = useState("");

  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const okTimerRef = useRef(null);

  const words = useMemo(
    () => (body.trim() ? body.trim().split(/\s+/).length : 0),
    [body]
  );

  function clearToastsSoon() {
    if (okTimerRef.current) clearTimeout(okTimerRef.current);
    okTimerRef.current = setTimeout(() => {
      setOk("");
      setErr("");
    }, 3000);
  }

  async function submit() {
    if (busy) return;
    setOk("");
    setErr("");

    const subject = subj.trim();
    const message = body.trim();

    if (!subject || !message) {
      setErr("Please write a subject and a message.");
      clearToastsSoon();
      return;
    }
    if (message.length > 5000) {
      setErr("Message is too long. Please keep it under 5,000 characters.");
      clearToastsSoon();
      return;
    }

    try {
      setBusy(true);
      await sendSupport({
        subject,
        message,
        meta: {
          page: "/client/support",
          userId: user?._id,
          userEmail: user?.email,
          userName: user?.name,
          role: user?.role,
          ts: Date.now(),
        },
      });
      setOk("Thanks! Your message has been sent.");
      setSubj("");
      setBody("");
      clearToastsSoon();
    } catch (e) {
      setErr(e?.message || "Failed to send. Please try again.");
      clearToastsSoon();
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e) {
    // Allow Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <h2 className="page-title">Support</h2>
        <div />
      </div>

      {(ok || err) && (
        <div className="space-y-1">
          {ok && <div className="text-success">{ok}</div>}
          {err && <div className="text-error">{err}</div>}
        </div>
      )}

      <div className="card-surface p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="form-field">
            <div className="form-label">Subject</div>
            <input
              className="form-input"
              placeholder="Billing, bug, feature request…"
              value={subj}
              onChange={(e) => setSubj(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={busy}
              aria-label="Support subject"
            />
          </label>

          <label className="form-field">
            <div className="form-label">Your email</div>
            <input
              className="form-input"
              value={user?.email || ""}
              disabled
              aria-label="Your email"
            />
          </label>
        </div>

        <label className="form-field">
          <div className="form-label between">
            <span>Message</span>
            <span className="text-muted-xs">
              {words} word{words === 1 ? "" : "s"}
            </span>
          </div>
          <textarea
            className="form-input min-h-[180px]"
            placeholder="Tell us what you need help with. Include steps to reproduce if reporting a bug."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
            aria-label="Support message"
          />
        </label>

        <div className="toolbar-bottom">
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={busy}
            aria-busy={busy ? "true" : "false"}
          >
            {busy ? "Sending…" : "Send"}
          </button>
          <span className="text-muted-xs">
            We’ll reply to your account email.
          </span>
        </div>
      </div>
    </div>
  );
}
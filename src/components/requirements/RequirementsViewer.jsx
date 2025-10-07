// src/components/requirements/RequirementsViewer.jsx
import React from "react";

/** Read-only renderer for a Requirement document */
export default function RequirementsViewer({ req }) {
  if (!req) return <div className="text-muted-xs">Nothing uploaded yet.</div>;

  return (
    <div className="space-stack">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="row-sub">Logo</div>
          {req.logo ? (
            <a className="subtle-link" href={req.logo.url} target="_blank" rel="noreferrer">
              {req.logo.name}
            </a>
          ) : "—"}
        </div>
        <div>
          <div className="row-sub">Brief</div>
          {req.brief ? (
            <a className="subtle-link" href={req.brief.url} target="_blank" rel="noreferrer">
              {req.brief.name}
            </a>
          ) : "—"}
        </div>
      </div>

      <div>
        <div className="row-sub mb-1">Supporting documents</div>
        {(req.supporting || []).length ? (
          <ul className="list-disc pl-5 text-sm">
            {req.supporting.map((f, i) => (
              <li key={i}>
                <a className="subtle-link" href={f.url} target="_blank" rel="noreferrer">{f.name}</a>
              </li>
            ))}
          </ul>
        ) : "—"}
      </div>

      <div>
        <div className="row-sub mb-1">Pages</div>
        {(req.pages || []).length ? (
          <div className="space-stack">
            {req.pages.map((p, i) => (
              <div key={`${p.name}-${i}`} className="bg-white/5 rounded-lg p-3">
                <div className="font-semibold">{p.name}</div>
                {p.note && <div className="text-white/70 text-sm mt-1 whitespace-pre-wrap">{p.note}</div>}
                {!!(p.files||[]).length && (
                  <ul className="list-disc pl-5 text-sm mt-1">
                    {p.files.map((f, k) => (
                      <li key={k}><a className="subtle-link" href={f.url} target="_blank" rel="noreferrer">{f.name}</a></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : "—"}
      </div>

      <div className="text-muted-xs">
        Updated: {req.updatedAt ? new Date(req.updatedAt).toLocaleString() : "—"}
      </div>
    </div>
  );
}
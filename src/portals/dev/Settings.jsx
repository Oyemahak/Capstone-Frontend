// src/portals/dev/Settings.jsx
import { useAuth } from "@/context/AuthContext.jsx";
import { useState } from "react";

export default function DevSettings() {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState("MSPixel Dev Portal");
  const [env, setEnv] = useState("production");
  const [ok, setOk] = useState("");

  function save() {
    // purely cosmetic for now
    setOk("Saved");
    setTimeout(() => setOk(""), 900);
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <div />
      </div>

      <div className="card-surface card-pad space-stack max-w-3xl">
        <div className="text-muted-xs">Developer · {user?.email}</div>

        <label className="block">
          <div className="form-label">Project name</div>
          <input className="form-input" value={projectName} onChange={(e)=>setProjectName(e.target.value)} />
        </label>

        <label className="block">
          <div className="form-label">Default environment</div>
          <select className="form-input bg-transparent" value={env} onChange={(e)=>setEnv(e.target.value)}>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
          </select>
        </label>

        {ok && <div className="text-success">{ok}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
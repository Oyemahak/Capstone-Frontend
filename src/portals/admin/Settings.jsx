import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { API_BASE } from "@/lib/api.js";

export default function Settings() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  async function doLogout(){
    try { await logout(); } catch {}
    nav("/", { replace:true });
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <div />
      </div>

      <div className="card card-pad-lg form-narrow">
        <div className="text-sm">Logged in as <b>{user?.email}</b></div>
        <div className="text-muted-xs">API Base: <code>{API_BASE}</code></div>
        <button onClick={doLogout} className="btn btn-outline">Logout</button>
      </div>
    </div>
  );
}
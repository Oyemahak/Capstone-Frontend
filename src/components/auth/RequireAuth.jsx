import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAuth({ roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="card-surface p-6">Checking session…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    // send them to their own home
    const fallback = user.role === 'admin' ? '/admin' : user.role === 'developer' ? '/dev' : '/client';
    return <Navigate to={fallback} replace />;
  }

  if (user.status === 'pending' && user.role === 'client') {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="card-surface p-6 max-w-md text-center">
          <h3 className="font-extrabold text-xl mb-2">Awaiting Approval</h3>
          <p className="text-textSub">Your account is pending admin approval. You’ll be notified by email once approved.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
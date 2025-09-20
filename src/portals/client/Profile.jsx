import { useAuth } from '../../context/AuthContext';
import PortalShell from '../../components/portal/PortalShell';

export default function Profile() {
  const { user } = useAuth();
  return (
    <PortalShell>
      <h1 className="text-2xl font-black mb-4">Profile</h1>
      <div className="card-surface p-6 max-w-xl">
        <div className="text-sm text-textSub">Name</div>
        <div>{user?.name}</div>
        <div className="text-sm text-textSub mt-3">Email</div>
        <div>{user?.email}</div>
        <div className="text-sm text-textSub mt-3">Role</div>
        <div>{user?.role}</div>
        <div className="text-sm text-textSub mt-3">Status</div>
        <div>{user?.status}</div>
      </div>
    </PortalShell>
  );
}
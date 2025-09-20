import PortalShell from '../../components/portal/PortalShell';

export default function Settings() {
  return (
    <PortalShell>
      <h1 className="text-2xl font-black mb-4">Settings</h1>
      <div className="card-surface p-6 max-w-xl">
        <p className="text-textSub">Add organization settings here (branding, email templates, etc.).</p>
      </div>
    </PortalShell>
  );
}
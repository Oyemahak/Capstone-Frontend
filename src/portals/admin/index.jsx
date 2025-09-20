import { Routes, Route } from 'react-router-dom';
import RequireAuth from '../../components/auth/RequireAuth';
import AdminDashboard from './AdminDashboard';
import Approvals from './Approvals';
import Users from './Users';
import UserDetail from './UserDetail';
import CreateUser from './CreateUser';
import Projects from './Projects';
import ProjectDetail from './ProjectDetail';
import Settings from './Settings';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<RequireAuth roles={['admin']} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="users" element={<Users />} />
        <Route path="users/new" element={<CreateUser />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
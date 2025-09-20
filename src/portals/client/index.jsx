import { Routes, Route } from 'react-router-dom';
import RequireAuth from '../../components/auth/RequireAuth';
import ClientDashboard from './ClientDashboard';
import Files from './Files';
import Profile from './Profile';

export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<RequireAuth roles={['client']} />}>
        <Route index element={<ClientDashboard />} />
        <Route path="projects" element={<ClientDashboard />} />
        <Route path="files" element={<Files />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
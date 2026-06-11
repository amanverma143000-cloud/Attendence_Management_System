import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CameraPage from './pages/employee/CameraPage';
import OvertimeRequest from './pages/employee/OvertimeRequest';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  const { token } = useSelector((s) => s.auth);
  const { dark } = useSelector((s) => s.theme);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {token && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/overtime/request" element={<OvertimeRequest />} />

            {/* Camera strictly for Employee only */}
            <Route element={<RoleRoute roles={['Employee']} />}>
              <Route path="/camera" element={<CameraPage />} />
            </Route>

            <Route element={<RoleRoute roles={['Manager', 'Admin']} />}>
              <Route path="/manager" element={<ManagerDashboard />} />
            </Route>

            <Route element={<RoleRoute roles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </div>
    </div>
  );
}

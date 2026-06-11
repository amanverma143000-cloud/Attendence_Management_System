import { useSelector } from 'react-redux';
import EmployeeDashboard from './employee/EmployeeDashboard';
import ManagerDashboard from './manager/ManagerDashboard';
import AdminDashboard from './admin/AdminDashboard';

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  if (user?.role === 'Admin') return <AdminDashboard />;
  if (user?.role === 'Manager') return <ManagerDashboard />;
  return <EmployeeDashboard />;
}

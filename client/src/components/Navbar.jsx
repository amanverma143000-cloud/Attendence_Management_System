import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { toggleTheme } from '../features/theme/themeSlice';

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { dark } = useSelector((s) => s.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMenuOpen(false);
  };

  const navLinks = [
    user?.role === 'Employee' && { to: '/camera', label: 'Punch' },
    (user?.role === 'Manager' || user?.role === 'Admin') && { to: '/manager', label: 'Manager Panel' },
    user?.role === 'Admin' && { to: '/admin', label: 'Admin' },
  ].filter(Boolean);

  return (
    <>
      <nav className="bg-blue-700 dark:bg-gray-800 text-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Brand */}
          <Link to="/dashboard" className="font-bold text-lg tracking-wide">
            AMS
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-blue-200 transition-colors">
                {label}
              </Link>
            ))}
            <span className="bg-blue-500 dark:bg-gray-600 px-2 py-0.5 rounded text-xs">
              {user?.role}
            </span>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="bg-blue-600 dark:bg-gray-700 px-2 py-1 rounded hover:opacity-80 transition"
              title="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile right: theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="bg-blue-600 dark:bg-gray-700 px-2 py-1 rounded hover:opacity-80 transition text-sm"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded hover:bg-blue-600 dark:hover:bg-gray-700 transition"
              aria-label="Toggle menu"
            >
              <span className="block w-5 h-0.5 bg-white mb-1" />
              <span className="block w-5 h-0.5 bg-white mb-1" />
              <span className="block w-5 h-0.5 bg-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 z-40 h-full w-64 bg-blue-800 dark:bg-gray-900 text-white flex flex-col shadow-2xl md:hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-blue-700 dark:border-gray-700">
              <span className="font-bold text-lg">AMS</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl leading-none hover:text-blue-300"
              >
                &times;
              </button>
            </div>

            {/* User info */}
            <div className="px-5 py-4 border-b border-blue-700 dark:border-gray-700">
              <p className="font-medium text-sm">{user?.name}</p>
              <span className="inline-block mt-1 bg-blue-600 dark:bg-gray-700 text-xs px-2 py-0.5 rounded">
                {user?.role}
              </span>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition text-sm font-medium"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-blue-700 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

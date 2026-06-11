import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl text-white text-xl font-bold mb-3">
            A
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Attendance Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-4"
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm px-3 py-2.5 rounded-xl">
              {error.data?.message || 'Login failed. Please try again.'}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Email address
            </label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Password
            </label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm sm:text-base disabled:opacity-50 transition"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            No account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

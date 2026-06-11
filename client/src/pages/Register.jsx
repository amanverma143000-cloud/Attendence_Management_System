import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Employee', department: '' });
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(form).unwrap();
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch {}
  };

  const fields = [
    { key: 'name', type: 'text', label: 'Full Name', placeholder: 'John Doe', autoComplete: 'name', required: true },
    { key: 'email', type: 'email', label: 'Email Address', placeholder: 'you@example.com', autoComplete: 'email', required: true },
    { key: 'password', type: 'password', label: 'Password', placeholder: '••••••••', autoComplete: 'new-password', required: true },
    { key: 'department', type: 'text', label: 'Department', placeholder: 'e.g. Engineering (optional)', autoComplete: 'organization', required: false },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl text-white text-xl font-bold mb-3">
            A
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join the Attendance Management System</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-4"
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm px-3 py-2.5 rounded-xl">
              {error.data?.message || 'Registration failed. Please try again.'}
            </div>
          )}

          {fields.map(({ key, type, label, placeholder, autoComplete, required }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {label}
              </label>
              <input
                className="input"
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={required}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Role</label>
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm sm:text-base disabled:opacity-50 transition"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

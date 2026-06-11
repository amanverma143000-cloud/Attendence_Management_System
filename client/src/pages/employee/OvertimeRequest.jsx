import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRequestOvertimeMutation } from '../../features/overtime/overtimeApi';

export default function OvertimeRequest() {
  const [form, setForm] = useState({ date: '', hours: '', reason: '' });
  const [request, { isLoading, error }] = useRequestOvertimeMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await request({ ...form, hours: Number(form.hours) }).unwrap();
      navigate('/dashboard');
    } catch {}
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-7">
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white mb-1">Request Overtime</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
            Submit a request for overtime hours for manager review.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm px-3 py-2.5 rounded-xl">
              {error.data?.message || 'Submission failed. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Overtime Hours
              </label>
              <input
                className="input"
                type="number"
                min="0.5"
                step="0.5"
                placeholder="e.g. 2.5"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Reason <span className="text-gray-400">(min. 5 characters)</span>
              </label>
              <textarea
                className="input h-24 sm:h-28 resize-none"
                placeholder="Describe the reason for overtime..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-semibold text-sm sm:text-base disabled:opacity-50 transition"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetTodayAttendanceQuery, useGetMyAttendanceQuery } from '../../features/attendance/attendanceApi';
import { useGetMyOvertimeQuery } from '../../features/overtime/overtimeApi';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';

function SelfieThumb({ src, label }) {
  const [open, setOpen] = useState(false);
  if (!src) return <span className="text-gray-400 text-xs">—</span>;
  return (
    <>
      <button onClick={() => setOpen(true)} className="shrink-0">
        <img
          src={src}
          alt={label}
          className="w-8 h-8 rounded-full object-cover border-2 border-blue-300 hover:scale-110 transition"
        />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={label}
            className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

function LocationLink({ loc, label }) {
  if (!loc?.latitude) return <span className="text-gray-400 text-xs">—</span>;
  return (
    <a
      href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline text-xs whitespace-nowrap"
      title={`${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`}
    >
      {label} ↗
    </a>
  );
}

export default function EmployeeDashboard() {
  const { user } = useSelector((s) => s.auth);
  const { data: today } = useGetTodayAttendanceQuery();
  const { data: history = [] } = useGetMyAttendanceQuery();
  const { data: overtime = [] } = useGetMyOvertimeQuery();

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8 space-y-5 max-w-5xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white">Welcome, {user?.name}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date().toDateString()}</p>
        </div>
        <Link
          to="/camera"
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium"
        >
          {today?.punchIn && !today?.punchOut ? 'Punch Out →' : '+ Punch In'}
        </Link>
      </div>

      {/* Today Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 text-sm sm:text-base">
          Today's Attendance
        </h3>
        {today ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {/* Punch In */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Punch In</p>
              <p className="font-semibold text-base dark:text-white">
                {today.punchIn ? new Date(today.punchIn).toLocaleTimeString() : '—'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <SelfieThumb src={today.punchInImage} label="Punch-in selfie" />
                <LocationLink loc={today.punchInLocation} label="View location" />
              </div>
            </div>
            {/* Punch Out */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Punch Out</p>
              <p className="font-semibold text-base dark:text-white">
                {today.punchOut ? new Date(today.punchOut).toLocaleTimeString() : '—'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <SelfieThumb src={today.punchOutImage} label="Punch-out selfie" />
                <LocationLink loc={today.punchOutLocation} label="View location" />
              </div>
            </div>
            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Summary</p>
              <p className="font-bold text-2xl dark:text-white">{today.totalHours}<span className="text-sm font-normal">h</span></p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <StatusBadge status={today.status} />
                <StatusBadge status={today.validationStatus} />
              </div>
              {today.remarks && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">"{today.remarks}"</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">No attendance record for today.</p>
            <Link
              to="/camera"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg transition"
            >
              Punch In Now
            </Link>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 text-sm sm:text-base">
          Recent Attendance <span className="text-xs font-normal text-gray-400">(last 30 days)</span>
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[580px] px-4 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">In</th>
                  <th className="pb-2 pr-3 font-medium">Out</th>
                  <th className="pb-2 pr-3 font-medium">Hrs</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">Selfies</th>
                  <th className="pb-2 font-medium">Locations</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-400 text-sm">No records found.</td>
                  </tr>
                ) : history.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                  >
                    <td className="py-2.5 pr-3 font-medium dark:text-gray-200">{r.date}</td>
                    <td className="py-2.5 pr-3 text-gray-600 dark:text-gray-300">
                      {r.punchIn ? new Date(r.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-2.5 pr-3 text-gray-600 dark:text-gray-300">
                      {r.punchOut ? new Date(r.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold dark:text-white">{r.totalHours}h</td>
                    <td className="py-2.5 pr-3"><StatusBadge status={r.status} /></td>
                    <td className="py-2.5 pr-3">
                      <div className="flex gap-1">
                        <SelfieThumb src={r.punchInImage} label="In" />
                        <SelfieThumb src={r.punchOutImage} label="Out" />
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-col gap-0.5">
                        <LocationLink loc={r.punchInLocation} label="In" />
                        <LocationLink loc={r.punchOutLocation} label="Out" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Overtime Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base">My Overtime Requests</h3>
          <Link
            to="/overtime/request"
            className="text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition font-medium"
          >
            + Request
          </Link>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[360px] px-4 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">Hrs</th>
                  <th className="pb-2 pr-3 font-medium">Reason</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {overtime.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400 text-sm">No overtime requests.</td>
                  </tr>
                ) : overtime.map((o) => (
                  <tr key={o._id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition">
                    <td className="py-2.5 pr-3 dark:text-gray-200">{o.date}</td>
                    <td className="py-2.5 pr-3 dark:text-gray-200">{o.hours}h</td>
                    <td className="py-2.5 pr-3 max-w-[140px] sm:max-w-[200px] truncate text-gray-600 dark:text-gray-300">{o.reason}</td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

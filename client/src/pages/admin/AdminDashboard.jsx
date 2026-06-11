import { useState } from 'react';
import { useGetAllAttendanceQuery } from '../../features/attendance/attendanceApi';
import { useGetAllOvertimeQuery } from '../../features/overtime/overtimeApi';
import StatusBadge from '../../components/StatusBadge';
import VerifyModal from '../../components/VerifyModal';
import { exportToCsv, flattenAttendance, flattenOvertime } from '../../utils/exportCsv';

const buildStatCards = (attendance, overtime) => [
  {
    label: 'Total Records',
    value: attendance.length,
    icon: '📋',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-100 dark:border-blue-800',
  },
  {
    label: 'Completed',
    value: attendance.filter((r) => r.status === 'Completed').length,
    icon: '✅',
    bg: 'bg-green-50 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-100 dark:border-green-800',
  },
  {
    label: 'Incomplete',
    value: attendance.filter((r) => r.status === 'Incomplete').length,
    icon: '⏳',
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-100 dark:border-yellow-800',
  },
  {
    label: 'Pending OT',
    value: overtime.filter((o) => o.status === 'Pending').length,
    icon: '🕐',
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-100 dark:border-red-800',
  },
];

export default function AdminDashboard() {
  const { data: attendance = [], isLoading: loadingAtt } = useGetAllAttendanceQuery();
  const { data: overtime = [] } = useGetAllOvertimeQuery();
  const [selectedId, setSelectedId] = useState(null);

  const statCards = buildStatCards(attendance, overtime);

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8 space-y-5 max-w-7xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold dark:text-white">Admin Dashboard</h2>

      {/* Stat Cards — 2 cols on mobile, 4 on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border ${s.border} rounded-2xl p-3 sm:p-4 text-center shadow-sm`}
          >
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <p className={`text-2xl sm:text-3xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
        {/* Table header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base">
            All Attendance Records
          </h3>
          {/* Export buttons — stack on mobile, row on sm+ */}
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => exportToCsv('attendance_report.csv', flattenAttendance(attendance))}
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
            >
              ⬇ Export Attendance
            </button>
            <button
              onClick={() => exportToCsv('overtime_report.csv', flattenOvertime(overtime))}
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
            >
              ⬇ Export Overtime
            </button>
          </div>
        </div>

        {loadingAtt ? (
          <div className="py-10 text-center text-gray-400">Loading...</div>
        ) : attendance.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">No attendance records found.</div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[820px] px-4 sm:px-0">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <th className="pb-2 pr-3 font-medium">Employee</th>
                    <th className="pb-2 pr-3 font-medium">Dept</th>
                    <th className="pb-2 pr-3 font-medium">Date</th>
                    <th className="pb-2 pr-3 font-medium">In</th>
                    <th className="pb-2 pr-3 font-medium">Out</th>
                    <th className="pb-2 pr-3 font-medium">Hrs</th>
                    <th className="pb-2 pr-3 font-medium">Status</th>
                    <th className="pb-2 pr-3 font-medium">Validation</th>
                    <th className="pb-2 pr-3 font-medium">Location</th>
                    <th className="pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                    >
                      <td className="py-2.5 pr-3 font-medium dark:text-gray-200 whitespace-nowrap">{r.user?.name}</td>
                      <td className="py-2.5 pr-3 text-gray-500 dark:text-gray-400">{r.user?.department || '—'}</td>
                      <td className="py-2.5 pr-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.date}</td>
                      <td className="py-2.5 pr-3 whitespace-nowrap dark:text-gray-200">
                        {r.punchIn ? new Date(r.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="py-2.5 pr-3 whitespace-nowrap dark:text-gray-200">
                        {r.punchOut ? new Date(r.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="py-2.5 pr-3 font-semibold dark:text-white">{r.totalHours}h</td>
                      <td className="py-2.5 pr-3"><StatusBadge status={r.status} /></td>
                      <td className="py-2.5 pr-3"><StatusBadge status={r.validationStatus} /></td>
                      <td className="py-2.5 pr-3">
                        {r.punchInLocation?.latitude ? (
                          <a
                            href={`https://www.google.com/maps?q=${r.punchInLocation.latitude},${r.punchInLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-xs whitespace-nowrap"
                          >
                            Maps ↗
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setSelectedId(r._id)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedId && <VerifyModal recordId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

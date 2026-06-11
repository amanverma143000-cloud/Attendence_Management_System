import { useState } from 'react';
import { useGetAllAttendanceQuery } from '../../features/attendance/attendanceApi';
import { useGetAllOvertimeQuery, useReviewOvertimeMutation } from '../../features/overtime/overtimeApi';
import StatusBadge from '../../components/StatusBadge';
import VerifyModal from '../../components/VerifyModal';
import { exportToCsv, flattenAttendance, flattenOvertime } from '../../utils/exportCsv';

function AttendancePanel() {
  const { data: records = [], isLoading } = useGetAllAttendanceQuery();
  const [selectedId, setSelectedId] = useState(null);
  const pendingCount = records.filter((r) => r.validationStatus === 'Pending').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
      {/* Panel header */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base">
            Attendance Records
          </h3>
          {pendingCount > 0 && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full font-medium">
              {pendingCount} pending
            </span>
          )}
        </div>
        <button
          onClick={() => exportToCsv('attendance.csv', flattenAttendance(records))}
          className="shrink-0 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition font-medium"
        >
          ⬇ Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-400">Loading...</div>
      ) : records.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">No attendance records found.</div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[520px] px-4 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-2 pr-3 font-medium">Employee</th>
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">Hrs</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">Validation</th>
                  <th className="pb-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                  >
                    <td className="py-2.5 pr-3 font-medium dark:text-gray-200">{r.user?.name}</td>
                    <td className="py-2.5 pr-3 text-gray-500 dark:text-gray-400">{r.date}</td>
                    <td className="py-2.5 pr-3 dark:text-gray-200">{r.totalHours}h</td>
                    <td className="py-2.5 pr-3"><StatusBadge status={r.status} /></td>
                    <td className="py-2.5 pr-3"><StatusBadge status={r.validationStatus} /></td>
                    <td className="py-2.5">
                      <button
                        onClick={() => setSelectedId(r._id)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition font-medium"
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

      {selectedId && <VerifyModal recordId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

function OvertimePanel() {
  const { data: records = [], isLoading } = useGetAllOvertimeQuery();
  const [review] = useReviewOvertimeMutation();
  const [remarks, setRemarks] = useState({});

  const handleReview = (id, status) =>
    review({ id, status, reviewRemarks: remarks[id] || '' });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base">
          Overtime Requests
        </h3>
        <button
          onClick={() => exportToCsv('overtime.csv', flattenOvertime(records))}
          className="shrink-0 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition font-medium"
        >
          ⬇ Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-400">Loading...</div>
      ) : records.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">No overtime requests found.</div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[620px] px-4 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-2 pr-3 font-medium">Employee</th>
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">Hrs</th>
                  <th className="pb-2 pr-3 font-medium">Reason</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">Remarks</th>
                  <th className="pb-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((o) => (
                  <tr
                    key={o._id}
                    className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                  >
                    <td className="py-2.5 pr-3 font-medium dark:text-gray-200">{o.user?.name}</td>
                    <td className="py-2.5 pr-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{o.date}</td>
                    <td className="py-2.5 pr-3 dark:text-gray-200">{o.hours}h</td>
                    <td className="py-2.5 pr-3 max-w-[120px] truncate text-gray-600 dark:text-gray-300">{o.reason}</td>
                    <td className="py-2.5 pr-3"><StatusBadge status={o.status} /></td>
                    <td className="py-2.5 pr-3">
                      <input
                        className="border dark:border-gray-600 rounded-lg px-2 py-1 text-xs w-24 sm:w-28 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-400 dark:text-gray-200"
                        placeholder="Remarks"
                        value={remarks[o._id] || ''}
                        onChange={(e) => setRemarks({ ...remarks, [o._id]: e.target.value })}
                      />
                    </td>
                    <td className="py-2.5">
                      {o.status === 'Pending' ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleReview(o._id, 'Approved')}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleReview(o._id, 'Rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1.5 rounded-lg transition font-medium whitespace-nowrap"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <StatusBadge status={o.status} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManagerDashboard() {
  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8 space-y-5 max-w-7xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold dark:text-white">Manager Panel</h2>
      <AttendancePanel />
      <OvertimePanel />
    </div>
  );
}

import { useState } from 'react';
import { useGetAttendanceByIdQuery, useValidateAttendanceMutation } from '../features/attendance/attendanceApi';
import StatusBadge from './StatusBadge';

export default function VerifyModal({ recordId, onClose }) {
  const { data: record, isLoading } = useGetAttendanceByIdQuery(recordId);
  const [validate, { isLoading: saving }] = useValidateAttendanceMutation();
  const [remarks, setRemarks] = useState('');
  const [activeImage, setActiveImage] = useState('in');

  const handleValidate = async (status) => {
    await validate({ id: recordId, validationStatus: status, remarks }).unwrap();
    onClose();
  };

  const mapsLink = (loc) =>
    loc?.latitude ? `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      {/* Sheet on mobile (bottom sheet), centered modal on sm+ */}
      <div className="bg-white dark:bg-gray-800 w-full sm:rounded-2xl sm:max-w-lg rounded-t-2xl shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[90vh]">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 border-b dark:border-gray-700">
          <h3 className="font-semibold text-base sm:text-lg dark:text-white">Verify Attendance</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            &times;
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <div className="text-3xl mb-2">⏳</div>
            Loading...
          </div>
        ) : record ? (
          <div className="px-4 sm:px-5 py-4 space-y-4">

            {/* Employee Info */}
            <div className="flex flex-col xs:flex-row justify-between gap-2 text-sm">
              <div>
                <p className="font-semibold text-base dark:text-white">{record.user?.name}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{record.user?.email}</p>
                {record.user?.department && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{record.user?.department}</p>
                )}
              </div>
              <div className="flex flex-row xs:flex-col gap-2 xs:items-end">
                <p className="text-gray-500 dark:text-gray-400 text-xs">{record.date}</p>
                <StatusBadge status={record.status} />
                <StatusBadge status={record.validationStatus} />
              </div>
            </div>

            {/* Times & Hours */}
            <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3">
              {[
                { label: 'Punch In', val: record.punchIn ? new Date(record.punchIn).toLocaleTimeString() : '—' },
                { label: 'Punch Out', val: record.punchOut ? new Date(record.punchOut).toLocaleTimeString() : '—' },
                { label: 'Total Hours', val: `${record.totalHours}h`, bold: true },
              ].map(({ label, val, bold }) => (
                <div key={label}>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">{label}</p>
                  <p className={bold ? 'font-bold text-base dark:text-white' : 'dark:text-gray-200'}>{val}</p>
                </div>
              ))}
            </div>

            {/* Selfie Viewer */}
            <div>
              <div className="flex gap-2 mb-3">
                {['in', 'out'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveImage(type)}
                    className={`flex-1 text-xs py-1.5 rounded-full border transition font-medium ${
                      activeImage === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Punch-{type === 'in' ? 'In' : 'Out'} Selfie
                  </button>
                ))}
              </div>
              {activeImage === 'in' && record.punchInImage ? (
                <img src={record.punchInImage} alt="Punch-in selfie" className="w-full rounded-xl object-cover max-h-56 sm:max-h-64" />
              ) : activeImage === 'out' && record.punchOutImage ? (
                <img src={record.punchOutImage} alt="Punch-out selfie" className="w-full rounded-xl object-cover max-h-56 sm:max-h-64" />
              ) : (
                <div className="w-full h-28 sm:h-36 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                  No selfie available
                </div>
              )}
            </div>

            {/* Location Links */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Punch-In Location', loc: record.punchInLocation },
                { label: 'Punch-Out Location', loc: record.punchOutLocation },
              ].map(({ label, loc }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3">
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
                  {loc?.latitude ? (
                    <>
                      <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                      </p>
                      <a
                        href={mapsLink(loc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mt-1 inline-block"
                      >
                        View on Maps ↗
                      </a>
                    </>
                  ) : (
                    <p className="text-gray-400">Not available</p>
                  )}
                </div>
              ))}
            </div>

            {/* Remarks */}
            <textarea
              className="w-full border dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-20 dark:text-gray-200 placeholder-gray-400"
              placeholder="Add remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            {/* Action Buttons */}
            <div className="space-y-2 pb-2">
              {record.validationStatus !== 'Pending' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Previously marked as <StatusBadge status={record.validationStatus} /> — you can re-review below.
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => handleValidate('Valid')}
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition"
                >
                  ✓ Mark Valid
                </button>
                <button
                  onClick={() => handleValidate('Invalid')}
                  disabled={saving}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition"
                >
                  ✗ Mark Invalid
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="p-8 text-center text-red-500">Failed to load record.</p>
        )}
      </div>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from '../../components/CameraCapture';
import {
  usePunchInMutation,
  usePunchOutMutation,
  useGetTodayAttendanceQuery,
} from '../../features/attendance/attendanceApi';

export default function CameraPage() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const { data: today } = useGetTodayAttendanceQuery();
  const [punchIn, { isLoading: punchingIn }] = usePunchInMutation();
  const [punchOut, { isLoading: punchingOut }] = usePunchOutMutation();

  const getLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
        () => resolve(null),
        { timeout: 8000 }
      );
    });

  const handlePunch = async (type) => {
    if (!image) return setMessage({ text: 'Please capture a selfie first.', type: 'error' });
    setMessage({ text: 'Fetching location...', type: '' });
    const location = await getLocation();
    setMessage({ text: 'Saving...', type: '' });
    try {
      const fn = type === 'in' ? punchIn : punchOut;
      await fn({ image, location }).unwrap();
      setMessage({ text: `Punch ${type === 'in' ? 'In' : 'Out'} successful! ✓`, type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({ text: err.data?.message || 'Punch failed. Please try again.', type: 'error' });
    }
  };

  const hasPunchedIn = !!today?.punchIn;
  const hasPunchedOut = !!today?.punchOut;
  const onCapture = useCallback((img) => setImage(img), []);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md flex flex-col items-center gap-5 p-5 sm:p-8">

        {/* Title */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold dark:text-white">
            {hasPunchedOut ? '✅ Attendance Complete' : hasPunchedIn ? 'Punch Out' : 'Punch In'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date().toDateString()}</p>
        </div>

        {hasPunchedOut ? (
          <div className="text-center space-y-3 py-4">
            <div className="text-5xl">🎉</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You have already completed attendance for today.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg transition"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Camera */}
            <div className="w-full">
              <CameraCapture onCapture={onCapture} />
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`w-full text-sm text-center px-3 py-2.5 rounded-xl ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : message.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Punch buttons */}
            <div className="w-full">
              {!hasPunchedIn && (
                <button
                  onClick={() => handlePunch('in')}
                  disabled={punchingIn || !image}
                  className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition text-sm sm:text-base"
                >
                  {punchingIn ? 'Saving...' : '✓ Punch In'}
                </button>
              )}
              {hasPunchedIn && !hasPunchedOut && (
                <button
                  onClick={() => handlePunch('out')}
                  disabled={punchingOut || !image}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition text-sm sm:text-base"
                >
                  {punchingOut ? 'Saving...' : '✗ Punch Out'}
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
              📍 Location is captured automatically.<br className="hidden xs:block" />
              Allow browser location access for accuracy.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

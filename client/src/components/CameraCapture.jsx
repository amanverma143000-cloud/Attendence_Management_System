import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

export default function CameraCapture({ onCapture }) {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
    onCapture(screenshot);
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {!image ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-xl w-full max-w-sm aspect-video object-cover border-2 border-gray-200 dark:border-gray-600"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button
            type="button"
            onClick={capture}
            className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition font-medium"
          >
            📸 Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img
            src={image}
            alt="Captured selfie"
            className="rounded-xl w-full max-w-sm aspect-video object-cover border-2 border-green-400"
          />
          <div className="flex gap-3 w-full max-w-sm">
            <div className="flex-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs text-center py-2 rounded-lg font-medium">
              ✓ Selfie captured
            </div>
            <button
              type="button"
              onClick={() => { setImage(null); onCapture(null); }}
              className="px-4 py-2 text-sm text-red-500 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              Retake
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import { useRef, useState, useEffect } from "react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSelfie: (selfieUrl: string) => void;
}

const CameraModal = ({ isOpen, onClose, onConfirmSelfie  }: CameraModalProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selfieTaken, setSelfieTaken] = useState<string | null>(null);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); 
      setStream(null);
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      if (isOpen) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setStream(mediaStream);

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (error) {
          setErrorMessage("Error accessing the camera. Please allow camera permissions.");
          console.error("Error accessing camera:", error);
        }
      }
    };

    if (isOpen) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleTakeSelfie = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {

        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        const selfieUrl = canvasRef.current.toDataURL("image/png");

        onConfirmSelfie(selfieUrl);

        setSelfieTaken(selfieUrl);
      }
    }
    stopCamera();
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg relative w-11/12 max-w-lg">
      <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute mt-4 mr-3 top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mt-3  mb-4">Show us it's really you</h2>

        {errorMessage ? (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="mt-8 w-full h-auto rounded-md" />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </>
        )}

        <div className="mt-4 text-center">
          <button
            className="px-12 py-2 text-white bg-blue-600 rounded-3xl shadow hover:bg-blue-700"
            onClick={(e) => {
              e.preventDefault();
              handleTakeSelfie();
            }}
          >
            Take Selfie
          </button>

          {selfieTaken && (
            <div className="mt-4">
              <p className="text-center font-bold">Selfie Taken:</p>
              <img src={selfieTaken} alt="Selfie" className="w-full h-auto rounded-md" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;

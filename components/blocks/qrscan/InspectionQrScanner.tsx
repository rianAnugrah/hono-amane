import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import {
  CameraIcon,
  SwitchCamera,
  RefreshCcw,
  Power,
  PowerOff,
  Upload,
  X,
} from "lucide-react";

interface Camera {
  id: string;
  label: string;
}

interface InspectionQrScannerProps {
  onScan: (assetNumber: string) => void;
}

const InspectionQrScanner = ({ onScan }: InspectionQrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [result, setResult] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [permissionState, setPermissionState] = useState("prompt");
  const [switchingCamera, setSwitchingCamera] = useState(false);
  const [autoStartCamera, setAutoStartCamera] = useState(true);

  useEffect(() => {
    if (autoStartCamera) {
      const timer = setTimeout(() => {
        loadCameras();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [autoStartCamera]);

  // Handle result changes
  useEffect(() => {
    if (result) {
      // When we have a scan result, pass it to the parent component
      onScan(result);
    }
  }, [result, onScan]);

  const loadCameras = async () => {
    try {
      setIsLoading(true);
      setError("");
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Browser does not support camera access.");
        setIsLoading(false);
        return;
      }

      await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      const availableCameras = await QrScanner.listCameras(true);
      console.log("Available cameras:", availableCameras);
      
      if (availableCameras.length === 0) {
        setError("No cameras detected.");
        setPermissionState("granted");
        setIsLoading(false);
        return;
      }
      
      setCameras(availableCameras);
      setPermissionState("granted");
      
      setTimeout(() => {
        startCameraWithIndex(0);
      }, 800);
    } catch (err) {
      handleCameraError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraError = (err: any) => {
    console.error("Camera error:", err);
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      setError("Camera access denied.");
      setPermissionState("denied");
    } else if (err.name === "NotFoundError") {
      setError("No camera found.");
    } else if (err.name === "NotReadableError") {
      setError("Camera is in use by another application.");
    } else if (err.name === "AbortError") {
      setError("Camera operation aborted.");
    } else if (err.name === "OverconstrainedError") {
      setError("Camera does not meet the requested constraints.");
    } else {
      setError(`Failed to load camera: ${err.message}`);
    }
    setCameraOn(false);
    setSwitchingCamera(false);
  };

  const requestCameraPermission = async () => {
    try {
      setError("");
      setIsLoading(true);
      await navigator.mediaDevices.getUserMedia({ video: true });
      await loadCameras();
    } catch (err) {
      handleCameraError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startCameraWithIndex = async (index: number) => {
    if (!videoRef.current || cameras.length === 0) {
      setError("Video reference not available or no cameras found.");
      return;
    }

    if (switchingCamera) {
      console.log("Camera switching in progress, ignoring request");
      return;
    }

    try {
      setIsLoading(true);
      setSwitchingCamera(true);
      
      if (scanner) {
        await stopCameraInternal();
      }

      const safeIndex = index % cameras.length;
      const selectedCamera = cameras[safeIndex];
      console.log(`Starting camera: ${selectedCamera.label} (${selectedCamera.id})`);

      const qrScanner = new QrScanner(
        videoRef.current,
        (res) => {
          setResult(res.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
          preferredCamera: selectedCamera.id,
        }
      );

      try {
        await qrScanner.setCamera(selectedCamera.id);
        await qrScanner.start();
        console.log("Camera started successfully");
        
        setScanner(qrScanner);
        setCameraOn(true);
        setCurrentCameraIndex(safeIndex);
        setError("");
      } catch (cameraErr) {
        console.error("Failed to start specific camera, trying default", cameraErr);
        
        try {
          await qrScanner.start();
          setScanner(qrScanner);
          setCameraOn(true);
          setError("");
        } catch (defaultErr) {
          qrScanner.destroy();
          throw defaultErr;
        }
      }
    } catch (err) {
      handleCameraError(err);
    } finally {
      setIsLoading(false);
      setSwitchingCamera(false);
    }
  };

  const stopCameraInternal = async () => {
    if (scanner) {
      try {
        scanner.stop();
        
        // Give browser time to release camera resources
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setScanner(null);
      } catch (err) {
        console.error("Error stopping camera:", err);
      }
    }
  };

  const stopCamera = async () => {
    setIsLoading(true);
    await stopCameraInternal();
    setCameraOn(false);
    setIsLoading(false);
  };

  const switchCamera = async () => {
    if (cameras.length <= 1) {
      return setError("Only one camera available.");
    }
    
    if (switchingCamera || isLoading) {
      console.log("Operation in progress, ignoring switch request");
      return;
    }
    
    setSwitchingCamera(true);
    setIsLoading(true);
    
    try {
      await stopCameraInternal();
      
      const nextIndex = (currentCameraIndex + 1) % cameras.length;
      console.log(`Switching to camera index: ${nextIndex}`);
      
      setTimeout(() => {
        startCameraWithIndex(nextIndex);
      }, 500);
    } catch (err) {
      handleCameraError(err);
    }
  };

  const refreshCameras = async () => {
    try {
      setIsLoading(true);
      
      if (scanner) {
        await stopCameraInternal();
        setCameraOn(false);
      }
      
      const availableCameras = await QrScanner.listCameras(true);
      console.log("Refreshed cameras:", availableCameras);
      setCameras(availableCameras);
      
      if (availableCameras.length === 0) {
        setError("No cameras after refresh.");
      } else {
        setError("");
        setTimeout(() => {
          startCameraWithIndex(0);
        }, 500);
      }
    } catch (err: any) {
      setError("Failed to refresh cameras: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    QrScanner.scanImage(file)
      .then((res) => setResult(res))
      .catch(() => setError("Failed to scan QR code from file."));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop();
        setScanner(null);
      }
    };
  }, [scanner]);

  return (
    <div className="w-full">
      <div className="relative w-full max-w-sm mx-auto border-2 border-gray-300 rounded-xl overflow-hidden">
        <video ref={videoRef} className="w-full h-64 object-cover" />
        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white p-4">
            {isLoading ? <p>Starting Camera...</p> : <p>Press Enable Camera</p>}
          </div>
        )}
        {error && (
          <div className="absolute bottom-0 left-0 w-full p-2">
            <p className="text-red-600 text-center bg-red-100 border border-red-600 rounded text-xs">
              {error}
            </p>
          </div>
        )}
      </div>

      <CameraButtons
        cameras={cameras}
        currentCameraIndex={currentCameraIndex}
        startCameraWithIndex={startCameraWithIndex}
        stopCamera={stopCamera}
        isLoading={isLoading || switchingCamera}
      />

      <ControlPanel
        switchCamera={switchCamera}
        refreshCameras={refreshCameras}
        startCamera={startCameraWithIndex}
        stopCamera={stopCamera}
        requestCameraPermission={requestCameraPermission}
        cameraOn={cameraOn}
        isLoading={isLoading || switchingCamera}
        permissionState={permissionState}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
      />

      {/* Display the current scan result (asset number) */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="flex flex-row w-full gap-2 items-center">
          <input
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="border rounded h-[2rem] px-2 text-sm text-gray-800 flex-grow"
            placeholder="Asset number will appear here when scanned"
          />
          <button
            onClick={() => {
              setResult("");
            }}
            className="bg-red-600 text-white h-[2rem] px-3 rounded hover:bg-red-500 flex items-center gap-1 text-xs"
          >
            <X className="w-auto h-3" />
            <p>Clear</p>
          </button>
        </div>
        
        {result && (
          <button 
            onClick={() => onScan(result)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-2"
          >
            Use This Asset Number
          </button>
        )}
      </div>
    </div>
  );
};

// === Reusable UI Components ===

const CameraButtons = ({
  cameras,
  currentCameraIndex,
  startCameraWithIndex,
  stopCamera,
  isLoading,
}: {
  cameras: Camera[];
  currentCameraIndex: number;
  startCameraWithIndex: (index: number) => void;
  stopCamera: () => void;
  isLoading: boolean;
}) => {
  if (cameras.length === 0)
    return <p className="text-sm text-gray-500 mb-4 text-center">No Camera Detected</p>;

  return (
    <div className="flex justify-center mb-4 gap-2 mt-4">
      {cameras.map((_, index) => (
        <button
          key={index}
          onClick={() => {
            stopCamera();
            setTimeout(() => startCameraWithIndex(index), 300);
          }}
          className={`p-1 rounded-md relative ${
            currentCameraIndex === index
              ? "bg-blue-100 border border-blue-500"
              : "bg-gray-100 border hover:bg-gray-200 text-gray-300 border-gray-300"
          }`}
          disabled={isLoading || currentCameraIndex === index}
        >
          <CameraIcon className="w-10 h-10" />
          <p
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-xs text-white font-bold rounded-full flex items-center justify-center ${
              currentCameraIndex === index ? "bg-blue-600" : "bg-gray-500"
            }`}
          >
            {index}
          </p>
        </button>
      ))}
    </div>
  );
};

const ControlPanel = ({
  switchCamera,
  refreshCameras,
  startCamera,
  stopCamera,
  requestCameraPermission,
  cameraOn,
  isLoading,
  permissionState,
  fileInputRef,
  handleFileUpload,
}: any) => (
  <div className="flex items-center justify-center divide-x divide-gray-300 mb-4">
    <ButtonComponent
      onClick={switchCamera}
      icon={<SwitchCamera />}
      label="Switch"
      disabled={isLoading}
      color="blue"
    />
    <ButtonComponent
      onClick={refreshCameras}
      icon={isLoading ? <RefreshCcw className="animate-spin" /> : <RefreshCcw />}
      label={isLoading ? "Loading..." : "Refresh"}
      disabled={isLoading}
      color="gray"
    />
    {!cameraOn ? (
      <ButtonComponent
        onClick={permissionState === "denied" ? requestCameraPermission : () => startCamera(0)}
        icon={isLoading ? <RefreshCcw className="animate-spin" /> : <Power />}
        label={isLoading ? "Loading..." : "Enable"}
        disabled={isLoading}
        color="red"
      />
    ) : (
      <ButtonComponent
        onClick={stopCamera}
        icon={<PowerOff />}
        label="Stop"
        disabled={isLoading}
        color="red"
      />
    )}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleFileUpload}
      className="hidden"
    />
    <ButtonComponent
      onClick={() => fileInputRef.current?.click()}
      icon={<Upload />}
      label="Upload"
      color="green"
    />
  </div>
);

const ButtonComponent = ({
  onClick,
  icon,
  label,
  disabled = false,
  className = "",
  color = "gray",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
  color?: "gray" | "red" | "green" | "blue";
}) => {
  const colorClasses = {
    gray: "border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-600",
    red: "border-gray-400 bg-red-100 hover:bg-red-200 text-red-600",
    green: "border-gray-400 bg-green-100 hover:bg-green-200 text-green-600",
    blue: "border-gray-400 bg-blue-100 hover:bg-blue-200 text-blue-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer border-y last:border-r first:border-l first:rounded-l-lg last:rounded-r-lg flex flex-col md:flex-row w-[6rem] md:w-auto px-4 transition disabled:bg-gray-200 disabled:text-gray-500 h-auto md:h-[2rem] items-center gap-2 justify-start py-2 ${colorClasses[color]} ${className}`}
    >
      <div className="w-8 md:w-4 h-8 md:h-4 flex items-center justify-center">{icon}</div>
      <p className="text-xs">{label}</p>
    </button>
  );
};

export default InspectionQrScanner; 
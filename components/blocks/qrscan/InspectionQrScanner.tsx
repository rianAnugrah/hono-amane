import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { motion, AnimatePresence } from "framer-motion";
import {
  CameraIcon,
  SwitchCamera,
  RefreshCcw,
  Power,
  PowerOff,
  Upload,
  X,
  Check,
  Camera,
  AlertCircle,
  Info
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
  const [scanSuccess, setScanSuccess] = useState(false);

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
      // Show success animation
      setScanSuccess(true);
      // Reset success state after 2 seconds
      const timer = setTimeout(() => {
        setScanSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [result]);

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
      //console.log("Available cameras:", availableCameras);
      
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
      //console.log("Camera switching in progress, ignoring request");
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
      //console.log(`Starting camera: ${selectedCamera.label} (${selectedCamera.id})`);

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
        //console.log("Camera started successfully");
        
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
      //console.log("Operation in progress, ignoring switch request");
      return;
    }
    
    setSwitchingCamera(true);
    setIsLoading(true);
    
    try {
      await stopCameraInternal();
      
      const nextIndex = (currentCameraIndex + 1) % cameras.length;
      //console.log(`Switching to camera index: ${nextIndex}`);
      
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
      //console.log("Refreshed cameras:", availableCameras);
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
      .then((res) => {
        setResult(res);
        setScanSuccess(true);
        setTimeout(() => setScanSuccess(false), 2000);
      })
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

  const submitResult = () => {
    if (result) {
      onScan(result);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Camera Viewport */}
      <div className="relative w-full bg-black rounded-t-xl overflow-hidden">
        <motion.div
          className="aspect-[4/3] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: cameraOn ? 1 : 0.7 }}
          transition={{ duration: 0.5 }}
        >
          <video ref={videoRef} className="w-full h-full object-cover" />
          
          {/* Scan Area Overlay */}
          {cameraOn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-3/4 aspect-square">
                {/* Scanning Animation */}
                <motion.div
                  className="absolute left-0 right-0 h-px bg-blue-500 z-10"
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ boxShadow: "0 0 4px 1px rgba(59, 130, 246, 0.7)" }}
                />
                
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 rounded-tl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500 rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500 rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 rounded-br"></div>
                
                {/* Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-70"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Success Animation */}
          <AnimatePresence>
            {scanSuccess && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="bg-green-500 rounded-full p-3"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check size={40} className="text-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Camera States Overlay */}
          {!cameraOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 text-white gap-4">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCcw size={40} className="text-blue-400" />
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 p-4 rounded-full cursor-pointer"
                  onClick={permissionState === "denied" ? requestCameraPermission : () => startCameraWithIndex(0)}
                >
                  <Camera size={32} className="text-white" />
                </motion.div>
              )}
              <p className="text-center px-8">
                {isLoading 
                  ? "Starting camera..." 
                  : permissionState === "denied"
                    ? "Camera access was denied. Click to request again."
                    : "Press to enable camera"}
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-red-500 text-white px-4 py-2 shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera Controls */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Camera Controls</h3>
        
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {cameras.length > 0 && (
            <motion.div 
              className="flex justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {cameras.map((camera, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    if (currentCameraIndex !== index) {
                      stopCamera();
                      setTimeout(() => startCameraWithIndex(index), 300);
                    }
                  }}
                  className={`relative p-2 rounded-lg flex items-center justify-center ${
                    currentCameraIndex === index
                      ? "bg-blue-100 ring-2 ring-blue-400 text-blue-600"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  disabled={isLoading || currentCameraIndex === index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CameraIcon className="w-5 h-5" />
                  <span className="ml-1 text-xs">{index + 1}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <motion.button
            onClick={!cameraOn 
              ? (permissionState === "denied" ? requestCameraPermission : () => startCameraWithIndex(0))
              : stopCamera
            }
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg shadow-sm text-sm font-medium ${
              !cameraOn 
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : !cameraOn ? (
              <Power className="w-4 h-4" />
            ) : (
              <PowerOff className="w-4 h-4" />
            )}
            <span>{isLoading ? "Loading..." : !cameraOn ? "Start Camera" : "Stop Camera"}</span>
          </motion.button>
          
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </motion.button>
          
          <motion.button
            onClick={switchCamera}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm text-sm font-medium"
            disabled={isLoading || cameras.length <= 1}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SwitchCamera className="w-4 h-4" />
            <span>Switch Camera</span>
          </motion.button>
          
          <motion.button
            onClick={refreshCameras}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm text-sm font-medium"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Cameras</span>
          </motion.button>
        </div>
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Scan Result Section */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Scan Result</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <motion.input
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Asset number will appear here..."
            initial={{ scale: 1 }}
            animate={{ scale: scanSuccess ? [1, 1.03, 1] : 1 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.button
            onClick={() => setResult("")}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!result}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
        
        {result ? (
          <motion.button
            onClick={submitResult}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="w-5 h-5" />
            <span>Use Asset Number</span>
          </motion.button>
        ) : (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm flex items-start gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p>Scan a QR code or upload an image containing a QR code to get an asset number.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default InspectionQrScanner; 
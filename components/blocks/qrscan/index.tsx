import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import {
  Ban,
  CameraIcon,
  Power,
  PowerOff,
  RefreshCcw,
  StopCircle,
  SwitchCamera,
  Upload,
} from "lucide-react";

const QrScannerComponent = () => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [result, setResult] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [permissionState, setPermissionState] = useState("prompt");

  // Auto-start camera after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCameras();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load cameras and handle permissions
  const loadCameras = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          "Browser Anda tidak mendukung akses kamera. Silakan gunakan browser modern."
        );
        setIsLoading(false);
        return;
      }

      console.log("Requesting camera permission...");
      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Permission granted, listing cameras...");

      // List available cameras
      const availableCameras = await QrScanner.listCameras(true);
      console.log("Available cameras:", availableCameras);

      if (availableCameras.length === 0) {
        setError(
          "Tidak ada kamera yang terdeteksi. Pastikan perangkat Anda memiliki kamera dan izinkan akses kamera."
        );
        setPermissionState("granted"); // Assume permission was granted, but no cameras found
        setIsLoading(false);
        return;
      }

      setCameras(availableCameras);
      setPermissionState("granted");

      // Auto-start the first camera
      console.log("Auto-starting first camera...");
      setTimeout(() => {
        startCameraWithIndex(0);
      }, 500);
    } catch (err) {
      console.error("Failed to load cameras:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(
          "Akses kamera ditolak. Silakan izinkan kamera di pengaturan browser Anda."
        );
        setPermissionState("denied");
      } else if (err.name === "NotFoundError") {
        setError("Tidak ada kamera yang ditemukan pada perangkat Anda.");
      } else if (err.name === "NotReadableError") {
        setError(
          "Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi lain yang menggunakan kamera."
        );
      } else {
        setError(`Gagal memuat kamera: ${err.message}`);
      }
      setIsLoading(false);
    }
  };

  // Request camera permission explicitly
  const requestCameraPermission = async () => {
    try {
      setError("");
      setIsLoading(true);
      await navigator.mediaDevices.getUserMedia({ video: true });
      await loadCameras();
    } catch (err) {
      console.error("Camera permission request failed:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(
          "Akses kamera ditolak. Silakan izinkan kamera di pengaturan browser Anda."
        );
        setPermissionState("denied");
      } else {
        setError(`Gagal meminta izin kamera: ${err.message}`);
      }
      setIsLoading(false);
    }
  };

  // Start camera with specific index
  const startCameraWithIndex = async (index) => {
    if (videoRef.current && cameras.length > 0) {
      try {
        setIsLoading(true);
        setError("");

        // Stop any existing scanner
        if (scanner) {
          scanner.stop();
          setScanner(null);
        }

        // Validate index
        if (index >= cameras.length) {
          index = 0;
        }
        setCurrentCameraIndex(index);

        const selectedCamera = cameras[index];
        console.log(
          `Starting camera: ${selectedCamera.label} (${selectedCamera.id})`
        );

        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            console.log("QR code detected:", result.data);
            setResult(result.data);
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            returnDetailedScanResult: true,
          }
        );

        // Set the selected camera explicitly
        await qrScanner.setCamera(selectedCamera.id);
        await qrScanner.start();

        console.log("Camera activated successfully");
        setScanner(qrScanner);
        setCameraOn(true);
      } catch (err) {
        console.error("Failed to start camera:", err);
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          setError(
            "Akses kamera ditolak. Silakan izinkan kamera di pengaturan browser Anda."
          );
          setPermissionState("denied");
        } else {
          setError(`Gagal mengakses kamera: ${err.message}`);
        }
        setCameraOn(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError(
        cameras.length === 0
          ? "Tidak ada kamera yang tersedia"
          : "Video ref tidak tersedia"
      );
      setIsLoading(false);
    }
  };

  // Standard start camera function
  const startCamera = () => {
    stopCamera();
    setTimeout(() => {
      startCameraWithIndex(currentCameraIndex);
    }, 300);
  };

  // Stop camera
  const stopCamera = () => {
    if (scanner) {
      console.log("Stopping camera...");
      scanner.stop();
      setScanner(null);
      setCameraOn(false);
    }
  };

  // Switch camera
  const switchCamera = async () => {
    if (cameras.length <= 1) {
      setError("Hanya satu kamera yang terdeteksi");
      return;
    }

    const nextCameraIndex = (currentCameraIndex + 1) % cameras.length;
    console.log(`Switching to camera index: ${nextCameraIndex}`);

    stopCamera();
    setTimeout(() => {
      startCameraWithIndex(nextCameraIndex);
    }, 300);
  };

  // Refresh camera list
  const refreshCameras = async () => {
    try {
      setIsLoading(true);
      const availableCameras = await QrScanner.listCameras(true);
      console.log("Refreshed cameras:", availableCameras);
      setCameras(availableCameras);
      setError("");
      if (availableCameras.length === 0) {
        setError("Tidak ada kamera yang terdeteksi setelah penyegaran.");
      }
    } catch (err) {
      console.error("Failed to refresh cameras:", err);
      setError("Gagal memperbarui daftar kamera: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setError("");
      QrScanner.scanImage(file)
        .then((result) => setResult(result))
        .catch((err) => {
          console.error("File scan failed:", err);
          setError("Gagal memindai QR code dari file.");
        });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop();
      }
    };
  }, [scanner]);

  return (
    <div className="max-w-lg mx-auto p-6">
      {/* <h2 className="text-2xl font-bold text-center mb-6">QR Code Scanner</h2> */}

      <div className="relative w-full max-w-sm mx-auto border-2 border-gray-300 rounded-xl overflow-hidden">
        <video ref={videoRef} className="w-full h-64 object-cover" />
        {!cameraOn && (
          <div className="absolute inset-0 w-full h-64 bg-gray-700 flex items-center justify-center text-white text-center p-4">
            {isLoading ? (
              <p>Starting Camera . . .</p>
            ) : (
              <p>Press Enable Camera to start</p>
            )}
          </div>
        )}

        {error && (
          <div className="absolute bottom-0 left-0  w-full p-2">
            <p className="text-red-600 text-center w-full bg-red-100 border rounded border-red-600">
              {error}
            </p>
          </div>
        )}
      </div>

      <div className="mt-2">
        {/* <h3 className="text-lg font-semibold mb-2 text-center">
          Available Cameras:
        </h3> */}
        {cameras.length > 0 ? (
          <div className="flex w-full justify-center mb-4 gap-2">
            {cameras.map((camera, index) => (
              <button
                key={camera.id}
                onClick={() => {
                  stopCamera();
                  setTimeout(() => {
                    startCameraWithIndex(index);
                  }, 300);
                }}
                className={`p-1 text-sm text-left rounded-md flex items-center justify-center relative ${
                  currentCameraIndex === index
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100 border hover:bg-gray-200"
                }`}
                disabled={isLoading || currentCameraIndex === index}
              >
                <CameraIcon className="w-10 h-10" />
                <p className="absolute top-1/2 left-1/2 -translate-y-1/2 leading-4 -translate-x-1/2 bg-black rounded-full w-4 h-4  text-xs text-center  text-white font-bold">
                  {index}
                </p>

                {/* <div className="font-medium truncate">
                  {camera.label || `Camera ${camera.id.substring(0, 10)}...`}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  ID: {camera.id.substring(0, 15)}...
                </div> */}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4 w-full text-center">
            No Camera Detected
          </p>
        )}
      </div>

      <div className="w-full flex items-center justify-center">
        {cameras.length > 1 && (
          <ButtonComponent
            onClick={switchCamera}
            icon={<SwitchCamera />}
            label="Switch Camera"
            disabled={isLoading}
          />
        )}
        <ButtonComponent
          onClick={refreshCameras}
          icon={isLoading ? <RefreshCcw className="animate-spin" /> : <RefreshCcw />}
          label={isLoading ? "Loading..." : "Refresh Camera"}
          disabled={isLoading}
        />
        {!cameraOn ? (
          <ButtonComponent
            onClick={permissionState === "denied" ? requestCameraPermission : startCamera}
            icon={isLoading ? <RefreshCcw className="animate-spin" /> : <Power />}
            label={isLoading ? "Loading..." : "Enable Camera"}
            disabled={isLoading}
          />
        ) : (
          <ButtonComponent
            onClick={stopCamera}
            icon={<PowerOff />}
            label="Stop Camera"
            disabled={isLoading}
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
          label="Upload QR Image"
          color="green"
        />
      </div>

      {result && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold">Hasil:</h3>
          <p className="text-gray-800 break-all">{result}</p>
          <button
            onClick={() => setResult("")}
            className="border-y last:border-r first:border-l first:rounded-l-lg last:rounded-r-lg flex flex-col w-[5rem] transition disabled:bg-gray-200 disabled:text-gray-500 h-[5rem] items-center gap-2 justify-start py-2"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

interface ButtonComponentProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
}

const ButtonComponent = ({
  onClick,
  icon,
  label,
  disabled = false,
  className = "",
  color = "gray", // Default color
}: ButtonComponentProps & { color?: "gray" | "red" | "green" | "blue" }) => {
  const colorClasses = {
    gray: "hover:bg-gray-100",
    red: "hover:bg-red-100 text-red-600",
    green: "bg-green-700 text-white hover:bg-green-100 text-green-600", 
    blue: "hover:bg-blue-100 text-blue-600"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border-y last:border-r first:border-l first:rounded-l-lg last:rounded-r-lg flex flex-col w-[6rem] px-4 transition disabled:bg-gray-200 disabled:text-gray-500 h-[5rem] items-center gap-2 justify-start py-2 ${colorClasses[color]} ${className}`}
    >
      {icon}
      <p className="text-xs">{label}</p>
    </button>
  );
};

export default QrScannerComponent;

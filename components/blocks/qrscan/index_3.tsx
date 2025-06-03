import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const QrScannerComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [result, setResult] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [permissionState, setPermissionState] = useState<PermissionState>("prompt");

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
        setError("Browser Anda tidak mendukung akses kamera. Silakan gunakan browser modern.");
        setIsLoading(false);
        return;
      }

      //console.log("Requesting camera permission...");
      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      //console.log("Permission granted, listing cameras...");

      // List available cameras
      const availableCameras = await QrScanner.listCameras(true);
      //console.log("Available cameras:", availableCameras);

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
      //console.log("Auto-starting first camera...");
      setTimeout(() => {
        startCameraWithIndex(0);
      }, 500);
    } catch (err) {
      console.error("Failed to list cameras:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setError("Akses kamera ditolak. Silakan izinkan kamera di pengaturan browser Anda.");
        setPermissionState("denied");
      } else if (err instanceof Error && err.name === "NotFoundError") {
        setError("Tidak ada kamera yang terdeteksi pada perangkat Anda.");
      } else {
        setError(`Gagal mengakses kamera: ${errorMessage}`);
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
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setError("Akses kamera ditolak. Silakan izinkan kamera di pengaturan browser Anda.");
        setPermissionState("denied");
      } else {
        setError(`Gagal mengakses kamera: ${errorMessage}`);
      }
      setIsLoading(false);
    }
  };

  // Start camera with specific index
  const startCameraWithIndex = async (index: number) => {
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
        //console.log(`Starting camera: ${selectedCamera.label} (${selectedCamera.id})`);

        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            //console.log("QR code detected:", result.data);
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

        //console.log("Camera activated successfully");
        setScanner(qrScanner);
        setCameraOn(true);
      } catch (err) {
        console.error("Failed to start camera:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
          setError("Akses kamera ditolak. Silakan izinkan kamera di pengaturan browser Anda.");
          setPermissionState("denied");
        } else {
          setError(`Gagal mengakses kamera: ${errorMessage}`);
        }
        setCameraOn(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError(cameras.length === 0 ? "Tidak ada kamera yang tersedia" : "Video ref tidak tersedia");
      setIsLoading(false);
    }
  };

  // Standard start camera function
  const startCamera = () => {
    startCameraWithIndex(currentCameraIndex);
  };

  // Stop camera
  const stopCamera = () => {
    if (scanner) {
      //console.log("Stopping camera...");
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
    //console.log(`Switching to camera index: ${nextCameraIndex}`);

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
      //console.log("Refreshed cameras:", availableCameras);
      setCameras(availableCameras);
      setError("");
      if (availableCameras.length === 0) {
        setError("Tidak ada kamera yang terdeteksi setelah penyegaran.");
      }
    } catch (err) {
      console.error("Failed to refresh cameras:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Gagal memperbarui daftar kamera: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      <h2 className="text-2xl font-bold text-center mb-6">QR Code Scanner</h2>

      <div className="relative w-full max-w-sm mx-auto border-2 border-gray-300 rounded-lg overflow-hidden">
        <video ref={videoRef} className="w-full h-64 object-cover" />
        {!cameraOn && (
          <div className="absolute inset-0 w-full h-64 bg-gray-100 flex items-center justify-center text-gray-600 text-center p-4">
            {isLoading ? (
              <p>Memulai kamera...</p>
            ) : (
              <p>Kamera tidak aktif. Klik tombol untuk memulai.</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-center">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Kamera Tersedia:</h3>
        {cameras.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {cameras.map((camera, index) => (
              <button
                key={camera.id}
                onClick={() => startCameraWithIndex(index)}
                className={`p-2 text-sm text-left rounded-md ${
                  currentCameraIndex === index
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                disabled={isLoading || currentCameraIndex === index}
              >
                <div className="font-medium truncate">
                  {camera.label || `Camera ${camera.id.substring(0, 10)}...`}
                </div>
                <div className="text-xs text-gray-500 truncate">ID: {camera.id.substring(0, 15)}...</div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">Tidak ada kamera yang terdeteksi</p>
        )}
        {cameras.length > 1 && (
          <button
            onClick={switchCamera}
            className="mr-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={isLoading}
          >
            Ganti Kamera
          </button>
        )}
        <button
          onClick={refreshCameras}
          className="mb-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          disabled={isLoading}
        >
          {isLoading ? "Memuat..." : "Perbarui Daftar Kamera"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
        {!cameraOn ? (
          <button
            onClick={permissionState === "denied" ? requestCameraPermission : startCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? "Memulai..." : "Mulai Kamera"}
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            disabled={isLoading}
          >
            Hentikan Kamera
          </button>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Upload Gambar QR
        </button>
      </div>

      {result && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold">Hasil:</h3>
          <p className="text-gray-800 break-all">{result}</p>
          <button
            onClick={() => setResult("")}
            className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default QrScannerComponent;
//START KAMERA NYA PAS AWALNYA JALAN TP SWITCH NYA GA JALAN

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
  const [availableCameras, setAvailableCameras] = useState<QrScanner.Camera[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string>("");
  
  // Camera auto start attempt
  useEffect(() => {
    // Try to auto-start camera after a short delay
    const timer = setTimeout(() => {
      listCamerasAndStart();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get list of cameras and start the default one
  const listCamerasAndStart = async () => {
    try {
      setIsLoading(true);
      setError("");
      const cameras = await QrScanner.listCameras();
      //console.log("Available cameras:", cameras);
      setAvailableCameras(cameras);
      
      if (cameras.length > 0) {
        const camera = cameras[0]; // Use first camera by default
        await startCameraSimple(camera.id);
      } else {
        setError("Tidak ada kamera yang ditemukan");
      }
    } catch (err) {
      console.error("Failed to list cameras:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Gagal mengakses kamera: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simplified camera start function - now with camera ID parameter
  const startCameraSimple = async (cameraId: string | null = null) => {
    if (!videoRef.current) {
      setError("Video element not found");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      const newScanner = new QrScanner(videoRef.current, (result) => {
        const qrResult = result as QrScanner.ScanResult | string;
        setResult(typeof qrResult === 'string' ? qrResult : qrResult.data);
      });
      
      if (cameraId) {
        await newScanner.setCamera(cameraId);
        setCurrentCameraId(cameraId);
      }
      
      await newScanner.start();
      setScanner(newScanner);
      setCameraOn(true);
      //console.log("Camera started with ID:", cameraId);
    } catch (err) {
      console.error("Failed to start camera:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Gagal memulai kamera: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Switch to a specific camera by ID
  const switchToCamera = async (cameraId: string) => {
    if (cameraId === currentCameraId) return; // Skip if it's the same camera
    
    try {
      setIsLoading(true);
      setError("");
      
      if (scanner) {
        await scanner.stop();
        await scanner.setCamera(cameraId);
        await scanner.start();
        setCurrentCameraId(cameraId);
        //console.log("Switched to camera:", cameraId);
      } else {
        await startCameraSimple(cameraId);
      }
    } catch (err) {
      console.error("Failed to switch camera:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Gagal mengganti kamera: " + errorMessage);
      
      // Try to restart the original camera
      try {
        if (scanner) {
          await scanner.start();
        }
      } catch (e) {
        console.error("Failed to restart camera after switch failure:", e);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stop the camera
  const stopCamera = () => {
    if (scanner) {
      scanner.stop();
      setScanner(null);
      setCameraOn(false);
    }
  };
  
  // Refresh camera list
  const refreshCameras = async () => {
    try {
      setIsLoading(true);
      const cameras = await QrScanner.listCameras();
      //console.log("Available cameras (refreshed):", cameras);
      setAvailableCameras(cameras);
      setError("");
    } catch (err) {
      console.error("Failed to refresh camera list:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError("Gagal memperbarui daftar kamera: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle file upload for QR scanning
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError("");
      QrScanner.scanImage(file)
        .then((result) => {
          setResult(result);
        })
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
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
        />
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
        {availableCameras.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {availableCameras.map((camera) => (
              <button
                key={camera.id}
                onClick={() => switchToCamera(camera.id)}
                className={`p-2 text-sm text-left rounded-md ${
                  currentCameraId === camera.id
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                disabled={isLoading}
              >
                <div className="font-medium truncate">{camera.label}</div>
                <div className="text-xs text-gray-500 truncate">ID: {camera.id.substring(0, 15)}...</div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">Tidak ada kamera yang terdeteksi</p>
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
            onClick={listCamerasAndStart}
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
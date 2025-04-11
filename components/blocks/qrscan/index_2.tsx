//GAK BISA START KAMERA NYA PAS AWALNYA, TP SWITCH NYA  JALAN

import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const QrScannerComponent = () => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [result, setResult] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [permissionState, setPermissionState] = useState("prompt"); // 'prompt', 'granted', 'denied'
  
  // Check camera permissions and load available cameras on component mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        // First, check if we have camera permissions
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'camera' });
            setPermissionState(permissionStatus.state);
            
            // Listen for permission changes
            permissionStatus.onchange = () => {
              setPermissionState(permissionStatus.state);
              if (permissionStatus.state === 'granted') {
                loadCameras();
              }
            };
            
            // If permission is denied, don't try to load cameras
            if (permissionStatus.state === 'denied') {
              setError("Akses kamera ditolak. Silakan berikan izin kamera di pengaturan browser Anda.");
              setIsInitializing(false);
              return;
            }
          } catch (e) {
            console.log("Could not query camera permission status, will try direct access:", e);
          }
        }
        
        // Try loading cameras directly
        await loadCameras();
      } catch (err) {
        console.error("Camera initialization failed:", err);
        setError("Gagal menginisialisasi kamera: " + err.message);
        setIsInitializing(false);
      }
    };
    
    initCamera();
  }, []);
  
  const loadCameras = async () => {
    try {
      // First try to access media devices to prompt for permission if needed
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Now list available cameras
      const availableCameras = await QrScanner.listCameras();
      console.log("Available cameras:", availableCameras);
      
      if (availableCameras.length === 0) {
        setError("Tidak ada kamera yang terdeteksi. Periksa apakah perangkat Anda memiliki kamera.");
        setIsInitializing(false);
        return;
      }
      
      setCameras(availableCameras);
      setPermissionState("granted");
      
      // Auto-start camera after loading cameras
      if (isInitializing) {
        setIsInitializing(false);
        // Small delay to ensure component is fully mounted
        setTimeout(() => {
          startCameraWithIndex(0); // Start with the first camera
        }, 500);
      }
    } catch (err) {
      console.error("Failed to list cameras:", err);
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Akses kamera ditolak. Silakan berikan izin kamera di pengaturan browser Anda.");
        setPermissionState("denied");
      } else if (err.name === "NotFoundError") {
        setError("Tidak ada kamera yang terdeteksi pada perangkat Anda.");
      } else if (err.name === "NotReadableError") {
        setError("Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi lain yang menggunakan kamera.");
      } else {
        setError(`Tidak dapat mengakses kamera: ${err.message}`);
      }
      
      setIsInitializing(false);
    }
  };
  
  // Request camera permission explicitly
  const requestCameraPermission = async () => {
    try {
      setError("");
      setIsInitializing(true);
      await navigator.mediaDevices.getUserMedia({ video: true });
      await loadCameras();
    } catch (err) {
      console.error("Camera permission request failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Akses kamera ditolak. Silakan berikan izin kamera di pengaturan browser Anda.");
        setPermissionState("denied");
      } else {
        setError(`Tidak dapat mengakses kamera: ${err.message}`);
      }
      setIsInitializing(false);
    }
  };
  
  // Start camera with specific index
  const startCameraWithIndex = async (index) => {
    if (videoRef.current && cameras.length > 0) {
      try {
        // Ensure any existing scanner is stopped
        if (scanner) {
          scanner.stop();
          setScanner(null);
        }
        
        // Make sure index is valid
        if (index >= cameras.length) {
          index = 0;
        }
        setCurrentCameraIndex(index);
        
        const selectedCamera = cameras[index];
        console.log(`Starting camera: ${selectedCamera.label} (${selectedCamera.id})`);
        
        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            console.log("QR code detected:", result.data);
            setResult(result.data);
            // Don't automatically stop camera after detection
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
        setError("");
      } catch (err) {
        console.error("Failed to start camera:", err);
        
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Akses kamera ditolak. Silakan berikan izin kamera di pengaturan browser Anda.");
          setPermissionState("denied");
        } else {
          setError(`Gagal mengakses kamera: ${err.message}`);
        }
        
        setCameraOn(false);
      }
    } else {
      if (cameras.length === 0) {
        setError("Tidak ada kamera yang tersedia");
      } else {
        console.warn("Video ref tidak tersedia");
      }
    }
  };

  // Standard start camera function (uses current index)
  const startCamera = () => {
    startCameraWithIndex(currentCameraIndex);
  };

  // Fungsi untuk menghentikan kamera
  const stopCamera = () => {
    if (scanner) {
      console.log("Stopping camera...");
      scanner.stop();
      setScanner(null);
      setCameraOn(false);
    }
  };

  // Fungsi untuk beralih kamera
  const switchCamera = async () => {
    if (cameras.length <= 1) {
      setError("Hanya satu kamera yang terdeteksi");
      return;
    }
    
    // Calculate next camera index (rotate through available cameras)
    const nextCameraIndex = (currentCameraIndex + 1) % cameras.length;
    console.log(`Switching to camera index: ${nextCameraIndex}`);
    
    // If scanner is active, restart with new camera
    stopCamera();
    // Small delay to ensure resources are released
    setTimeout(() => {
      startCameraWithIndex(nextCameraIndex);
    }, 300);
  };

  // Fungsi untuk menangani upload file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Scanning file:", file.name);
      QrScanner.scanImage(file)
        .then((result) => {
          console.log("File scan result:", result);
          setResult(result);
          setError("");
        })
        .catch((err) => {
          console.error("Failed to scan file:", err);
          setError(`Gagal memindai QR code dari file: ${err}`);
        });
    }
  };

  // Clean up scanner when component unmounts
  useEffect(() => {
    return () => {
      console.log("Cleaning up scanner...");
      stopCamera();
    };
  }, []);

  // Get current camera name safely
  const getCurrentCameraName = () => {
    if (cameras.length > currentCameraIndex && currentCameraIndex >= 0) {
      return cameras[currentCameraIndex]?.label || 'Kamera Tanpa Nama';
    }
    return 'Tidak Diketahui';
  };

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
            {isInitializing ? (
              <p>Memulai kamera...</p>
            ) : permissionState === "denied" ? (
              <p>Akses kamera ditolak. Silakan berikan izin kamera di pengaturan browser Anda.</p>
            ) : cameras.length === 0 ? (
              <p>Tidak ada kamera yang terdeteksi. Pastikan perangkat Anda memiliki kamera.</p>
            ) : (
              <p>Kamera belum aktif. Klik tombol untuk memulai.</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-center">
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        {permissionState === "denied" ? (
          <button
            onClick={requestCameraPermission}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Minta Izin Kamera
          </button>
        ) : !cameraOn ? (
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={isInitializing || cameras.length === 0}
          >
            {isInitializing ? "Memulai..." : "Mulai Kamera"}
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Hentikan Kamera
          </button>
        )}
        <button
          onClick={switchCamera}
          disabled={cameras.length <= 1 || !cameraOn}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:bg-gray-400"
        >
          Ganti Kamera {cameras.length > 0 && `(${currentCameraIndex + 1}/${cameras.length})`}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Upload Gambar QR
        </button>
      </div>

      {cameras.length > 0 && cameraOn && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Kamera aktif: {getCurrentCameraName()}</p>
        </div>
      )}

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
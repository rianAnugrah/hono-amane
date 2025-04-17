import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import axios from "axios";
import { navigate } from "vike/client/router";
import {
  CameraIcon,
  SwitchCamera,
  RefreshCcw,
  Power,
  PowerOff,
  Upload,
  X,
  ExternalLink,
} from "lucide-react";
import { Asset } from "@/pages/(protected)/asset/types";

interface Camera {
  id: string;
  label: string;
}

const QrScannerComponent = () => {
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
  const [assetData, setAssetData] = useState<Asset | null>(null);
  const [isFetchingAsset, setIsFetchingAsset] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCameras();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const loadCameras = async () => {
    try {
      setIsLoading(true);
      setError("");
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Browser Anda tidak mendukung akses kamera.");
        setIsLoading(false);
        return;
      }
      await navigator.mediaDevices.getUserMedia({ video: true });
      const availableCameras = await QrScanner.listCameras(true);
      if (availableCameras.length === 0) {
        setError("Tidak ada kamera yang terdeteksi.");
        setPermissionState("granted");
        setIsLoading(false);
        return;
      }
      setCameras(availableCameras);
      setPermissionState("granted");
      setTimeout(() => {
        startCameraWithIndex(0);
      }, 500);
    } catch (err) {
      handleCameraError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraError = (err: any) => {
    console.error("Camera error:", err);
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      setError("Akses kamera ditolak.");
      setPermissionState("denied");
    } else if (err.name === "NotFoundError") {
      setError("Tidak ada kamera ditemukan.");
    } else if (err.name === "NotReadableError") {
      setError("Kamera sedang digunakan oleh aplikasi lain.");
    } else {
      setError(`Gagal memuat kamera: ${err.message}`);
    }
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
      setError("Video ref tidak tersedia atau kamera tidak ditemukan.");
      return;
    }

    try {
      setIsLoading(true);
      if (scanner) {
        scanner.stop();
        setScanner(null);
      }

      const selectedCamera = cameras[index % cameras.length];
      const qrScanner = new QrScanner(
        videoRef.current,
        (res) => {
          setResult(res.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
        }
      );

      await qrScanner.setCamera(selectedCamera.id);
      await qrScanner.start();

      setScanner(qrScanner);
      setCameraOn(true);
      setCurrentCameraIndex(index % cameras.length);
    } catch (err) {
      handleCameraError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    scanner?.stop();
    setScanner(null);
    setCameraOn(false);
  };

  const switchCamera = () => {
    if (cameras.length <= 1) return setError("Hanya satu kamera tersedia.");
    stopCamera();
    setTimeout(() => startCameraWithIndex((currentCameraIndex + 1) % cameras.length), 300);
  };

  const refreshCameras = async () => {
    try {
      setIsLoading(true);
      const availableCameras = await QrScanner.listCameras(true);
      setCameras(availableCameras);
      if (availableCameras.length === 0) {
        setError("Tidak ada kamera setelah penyegaran.");
      }
    } catch (err) {
      setError("Gagal memperbarui kamera: " + err.message);
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
      .catch(() => setError("Gagal memindai QR dari file."));
  };

  useEffect(() => {
    const fetchAssetData = async () => {
      if (!result) return setAssetData(null);
      try {
        setIsFetchingAsset(true);
        const response = await axios.get(`/api/assets/by-asset-number/${result}`);
        setAssetData(response.data);
      } catch (err) {
        setError("Gagal mengambil data asset.");
        setAssetData(null);
      } finally {
        setIsFetchingAsset(false);
      }
    };
    fetchAssetData();
  }, [result]);

  useEffect(() => {
    return () => scanner?.stop();
  }, [scanner]);

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="relative w-full max-w-sm mx-auto border-2 border-gray-300 rounded-xl overflow-hidden">
        <video ref={videoRef} className="w-full h-64 object-cover" />
        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white p-4">
            {isLoading ? <p>Starting Camera...</p> : <p>Press Enable Camera</p>}
          </div>
        )}
        {/* {error && (
          <div className="absolute bottom-0 left-0 w-full p-2">
            <p className="text-red-600 text-center bg-red-100 border border-red-600 rounded">
              {error}
            </p>
          </div>
        )} */}
      </div>

      <CameraButtons
        cameras={cameras}
        currentCameraIndex={currentCameraIndex}
        startCameraWithIndex={startCameraWithIndex}
        stopCamera={stopCamera}
        isLoading={isLoading}
      />

      <ControlPanel
        switchCamera={switchCamera}
        refreshCameras={refreshCameras}
        startCamera={startCameraWithIndex}
        stopCamera={stopCamera}
        requestCameraPermission={requestCameraPermission}
        cameraOn={cameraOn}
        isLoading={isLoading}
        permissionState={permissionState}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
      />

      <ResultPanel
        result={result}
        setResult={setResult}
        assetData={assetData}
        isFetching={isFetchingAsset}
      />
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
    <div className="flex justify-center mb-4 gap-2">
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

const ResultPanel = ({
  result,
  setResult,
  assetData,
  isFetching,
}: {
  result: string;
  setResult: (r: string) => void;
  assetData: Asset | null;
  isFetching: boolean;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex flex-row w-full gap-2 items-center">
      <input
        type="text"
        value={result}
        onChange={(e) => setResult(e.target.value)}
        className="border rounded h-[2rem] px-2 text-xs text-gray-800 flex-grow"
      />
      <button
        onClick={() => {
          setResult("");
          window.location.reload();
        }}
        className="bg-red-600 text-white h-[2rem] px-3 rounded hover:bg-red-500 flex items-center gap-1 text-xs"
      >
        <X className="w-auto h-3" />
        <p>Reset</p>
      </button>
    </div>

    {isFetching ? (
      <p className="text-gray-600 mt-2">Loading asset data...</p>
    ) : assetData ? (
      <div className="mt-2 flex flex-col items-center gap-2">
        <p className="text-sm text-gray-700">Asset found: {assetData.assetName}</p>
        <button
          onClick={() => navigate(`/asset/${result}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Asset Details
        </button>
      </div>
    ) : (
      result && <p className="text-red-600 mt-2">No asset data found</p>
    )}
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

export default QrScannerComponent;

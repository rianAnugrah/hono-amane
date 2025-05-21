import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, QrCode, AlertCircle, RefreshCw, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InspectionQrScannerProps {
  onScan: (assetNo: string) => void;
  onClose: () => void;
}

const InspectionQrScanner: React.FC<InspectionQrScannerProps> = ({ onScan, onClose }) => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrDetected, setQrDetected] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraMenuOpen, setIsCameraMenuOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Load available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        
        // Select the first camera by default if available
        if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error listing cameras:', err);
        setError('Could not access camera devices');
      }
    };
    
    getCameras();
  }, []);
  
  // Start or stop camera feed when selectedCamera changes
  useEffect(() => {
    if (selectedCamera) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [selectedCamera]);
  
  // Start camera with selected device
  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      if (streamRef.current) {
        stopCamera();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start QR code detection
      startQrDetection();
      
    } catch (err) {
      console.error('Error starting camera:', err);
      setError('Could not access the camera. Please check permissions and try again.');
      setIsScanning(false);
    }
  };
  
  // Stop camera and release resources
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };
  
  // Mock QR detection (in a real app, you would use a library like jsQR or zbar.wasm)
  const startQrDetection = () => {
    // In a real implementation, you would:
    // 1. Grab frames from the video using canvas
    // 2. Process each frame with a QR code detection library
    // 3. When a QR code is detected, call handleQrDetected with the result
    
    // For demo purposes, let's simulate detection after 3 seconds
    const simulateQrDetection = setTimeout(() => {
      const mockAssetNo = 'ASSET-' + Math.floor(Math.random() * 100000).toString().padStart(6, '0');
      handleQrDetected(mockAssetNo);
    }, 3000);
    
    return () => clearTimeout(simulateQrDetection);
  };
  
  // Handle detected QR code
  const handleQrDetected = (result: string) => {
    setQrDetected(result);
    setIsScanning(false);
    
    // Auto-confirm after 2 seconds
    setTimeout(() => {
      onScan(result);
    }, 2000);
  };
  
  // Switch camera
  const handleCameraSwitch = (deviceId: string) => {
    setSelectedCamera(deviceId);
    setIsCameraMenuOpen(false);
  };
  
  // Reset scanner
  const handleReset = () => {
    setQrDetected(null);
    setIsScanning(true);
    startCamera();
  };
  
  // Get current camera name
  const getCurrentCameraName = () => {
    if (!selectedCamera) return 'Default Camera';
    const camera = cameras.find(c => c.deviceId === selectedCamera);
    return camera?.label || 'Camera ' + (cameras.indexOf(camera!) + 1);
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-blue-600" />
            <h3 className="font-medium text-gray-800">Scan Asset QR Code</h3>
          </div>
          <motion.button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <X size={18} />
          </motion.button>
        </div>
        
        {/* Camera feed */}
        <div className="relative bg-black aspect-[4/3] w-full">
          {!qrDetected ? (
            <>
              <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative">
                    <motion.div 
                      className="w-48 h-48 border-2 border-blue-400 rounded-lg"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                    />
                    <motion.div 
                      className="absolute top-1/2 w-full h-0.5 bg-blue-500"
                      initial={{ opacity: 0.8, y: -50 }}
                      animate={{ opacity: 0.8, y: 50 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  <p className="text-white text-sm mt-6 bg-black/40 px-4 py-2 rounded-full">
                    Position QR code in the frame
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
              <motion.div 
                className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg max-w-xs"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={32} className="text-green-600" />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 mb-1">QR Code Detected</h3>
                  <p className="text-sm text-gray-500 mb-2">Asset number found:</p>
                  <div className="bg-gray-100 font-mono text-blue-700 px-4 py-2 rounded-md text-sm">
                    {qrDetected}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="bg-white p-6 rounded-lg max-w-xs text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Camera Error</h3>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <button 
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium"
                  onClick={startCamera}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="p-4 flex items-center justify-between">
          {/* Camera selector */}
          {cameras.length > 1 && (
            <div className="relative">
              <button 
                className="flex items-center gap-2 py-2 px-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                onClick={() => setIsCameraMenuOpen(!isCameraMenuOpen)}
              >
                <Camera size={16} className="text-gray-500" />
                <span className="truncate max-w-[120px]">{getCurrentCameraName()}</span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              
              <AnimatePresence>
                {isCameraMenuOpen && (
                  <motion.div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-2">
                      {cameras.map((camera) => (
                        <button
                          key={camera.deviceId}
                          className={`w-full text-left px-3 py-2 rounded text-sm ${
                            camera.deviceId === selectedCamera 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                          onClick={() => handleCameraSwitch(camera.deviceId)}
                        >
                          {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {qrDetected ? (
              <button 
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                onClick={handleReset}
              >
                Scan Another
              </button>
            ) : (
              <button 
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center gap-1.5"
                onClick={startCamera}
                disabled={isScanning}
              >
                <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
                Rescan
              </button>
            )}
            
            {qrDetected && (
              <button 
                className="py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                onClick={() => onScan(qrDetected)}
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InspectionQrScanner; 
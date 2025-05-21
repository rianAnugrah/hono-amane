import React, { useState, useEffect } from "react";
import { Asset } from "../../pages/(protected)/asset/types";
import { QRCodeCanvas } from "qrcode.react";
import { Hash, FileText, Camera, CopyCheck, Download, X, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Image } from "lucide-react";
import { ImageWithFallback, hasValidImages, getColorFromString, getInitials } from "@/components/utils/ImageUtils";
import { motion, AnimatePresence } from "framer-motion";

// QR Code and Images component
const AssetMediaSection = ({ asset }: { asset: Asset }) => {
  const hasImages = hasValidImages(asset.images);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [qrCodeCopied, setQrCodeCopied] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>({});

  const handleCopyAssetNo = () => {
    navigator.clipboard.writeText(asset.assetNo);
    setQrCodeCopied(true);
    setTimeout(() => setQrCodeCopied(false), 2000);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (!asset.images) return;
    
    if (direction === 'next') {
      setCurrentImageIndex(prev => 
        prev === asset.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === 0 ? asset.images.length - 1 : prev - 1
      );
    }
  };
  
  const handleImageError = (index: number) => {
    setImageLoadError(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, type: "spring", stiffness: 100 }
    }
  };
  
  // Function to create image placeholder with asset name
  const renderPlaceholder = (assetName: string, index: number) => {
    // Generate a predictable background color based on the assetName
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100', 'bg-pink-100', 'bg-indigo-100'];
    const textColors = ['text-blue-700', 'text-green-700', 'text-purple-700', 'text-yellow-700', 'text-pink-700', 'text-indigo-700'];
    
    const hashCode = assetName.split('').reduce(
      (hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0
    );
    const colorIndex = Math.abs(hashCode) % colors.length;
    
    // Get initials from asset name (up to 2 characters)
    const initials = assetName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    return (
      <div className={`w-full h-full ${colors[colorIndex]} flex flex-col items-center justify-center ${textColors[colorIndex]}`}>
        <Image className="opacity-10 absolute" size={48} />
        <span className="text-lg font-bold z-10">{initials}</span>
        <span className="text-xs z-10 mt-1">No Image</span>
      </div>
    );
  };

  return (
    <motion.div 
      className="w-full md:w-1/3 mb-8 md:mb-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* QR Code Section */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Hash size={14} className="text-blue-500" />
            Asset Identifier
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            ID: {asset.id.substring(0, 8)}
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          {/* QR Code */}
          <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <QRCodeCanvas 
              value={asset.assetNo} 
              size={150}
              includeMargin
              fgColor="#1a56db"
              bgColor="#ffffff"
              level="H"
            />
          </div>
          
          {/* Asset Number */}
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Asset Number</div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-mono text-base font-medium text-gray-800">{asset.assetNo}</span>
              <motion.button 
                className={`p-1.5 rounded-full ${qrCodeCopied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors`}
                onClick={handleCopyAssetNo}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {qrCodeCopied ? <CheckCircle size={14} /> : <CopyCheck size={14} />}
              </motion.button>
            </div>
            {qrCodeCopied && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-green-600 mt-1"
              >
                Copied to clipboard!
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Asset Image Section */}
      {hasImages && (
        <motion.div 
          className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Camera size={14} className="text-blue-500" />
              Asset Images
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {asset.images.length} {asset.images.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {asset.images.slice(0, 4).map((image, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => openLightbox(index)}
              >

                {imageLoadError[index] ? (
                  renderPlaceholder(asset.assetName, index)
                ) : (
                  <ImageWithFallback
                    src={image}
                    alt={`${asset.assetName} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    assetName={asset.assetName}
                    onError={() => handleImageError(index)}
                  />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300 rounded-lg"></div>
              </motion.div>
            ))}
          </div>
          
          {/* View all images button if more than 4 */}
          {asset.images.length > 4 && (
            <motion.button 
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 bg-blue-50 hover:bg-blue-100 px-3 py-2.5 rounded-lg border border-blue-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
              whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
              onClick={() => openLightbox(0)}
            >
              <Camera size={16} />
              View all {asset.images.length} images
            </motion.button>
          )}
        </motion.div>
      )}
      
      {!hasImages && (
        <motion.div 
          className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="py-8 flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <Camera size={24} className="text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-medium mb-1">No Images Available</h3>
            <p className="text-gray-500 text-sm">This asset doesn't have any images yet</p>
          </div>
        </motion.div>
      )}
      
      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div 
              className="absolute top-4 right-4 z-10"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button 
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                onClick={closeLightbox}
              >
                <X size={20} />
              </button>
            </motion.div>
            
            {/* Current image display */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {imageLoadError[currentImageIndex] ? (
                <div className="h-[50vh] w-[50vh] max-w-full max-h-full rounded-md flex items-center justify-center bg-gray-800">
                  {renderPlaceholder(asset.assetName, currentImageIndex)}
                </div>
              ) : (
                <ImageWithFallback 
                  src={asset.images[currentImageIndex]} 
                  alt={`${asset.assetName} - Full size ${currentImageIndex + 1}`} 
                  className="max-w-full max-h-[80vh] object-contain rounded-md"
                  assetName={asset.assetName}
                  onError={() => handleImageError(currentImageIndex)}
                />
              )}
              
              {/* Download button */}
              <a 
                href={asset.images[currentImageIndex]} 
                download={`asset-${asset.assetNo}-image-${currentImageIndex + 1}`}
                className="absolute bottom-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={20} />
              </a>
              
              {/* Navigation buttons for multiple images */}
              {asset.images.length > 1 && (
                <>
                  <motion.button 
                    className="absolute left-2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('prev');
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  <motion.button 
                    className="absolute right-2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('next');
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-3 py-1.5 rounded-full">
                {currentImageIndex + 1} / {asset.images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssetMediaSection; 
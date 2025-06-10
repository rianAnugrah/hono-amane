import React, { useState } from "react";
import { Asset } from "../../pages/(protected)/asset/types";
import { QRCodeCanvas } from "qrcode.react";
import {
  Camera,
  CopyCheck,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Image,
  QrCode,
} from "lucide-react";
import {
  ImageWithFallback,
  hasValidImages,
} from "@/components/utils/ImageUtils";
import { motion, AnimatePresence } from "framer-motion";

// QR Code and Images component
const AssetMediaSection = ({ asset }: { asset: Asset }) => {
  const hasImages = hasValidImages(asset.images);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [qrCodeCopied, setQrCodeCopied] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>(
    {}
  );

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

  const navigateImage = (direction: "next" | "prev") => {
    if (!asset.images) return;

    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === asset.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? asset.images.length - 1 : prev - 1
      );
    }
  };

  const handleImageError = (index: number) => {
    setImageLoadError((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, type: "spring", stiffness: 100 },
    },
  };

  // Function to create image placeholder with asset name
  const renderPlaceholder = (assetName: string) => {
    const colors = [
      "bg-blue-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-yellow-100",
      "bg-pink-100",
      "bg-indigo-100",
    ];
    const textColors = [
      "text-blue-700",
      "text-green-700",
      "text-purple-700",
      "text-yellow-700",
      "text-pink-700",
      "text-indigo-700",
    ];

    const hashCode = assetName
      .split("")
      .reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);
    const colorIndex = Math.abs(hashCode) % colors.length;

    const initials = assetName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return (
      <div
        className={`w-full h-full ${colors[colorIndex]} flex flex-col items-center justify-center ${textColors[colorIndex]} relative`}
      >
        <Image className="opacity-10 absolute" size={48} />
        <span className="text-lg font-bold z-10">{initials}</span>
        <span className="text-xs z-10 mt-1">No Image</span>
      </div>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* QR Code Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <QrCode size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Asset Identifier</h3>
            <p className="text-sm text-gray-600">Quick access QR code</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm">
            <QRCodeCanvas
              value={asset.assetNo}
              size={140}
              includeMargin
              fgColor="#1f2937"
              bgColor="#ffffff"
              level="H"
            />
          </div>

          {/* Asset Number */}
          <div className="text-center space-y-2">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Asset Number
            </div>
            <div className="flex items-center justify-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <span className="font-mono text-lg font-bold text-gray-800">
                {asset.assetNo}
              </span>
              <motion.button
                className={`p-2 rounded-lg transition-all ${
                  qrCodeCopied
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200"
                }`}
                onClick={handleCopyAssetNo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {qrCodeCopied ? (
                  <CheckCircle size={16} />
                ) : (
                  <CopyCheck size={16} />
                )}
              </motion.button>
            </div>
            {qrCodeCopied && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-green-600 font-medium"
              >
                ✓ Copied to clipboard!
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Asset Image Section */}
      {hasImages ? (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Camera size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Asset Images</h3>
                <p className="text-sm text-gray-600">
                  {asset.images.length} photo
                  {asset.images.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-medium border border-emerald-200">
              {asset.images.length}{" "}
              {asset.images.length === 1 ? "image" : "images"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {asset.images.slice(0, 4).map((image, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group bg-gray-50"
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => openLightbox(index)}
              >
                {imageLoadError[index] ? (
                  renderPlaceholder(asset.assetName)
                ) : (
                  <ImageWithFallback
                    src={image}
                    alt={`${asset.assetName} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    assetName={asset.assetName}
                    onError={() => handleImageError(index)}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-xl"></div>
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </div>
              </motion.div>
            ))}
          </div>

          {/* View all images button if more than 4 */}
          {asset.images.length > 4 && (
            <motion.button
              className="w-full text-sm text-emerald-700 hover:text-emerald-800 font-medium mt-6 bg-emerald-50 hover:bg-emerald-100 px-4 py-3 rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-sm"
              whileHover={{
                y: -1,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
              onClick={() => openLightbox(0)}
            >
              <Camera size={16} />
              View all {asset.images.length} images
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Camera size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Images Available
            </h3>
            <p className="text-gray-500 text-sm max-w-sm">
              This asset doesn't have any images yet. Images will appear here
              once uploaded.
            </p>
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
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              onClick={closeLightbox}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X size={24} />
            </motion.button>

            {/* Current image display */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {imageLoadError[currentImageIndex] ? (
                <div className="h-[60vh] w-[60vh] max-w-full max-h-full rounded-xl flex items-center justify-center bg-gray-800">
                  {renderPlaceholder(asset.assetName)}
                </div>
              ) : (
                <ImageWithFallback
                  src={asset.images[currentImageIndex]}
                  alt={`${asset.assetName} - Full size ${
                    currentImageIndex + 1
                  }`}
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                  assetName={asset.assetName}
                  onError={() => handleImageError(currentImageIndex)}
                />
              )}

              {/* Download button */}
              <a
                href={asset.images[currentImageIndex]}
                download={`asset-${asset.assetNo}-image-${
                  currentImageIndex + 1
                }`}
                className="absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={20} />
              </a>

              {/* Navigation buttons for multiple images */}
              {asset.images.length > 1 && (
                <>
                  <motion.button
                    className="absolute left-4 p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage("prev");
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft size={28} />
                  </motion.button>
                  <motion.button
                    className="absolute right-4 p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage("next");
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={28} />
                  </motion.button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
                {currentImageIndex + 1} of {asset.images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssetMediaSection;

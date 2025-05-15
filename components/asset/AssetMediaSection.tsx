import React from "react";
import { Asset } from "../../pages/(protected)/asset/types";
import { QRCodeCanvas } from "qrcode.react";
import { Hash, FileText } from "lucide-react";
import { ImageWithFallback, hasValidImages } from "@/components/utils/ImageUtils";

// QR Code and Images component
const AssetMediaSection = ({ asset }: { asset: Asset }) => {
  const hasImages = hasValidImages(asset.images);
  
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
      {/* QR Code Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col items-center">
        <QRCodeCanvas
          value={asset.assetNo}
          size={120}
          className="rounded"
          bgColor="#f9fafb"
          fgColor="#1e40af"
          level="M"
        />
        <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
          <Hash size={12} />
          <span className="font-mono">{asset.assetNo}</span>
        </div>
      </div>
      
      {/* Image Gallery */}
      {hasImages && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText size={14} className="text-gray-400" />
            Asset Images
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {asset.images.map((image, index) => (
              <a 
                key={index} 
                href={image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block aspect-square rounded-lg overflow-hidden border border-gray-100 hover:border-blue-300 transition-all hover:shadow-md"
              >
                <ImageWithFallback
                  src={image}
                  alt={`${asset.assetName} - Image ${index + 1}`}
                  assetName={asset.assetName}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
          
          {/* View all images button if more than 4 */}
          {asset.images.length > 4 && (
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2">
              View all {asset.images.length} images
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetMediaSection; 
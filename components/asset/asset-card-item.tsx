import React, { useState } from "react";
import { motion } from "framer-motion";
import { Asset } from "../../pages/(protected)/asset/types";
import { Link } from "@/renderer/Link";
import {
  ChevronRight,
  ExternalLink,
  Pencil,
  Trash,
  MapPin,
  Package,
  Hash,
  Tag,
  Info,
  Calendar,
  DollarSign,
  ImageIcon
} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import { formatIDR } from "@/components/utils/formatting";
import AssetDetail from "./asset-detail";
import {
  getColorFromString,
  getInitials,
  hasValidImages
} from "@/components/utils/ImageUtils";

const CardItem = ({
  asset,
  checked,
  onSelectAsset,
  role,
  handleEdit,
  handleDelete,
}: {
  asset: Asset;
  role: string;
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
  checked: boolean;
  onSelectAsset: (asset: Asset) => void;
}) => {
  // Track image loading errors
  const [imageError, setImageError] = useState(false);
  
  // Function to check if the asset has images
  const hasImages = hasValidImages(asset.images);

  // Function to get asset image URL
  const getAssetImageUrl = (): string | undefined => {
    return hasImages ? asset.images[0] : undefined;
  };

  // Function to truncate text
  const truncate = (text: string, length: number) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // Get creation date (if available)
  const creationDate = asset.createdAt 
    ? new Date(asset.createdAt).toLocaleDateString() 
    : null;

  // Get condition badge styles
  const getConditionStyle = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "good":
        return "bg-green-100 text-green-700 border border-green-200";
      case "fair":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "broken":
        return "bg-red-100 text-red-700 border border-red-200";
      case "poor":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "missing":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  // Render asset image or placeholder
  const renderAssetImage = () => {
    if (!hasImages || imageError) {
      const bgColor = getColorFromString(asset.assetName);
      const initials = getInitials(asset.assetName);
      
      return (
        <div 
          className="w-full h-full flex flex-col items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <ImageIcon size={40} className="text-white/20 mb-2" />
          <span className="text-2xl font-bold text-gray-700">{initials}</span>
          <span className="text-xs text-gray-600 mt-1">No image available</span>
        </div>
      );
    }
    
    return (
      <img
        src={getAssetImageUrl()}
        alt={asset.assetName}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  };

  return (
    <motion.div
      className={`relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md ${
        checked ? "ring-2 ring-blue-500" : "border border-gray-200"
      }`}
      style={{ height: "380px" }}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Selection Checkbox */}
      <motion.div 
        className="absolute top-3 left-3 z-[5] drop-shadow-sm"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
      >
        <Checkbox checked={checked} onChange={() => onSelectAsset(asset)} />
      </motion.div>

      {/* Action Buttons - Top Right */}
      <div className="absolute top-3 right-3 z-[5] flex gap-1 bg-white/90 p-1 rounded-md">
        {/* <Link
          href={`/asset/${asset.assetNo}`}
          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
          aria-label="View asset details"
        >
          <ExternalLink size={15} />
        </Link> */}
        {role !== "read_only" && (
          <>
            <motion.button
              onClick={() => handleEdit(asset)}
              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Edit asset"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pencil size={15} />
            </motion.button>
            <motion.button
              onClick={() => handleDelete(asset.id)}
              className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete asset"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash size={15} />
            </motion.button>
          </>
        )}
      </div>

      {/* Image Container */}
      <div className="relative bg-gray-50 group" style={{ height: "170px" }}>
        {renderAssetImage()}
        
        {/* Condition Badge */}
        <div className="absolute bottom-2 right-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getConditionStyle(
              asset.condition
            )}`}
          >
            {asset.condition}
          </span>
        </div>
        
        {/* Asset ID Chip */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {asset.assetNo}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col" style={{ height: "210px" }}>
        {/* Asset ID & Category */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center text-gray-500">
            <Hash size={11} className="mr-1 flex-shrink-0" />
            <span className="truncate font-mono">{asset.assetNo}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Package size={11} className="mr-1 flex-shrink-0" />
            <span className="truncate">{asset.categoryCode || "N/A"}</span>
          </div>
        </div>

        {/* Asset Name */}
        <h3
          className="font-medium text-gray-900 line-clamp-2 mb-2 text-sm leading-tight"
          title={asset.assetName}
        >
          {asset.assetName}
        </h3>

        {/* Asset Details */}
        <div className="space-y-2 flex-grow text-xs">
          {/* Remark/Description */}
          {asset.remark && (
            <div className="flex items-start text-gray-600 group">
              <Info
                size={11}
                className="mr-1 mt-0.5 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors"
              />
              <p className="line-clamp-2 group-hover:text-gray-800 transition-colors" title={asset.remark}>
                {truncate(asset.remark, 70)}
              </p>
            </div>
          )}

          {/* Project Code */}
          <div className="flex items-center text-gray-600 group">
            <Tag size={11} className="mr-1 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span className="truncate group-hover:text-gray-800 transition-colors">{asset.projectCode?.code || "N/A"}</span>
          </div>

          {/* Asset Type */}
          {asset.type && (
            <div className="flex items-center text-gray-600 group">
              <Package size={11} className="mr-1 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                asset.type === 'HBI' 
                  ? 'bg-orange-50 text-orange-700' 
                  : 'bg-teal-50 text-teal-700'
              }`}>
                {asset.type}
              </span>
            </div>
          )}

          {/* Creation Date (if available) */}
          {creationDate && (
            <div className="flex items-center text-gray-600 group">
              <Calendar size={11} className="mr-1 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="truncate group-hover:text-gray-800 transition-colors">{creationDate}</span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-start text-gray-600 group">
            <MapPin
              size={11}
              className="mr-1 mt-0.5 flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors"
            />
            <span className="truncate leading-tight group-hover:text-gray-800 transition-colors">
              {asset.locationDesc?.description || "N/A"}
              {asset.detailsLocation?.description &&
                ` - ${truncate(asset.detailsLocation.description, 15)}`}
            </span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center group">
              <DollarSign size={10} className="text-gray-400 mr-1 group-hover:text-green-500 transition-colors" />
              <p className="font-semibold text-gray-900 text-sm group-hover:text-green-600 transition-colors">
                {formatIDR(asset.acqValueIdr)}
              </p>
            </div>

            {/* View Details Link */}
            <motion.div whileHover={{ x: 2 }} whileTap={{ x: -1 }}>
              <Link
                href={`/asset/${asset.assetNo}`}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors group"
                aria-label="View asset details"
              >
                More details
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Modal dialog for asset details */}
        <dialog id={`asset_modal_${asset.id}`} className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <AssetDetail isExpanded={true} asset={asset} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </motion.div>
  );
};

export default CardItem;

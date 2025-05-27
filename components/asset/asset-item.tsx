import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Asset } from "../../pages/(protected)/asset/types";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/renderer/Link";
import Switch from "@/components/ui/switch";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Link2Icon,
  LinkIcon,
  Pencil,
  Trash,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  ImageIcon
} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import { formatIDR } from "@/components/utils/formatting";
import AssetDetail from "./asset-detail";
import { useUserStore } from "@/stores/store-user-login";
import CardItem from "./asset-card-item";
import NoImagePlaceholder from "./NoImagePlaceholder";
import { ImageWithFallback, hasValidImages, getColorFromString, getInitials } from "@/components/utils/ImageUtils";

/**
 * Interface for location object
 */
interface LocationItem {
  userId: string;
  locationId: number;
  location: {
    id: number;
    description: string;
  };
}

// Extend the Asset interface in the file to ensure createdAt is available
declare module "../../pages/(protected)/asset/types" {
  interface Asset {
    createdAt?: string;
  }
}

export default function AssetItem({
  asset,
  isExpanded,
  onToggle,
  handleEdit,
  handleDelete,
  checked,
  onSelectAsset,
  currentView,
}: {
  asset: Asset;
  isExpanded: boolean;
  currentView: string;
  onToggle: (id: string) => void;
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
  checked: boolean;
  onSelectAsset: (asset: Asset) => void;
}) {
  const { location, role } = useUserStore();
  const hasImages = hasValidImages(asset.images);
  const [imageError, setImageError] = useState(false);

  function isLocationIdExists(
    locationsArray: LocationItem[],
    locationIdToCheck: number
  ): boolean {
    return locationsArray.some((item) => item.locationId === locationIdToCheck);
  }

  function renderEditButton(
    locationsArray: LocationItem[],
    locationIdToCheck: number
  ): React.ReactNode {
    if (isLocationIdExists(locationsArray, locationIdToCheck)) {
      return (
        <div className="col-span-2 px-4 py-2 flex items-center justify-end gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/asset/${asset.assetNo}`}
              className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center"
              aria-label="View asset details"
            >
              <Eye size={16} />
            </Link>
          </motion.div>
          
          <motion.button
            onClick={() => handleEdit(asset)}
            className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            title="Edit asset"
          >
            <Pencil size={16} />
          </motion.button>
          
          <motion.button
            onClick={() => handleDelete(asset.id)}
            className="p-2 text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            title="Delete asset"
          >
            <Trash size={16} />
          </motion.button>
          
          <motion.button
            onClick={() => onToggle(asset.id)}
            className="p-2 text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            title={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </motion.button>
        </div>
      );
    } else {
      return null;
    }
  }
  
  // Render asset thumbnail with fallback
  const renderAssetThumbnail = () => {
    if (!hasImages || imageError) {
      // Generate background color based on asset name
      const bgColor = getColorFromString(asset.assetName);
      const initials = getInitials(asset.assetName);
      
      return (
        <div 
          className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <span className="font-bold text-gray-700">{initials}</span>
        </div>
      );
    }
    
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden mr-2 mb-1.5 border border-gray-200 shadow-sm">
        <img
          src={hasImages ? asset.images[0] : undefined}
          alt={asset.assetName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  };

  // Animation variants for better transitions
  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { backgroundColor: "rgba(243, 244, 246, 0.5)" }
  };

  return (
    <motion.div layout key={asset.id} className="w-full">
      {/* TABLE VIEW */}
      {currentView === "table" && (
        <motion.div 
          className="w-full md:flex flex-col items-center md:border md:bg-white md:border-gray-200 relative py-0 font-bold text-xs rounded-lg overflow-hidden shadow-sm"
          variants={tableRowVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ duration: 0.2 }}
        >
          <div className="w-full grid grid-cols-12 items-center">
            <div className="col-span-3 pr-4 py-3 flex items-center gap-3 pl-4">
              <div className="flex items-center">
                <Checkbox
                  checked={checked}
                  onChange={() => onSelectAsset(asset)}
                />
              </div>
              <div className="flex flex-col">
                {/* Image thumbnail with better styling */}
                {renderAssetThumbnail()}
                <div className="font-medium text-gray-900">{asset.assetName}</div>
                <span className="text-gray-500 font-mono text-[10px]">{asset.assetNo}</span>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  asset.condition?.toLowerCase() === "good"
                    ? "bg-green-50 text-green-700"
                    : asset.condition?.toLowerCase() === "broken"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {asset.condition}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center">
              {asset.type ? (
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  asset.type === 'HBI' 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'bg-teal-50 text-teal-700'
                }`}>
                  {asset.type}
                </span>
              ) : (
                <span className="text-gray-400 text-xs">-</span>
              )}
            </div>
            <div className="px-4 py-3 flex items-center">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                {asset.projectCode?.code || "N/A"}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center">
              {asset.locationDesc?.description || "N/A"}
            </div>
            <div className="px-4 py-3 col-span-2 flex items-center">
              <div className="flex items-center gap-1">
                <DollarSign size={14} className="text-green-500" />
                <span className="font-semibold text-gray-900">
                  {formatIDR(asset.acqValueIdr)}
                </span>
              </div>
            </div>
            {role !== "read_only" &&
              renderEditButton(location, asset.locationDesc_id || 0)}
          </div>
          
          {/* Asset detail section with animations */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full overflow-hidden"
              >
                <AssetDetail isExpanded={isExpanded} asset={asset} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* CARD VIEW */}
      {currentView === "card" && (
        <CardItem
          asset={asset}
          checked={checked}
          onSelectAsset={onSelectAsset}
          role={role}
          handleEdit={handleEdit}
          location={location}
          handleDelete={handleDelete}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      )}
    </motion.div>
  );
}

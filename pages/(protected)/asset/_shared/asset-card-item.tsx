import React from "react";
import { Asset } from "../types";
import { Link } from "@/renderer/Link";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Pencil,
  Trash,
  MapPin,
  Package,
  Hash,
  Tag,
  Info
} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import { formatIDR } from "@/components/utils/formatting";
import AssetDetail from "./asset-detail";
import { ImageWithFallback, hasValidImages } from "@/components/utils/ImageUtils";
import { motion } from "framer-motion";

const CardItem = ({
  asset,
  checked,
  onSelectAsset,
  role,
  handleEdit,
  location,
  handleDelete,
  isExpanded,
  onToggle,
}: {
  asset: Asset;
  isExpanded: boolean;
  role: string;
  onToggle: (id: string) => void;
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
  checked: boolean;
  location: any;
  onSelectAsset: (asset: Asset) => void;
}) => {
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

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${checked ? "ring-2 ring-blue-500" : "border border-gray-100"}`}
      style={{ height: "380px" }}
    >
      {/* Top Action - Select */}
      <div className="absolute top-3 left-3 z-10">
        <Checkbox
          checked={checked}
          onChange={() => onSelectAsset(asset)}
        />
      </div>

      {/* Image Container - Fixed height */}
      <div className="relative bg-gray-100" style={{ height: "180px" }}>
        <ImageWithFallback
          src={getAssetImageUrl()}
          alt={asset.assetName}
          assetName={asset.assetName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              asset.condition === "Good"
                ? "bg-green-500 text-white"
                : asset.condition === "Broken"
                ? "bg-red-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {asset.condition}
          </span>
        </div>
      </div>

      {/* Content Container - Fixed layout */}
      <div className="p-4 flex flex-col" style={{ height: "200px" }}>
        {/* Asset ID */}
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <Hash size={12} className="mr-1 flex-shrink-0" />
          <span className="truncate">{asset.assetNo}</span>
        </div>
        
        {/* Product Name */}
        <div className="mb-2" style={{ height: "42px" }}>
          <h3 className="font-medium text-gray-900 line-clamp-2" title={asset.assetName}>
            {asset.assetName}
          </h3>
        </div>

        {/* Description/Remark */}
        <div className="flex-grow flex flex-col justify-start overflow-hidden">
          {asset.remark && (
            <div className="flex items-start text-xs text-gray-600 mb-2">
              <Info size={12} className="mr-1 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2" title={asset.remark}>
                {truncate(asset.remark, 65)}
              </p>
            </div>
          )}

          {/* Project & Location with icons */}
          <div className="flex items-center text-xs text-gray-600 mb-1">
            <Tag size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{asset.projectCode?.code || "N/A"}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-600 mb-1">
            <Package size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{asset.categoryCode || "N/A"}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-600">
            <MapPin size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">
              {asset.locationDesc?.description || "N/A"}
              {asset.detailsLocation?.description && 
                ` - ${truncate(asset.detailsLocation.description, 15)}`}
            </span>
          </div>
        </div>

        {/* Price and Action Button - Fixed at bottom */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-gray-900">
              {formatIDR(asset.acqValueIdr)}
            </p>

            <div className="flex gap-1">
              <Link
                href={`/asset/${asset.assetNo}`}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ExternalLink size={16} />
              </Link>
              {role !== "read_only" && (
                <>
                  <button
                    onClick={() => handleEdit(asset)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Details Toggle Button */}
          <button
            onClick={() => {
              const modal = document.getElementById(`asset_modal_${asset.id}`);
              if (modal instanceof HTMLDialogElement) {
                modal.showModal();
              }
            }}
            className="w-full flex items-center justify-center gap-1 mt-1 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
          >
            More details
            <ChevronRight size={14} />
          </button>
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
    </div>
  );
};

export default CardItem;

import React from "react";
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
} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import { formatIDR } from "@/components/utils/formatting";
import AssetDetail from "./asset-detail";
import {
  ImageWithFallback,
  hasValidImages,
} from "@/components/utils/ImageUtils";

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

  // Get condition badge styles
  const getConditionStyle = (condition: string) => {
    switch (condition) {
      case "Good":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Broken":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl  overflow-hidden transition-all duration-200 hover:shadow-md ${
        checked ? "ring-2 ring-blue-500" : "border border-gray-200"
      }`}
      style={{ height: "380px" }}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-[1] drop-shadow-sm">
        <Checkbox checked={checked} onChange={() => onSelectAsset(asset)} />
      </div>

      {/* Action Buttons - Top Right */}
      <div className="absolute top-3 right-3 z-[1] flex gap-1 bg-white/90 p-1 rounded-md">
        {/* <Link
          href={`/asset/${asset.assetNo}`}
          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
          aria-label="View asset details"
        >
          <ExternalLink size={15} />
        </Link> */}
        {role !== "read_only" && (
          <>
            <button
              onClick={() => handleEdit(asset)}
              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Edit asset"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => handleDelete(asset.id)}
              className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete asset"
            >
              <Trash size={15} />
            </button>
          </>
        )}
      </div>

      {/* Image Container */}
      <div className="relative bg-gray-50" style={{ height: "170px" }}>
        <ImageWithFallback
          src={getAssetImageUrl()}
          alt={asset.assetName}
          assetName={asset.assetName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getConditionStyle(
              asset.condition
            )}`}
          >
            {asset.condition}
          </span>
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
            <div className="flex items-start text-gray-600">
              <Info
                size={11}
                className="mr-1 mt-0.5 flex-shrink-0 text-gray-400"
              />
              <p className="line-clamp-2" title={asset.remark}>
                {truncate(asset.remark, 70)}
              </p>
            </div>
          )}

          {/* Project Code */}
          <div className="flex items-center text-gray-600">
            <Tag size={11} className="mr-1 flex-shrink-0 text-gray-400" />
            <span className="truncate">{asset.projectCode?.code || "N/A"}</span>
          </div>

          {/* Location */}
          <div className="flex items-start text-gray-600">
            <MapPin
              size={11}
              className="mr-1 mt-0.5 flex-shrink-0 text-gray-400"
            />
            <span className="truncate leading-tight">
              {asset.locationDesc?.description || "N/A"}
              {asset.detailsLocation?.description &&
                ` - ${truncate(asset.detailsLocation.description, 15)}`}
            </span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900 text-sm">
              {formatIDR(asset.acqValueIdr)}
            </p>

            {/* More Details Button */}
            {/* <button
              onClick={() => {
                const modal = document.getElementById(`asset_modal_${asset.id}`);
                if (modal instanceof HTMLDialogElement) {
                  modal.showModal();
                }
              }}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              More details
              <ChevronRight size={12} />
            </button> */}

            <Link
              href={`/asset/${asset.assetNo}`}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              aria-label="View asset details"
            >
              More details<ChevronRight size={12} />
            </Link>
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
    </div>
  );
};

export default CardItem;

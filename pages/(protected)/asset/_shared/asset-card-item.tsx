import React from "react";
import { Asset } from "../types";
import { Link } from "@/renderer/Link";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Pencil,
  Trash,
  Heart,
} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import { formatIDR } from "@/components/utils/formatting";
import AssetDetail from "./asset-detail";

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
  // Function to get asset image based on type
  const getAssetImage = () => {
    return `https://picsum.photos/seed/${asset.assetNo}/400/300`; // Placeholder image
  };

  // Function to truncate text
  const truncate = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-100 hover:shadow-md border-blue-500 relative ${checked ? "border-4" : "border-none"}`}>
      {/* Top Action - Favorite/Select */}
      <div className="absolute top-3 left-3 z-[1]">
        <Checkbox
          checked={checked}
          onChange={() => onSelectAsset(asset)}
          className="h-5 w-5 bg-white/80 backdrop-blur-sm rounded-full"
        />
      </div>

      {/* Image Container */}
      <div className="relative bg-gray-100 aspect-square">
        <img
          src={getAssetImage()}
          alt={asset.assetName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              asset.condition === "Good"
                ? "bg-green-500 text-white"
                : asset.condition === "Broken"
                ? "bg-red-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {asset.condition}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Product Name & ID */}
        <div className="mb-2">
          <h3 className="font-medium text-gray-900">
            {truncate(asset.assetName, 28)}
          </h3>
          <p className="text-xs text-gray-500">{asset.assetNo}</p>
        </div>

        {/* Project & Location */}
        <div className="text-xs text-gray-500 mb-3">
          <p>
            {asset.projectCode?.code || "N/A"} •{" "}
            {asset.locationDesc?.description || "N/A"}
          </p>
        </div>

        {/* Price and Action Button */}
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-900">
            {formatIDR(asset.acqValueIdr)}
          </p>

          {/* {location?.id === asset.locationDesc_id && role !== "read_only" && ( */}
            <div className="flex gap-1">
              <Link
                href={`/asset/${asset.assetNo}`}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ExternalLink size={18} />
              </Link>
              <button
                onClick={() => handleEdit(asset)}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(asset.id)}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash size={18} />
              </button>
            </div>
          {/* )} */}
        </div>

        {/* Details Toggle Button */}
        <button
        //   onClick={() => onToggle(asset.id)}
          onClick={() => document.getElementById("my_modal_2").showModal()}
          className="w-full flex items-center justify-center gap-1 mt-3 pt-2 border-t border-gray-100 text-sm text-gray-500 hover:text-blue-600"
        >
          {isExpanded ? "Less details" : "More details"}
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Expandable Asset Details */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-2 border-t border-gray-100">
            {/* <AssetDetail isExpanded={isExpanded} asset={asset} /> */}
          </div>
        </div>

     
        <dialog id="my_modal_2" className="modal ">
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

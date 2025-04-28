import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Asset } from "../types";
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
} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import { formatIDR } from "@/components/utils/formatting";
import AssetDetail from "./asset-detail";

export default function AssetItem({
  asset,
  isExpanded,
  onToggle,
  handleEdit,
  handleDelete,
  checked,
  onSelectAsset,
}: {
  asset: Asset;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
  checked: boolean;
  onSelectAsset: (asset: Asset) => void;
}) {
  return (
    <motion.div layout key={asset.id} className="w-full">
      <div className="p-0 w-full hidden md:flex flex-col">
        <div className="w-full grid grid-cols-12 ">
          <div className="col-span-4 pr-4 py-2 flex items-center gap-2">
            <div className="flex items-center">
              <Checkbox
                checked={checked}
                onChange={() => onSelectAsset(asset)}
              />
            </div>
            <div className="flex flex-col">
              <div>{asset.assetName}</div>
              <span className="text-gray-500">{asset.assetNo}</span>
            </div>
          </div>
          <div className="px-4 py-2 flex items-center">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                asset.condition === "Good"
                  ? "bg-green-50 text-green-700"
                  : asset.condition === "Broken"
                  ? "bg-red-50 text-red-700"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              {asset.condition}
            </span>
          </div>
          <div className="px-4 py-2 flex items-center">
            {asset.projectCode?.code}
          </div>
          <div className="px-4 py-2 flex items-center">
            {asset.locationDesc?.description}
          </div>
          <div className="px-4 py-2 col-span-2 flex items-center">
            {formatIDR(asset.acqValueIdr)}
          </div>
          <div className="col-span-3 px-4 py-2 flex items-center justify-end gap-2">
            <Link
              href={`/asset/${asset.assetNo}`}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ExternalLink />
            </Link>
            <button
              onClick={() => handleEdit(asset)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Pencil />
            </button>
            <button
              onClick={() => handleDelete(asset.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash />
            </button>
            <button
              onClick={() => onToggle(asset.id)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
            >
              {isExpanded ? <ChevronDown /> : <ChevronRight />}
            </button>
          </div>
        </div>
        <AssetDetail isExpanded={isExpanded} asset={asset} />
      </div>

      {/* MOBILE CARD */}
      <div className="md:hidden bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100 transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col gap-3">
          {/* Header Section */}
          <div className="flex flex-nowrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10">

              <Checkbox
                checked={checked}
                onChange={() => onSelectAsset(asset)}
                className="h-5 w-5"
                />
                </div>
              <div className="">
                <div className="font-semibold text-gray-800 text-base">
                  {asset.assetName}
                </div>
                <div className="text-xs text-gray-500">{asset.assetNo}</div>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                asset.condition === "Good"
                  ? "bg-green-100 text-green-800"
                  : asset.condition === "Broken"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {asset.condition}
            </span>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>
              <span className="font-medium text-gray-500">Project:</span>
              <p>{asset.projectCode?.code || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Location:</span>
              <p>{asset.locationDesc?.description || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-500">Value:</span>
              <p>{formatIDR(asset.acqValueIdr)}</p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex gap-2">
              <Link
                to={`/asset/${asset.assetNo}`}
                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ExternalLink size={20} />
              </Link>
              <button
                onClick={() => handleEdit(asset)}
                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => handleDelete(asset.id)}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash size={20} />
              </button>
            </div>
            <button
              onClick={() => onToggle(asset.id)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>

          {/* Expandable Asset Details */}
          <div
            className={`transition-all duration-300 ${
              isExpanded ? "block" : "hidden"
            }`}
          >
            <AssetDetail isExpanded={isExpanded} asset={asset} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

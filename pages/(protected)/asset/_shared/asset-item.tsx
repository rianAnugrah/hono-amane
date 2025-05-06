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
import { useUserStore } from "@/stores/store-user-login";
import CardItem from "./asset-card-item";

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
  return (
    <motion.div layout key={asset.id} className="w-full">
      {/* DESKTOP VIEW */}
      {currentView === "table" && (
        <div className="p-0 w-full  md:flex flex-col items-center gap-0 md:border-b md:border-x md:bg-white px-4   md:border-gray-200 relative py-0 font-bold text-xs">
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

            {location?.id === asset.locationDesc_id && role !== "read_only" && (
              // {true && (
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
            )}
          </div>
          <AssetDetail isExpanded={isExpanded} asset={asset} />
        </div>
      )}

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

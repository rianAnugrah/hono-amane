import { useState, useRef, useEffect } from "react";

import { Asset } from "../types";
import AssetItem from "./asset-item";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import Switch from "@/components/ui/switch";
// import the store

export default function AssetList({
  assets,
  handleEdit,
  handleDelete,
  handleCheckboxChange,
}: {
  assets: Asset[];
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
  handleCheckboxChange: (asset: Asset) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  // Inside the component
  const { selectedAssets, selectAsset, deselectAsset } =
    useAssetSelectionStore();
    const allSelected = assets.every((asset) =>
      selectedAssets.some((a) => a.id === asset.id)
    );
  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Simplified scrolling function
  useEffect(() => {
    if (expandedId) {
      setTimeout(() => {
        const element = itemRefs.current.get(expandedId);
        if (element) {
          // Simple approach: scroll the element into view with a specific behavior
          element.scrollIntoView({
            behavior: "smooth",
            block: "center", // This will center the element vertically
          });
        }
      }, 100); // Small delay to ensure DOM updates complete
    }
  }, [expandedId]);

  return (
    <div className="px-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(asset.id, el);
            } else {
              itemRefs.current.delete(asset.id);
            }
          }}
          className="flex items-center gap-0 border-b border-gray-200 relative py-0 font-bold text-xs"
        >
         
          <AssetItem
            asset={asset}
            isExpanded={expandedId === asset.id}
            onToggle={handleToggle}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            checked={selectedAssets.some((a) => a.id === asset.id)}
            onSelectAsset={() => handleCheckboxChange(asset)}
          />
        </div>
      ))}
    </div>
  );
}

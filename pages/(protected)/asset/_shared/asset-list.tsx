import { useState, useRef, useEffect } from "react";

import { Asset } from "../types";
import AssetItem from "./asset-item";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
// import the store

export default function AssetList({
  assets,
  handleEdit,
  handleDelete,
}: {
  assets: Asset[];
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  // Inside the component
  const { selectedAssets, selectAsset, deselectAsset } =
    useAssetSelectionStore();
  const allSelected = assets.every((asset) => selectedAssets[asset.id]);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };




  const handleCheckboxChange = (asset: Asset) => {
    if (selectedAssets[asset.id]) {
      deselectAsset(asset.id);
    } else {
      selectAsset(asset);
    }
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      assets.forEach((asset) => deselectAsset(asset.id));
    } else {
      assets.forEach((asset) => selectAsset(asset));
    }
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
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
        />
        <label className="text-sm text-gray-700">Select all on this page</label>
      </div>
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
        >
          <input
            type="checkbox"
            checked={!!selectedAssets[asset.id]}
            onChange={() => handleCheckboxChange(asset)}
          />
          <AssetItem
            asset={asset}
            isExpanded={expandedId === asset.id}
            onToggle={handleToggle}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      ))}
    </div>
  );
}

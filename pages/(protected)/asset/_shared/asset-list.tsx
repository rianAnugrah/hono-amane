import { useState, useRef, useEffect } from "react";

import { Asset } from "../types";
import AssetItem from "./asset-item";

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
    <div className="space-y-4 p-4">
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
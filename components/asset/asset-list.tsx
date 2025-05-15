import { useState, useRef, useEffect } from "react";

import { Asset } from "../../pages/(protected)/asset/types";
import AssetItem from "./asset-item";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import Switch from "@/components/ui/switch";
// import the store

export default function AssetList({
  assets,
  handleEdit,
  handleDelete,
  handleCheckboxChange,
  currentView,
  toggleSelectAll,
  isLoading
}: {
  assets: Asset[];
  currentView: string;
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
  handleCheckboxChange: (asset: Asset) => void;
  toggleSelectAll: () => void;
  isLoading: boolean;
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

  // Skeleton loader component
  const AssetSkeleton = () => (
    <div className={`${currentView === "table" ? "w-full" : "w-full"} animate-pulse`}>
      <div className="bg-gray-200 rounded-lg p-4 h-32"></div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">No assets found</h3>
      <p className="text-gray-500 mt-1 text-center">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
  );

  // Render skeletons when loading
  if (isLoading) {
    return (
      <div className={`px-4 ${currentView === "table" ? "grid grid-cols-1" : "grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4 py-4 rounded-lg"}`}>
        {Array(12).fill(0).map((_, i) => (
          <AssetSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Render empty state when no assets
  if (assets.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={`px-4 ${currentView === "table" ? "grid grid-cols-1" : "grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4 py-4 rounded-lg"}`}>
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
            currentView={currentView}
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

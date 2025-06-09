import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Asset } from "../../pages/(protected)/asset/types";
import AssetItem from "./asset-item";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { Package, Search } from "lucide-react";

export default function AssetList({
  assets,
  handleEdit,
  handleDelete,
  handleCheckboxChange,
  currentView,
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
  const { selectedAssets } = useAssetSelectionStore();
  
  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Scroll to expanded item with smooth animation
  useEffect(() => {
    if (expandedId) {
      const timeoutId = setTimeout(() => {
        const element = itemRefs.current.get(expandedId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [expandedId]);

  // Skeleton loader component with proper animation
  const AssetSkeleton = ({ index }: { index: number }) => (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden border border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="animate-pulse">
        {/* Image placeholder */}
        <div className="bg-gray-200 h-40 w-full"></div>
        
        {/* Content placeholders */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-2 bg-gray-200 rounded w-1/4"></div>
            <div className="h-2 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
          <div className="pt-2 flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Enhanced empty state with better UI
  const EmptyState = () => (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 w-full "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-full bg-gray-100 p-5 mb-4">
        <Package className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
      <p className="text-gray-500 max-w-md text-center mb-2">
        Try adjusting your search or filter criteria to find what you're looking for.
      </p>
      <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg mt-2">
        <Search className="w-4 h-4 mr-2" />
        <span>Try a different search term or clear your filters</span>
      </div>
    </motion.div>
  );



  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className={`grid ${currentView === "table" ? "grid-cols-1 gap-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"}`}>
          {Array(currentView === "table" ? 8 : 12).fill(0).map((_, i) => (
            <AssetSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (assets.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <EmptyState />
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full mx-auto sm:px-4 sm:py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        <div 
          className={`grid ${
            currentView === "table" 
              ? "grid-cols-1 gap-4" 
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          }`}
        >
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) {
                  itemRefs.current.set(asset.id, el);
                } else {
                  itemRefs.current.delete(asset.id);
                }
              }}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                layout: { duration: 0.2 }
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
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

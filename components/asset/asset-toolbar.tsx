import InputSelect from "@/components/ui/input-select";
import InputText from "@/components/ui/input-text";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, FilterX, PlusCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import Checkbox from "@/components/ui/checkbox";
import SelectedAssetsPage from "@/pages/(protected)/asset/print/+Page";
import { LocationSelector } from "@/components/blocks/location-selector";
import { useUserStore } from "@/stores/store-user-login";
import AssetViewToggle from "./asset-view-toggle";
import SlideUpModal from "@/components/blocks/slide-up-modal";

type SelectEvent = React.ChangeEvent<HTMLSelectElement> | string;
type InputEvent = React.ChangeEvent<HTMLInputElement>;

export default function AssetToolbar({
  setShowForm,
  showForm,
  search,
  handleSearchChange,
  condition,
  handleConditionChange,
  type,
  handleTypeChange,
  sortBy,
  handleSortByChange,
  sortOrder,
  handleSortOrderChange,
  toggleSelectAll,
  allSelected,
  locationDesc_id,
  handleLocationChange,
  handleResetFilters,
  currentView,
  setCurrentView,
}: {
  setShowForm: (showForm: boolean) => void;
  showForm: boolean;
  search: string;
  handleSearchChange: (e: InputEvent) => void;
  condition: string;
  handleConditionChange: (e: SelectEvent) => void;
  type: string;
  handleTypeChange: (e: SelectEvent) => void;
  locationDesc_id: string;
  handleLocationChange: (e: SelectEvent) => void;
  sortBy: string;
  handleSortByChange: (e: SelectEvent) => void;
  sortOrder: string;
  handleResetFilters: () => void;
  handleSortOrderChange: (e: SelectEvent) => void;
  toggleSelectAll: () => void;
  currentView: "table" | "card" | "compact";
  setCurrentView: (view: "table" | "card" | "compact") => void;
  allSelected: boolean;
}) {
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [showSlideUpToolbar, setShowSlideUpToolbar] = useState<boolean>(false);
  const { role } = useUserStore();

  const renderFilter = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-6 gap-4 pb-2 rounded-lg">
          {/* Filter Controls */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Location</label>
            <LocationSelector
              value={locationDesc_id}
              onChange={(value: string | number) => handleLocationChange(String(value))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Condition</label>
            <InputSelect
              onChange={handleConditionChange}
              options={[
                { value: "", label: "All Condition" },
                { value: "Good", label: "Good" },
                { value: "Broken", label: "Broken" },
                { value: "X", label: "X" },
                { value: "poor", label: "Poor" },
              ]}
              value={condition}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Type</label>
            <InputSelect
              onChange={handleTypeChange}
              options={[
                { value: "", label: "All Types" },
                { value: "HBI", label: "HBI" },
                { value: "HBM", label: "HBM" },
              ]}
              value={type}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Sort By</label>
            <InputSelect
              onChange={handleSortByChange}
              options={[
                { value: "createdAt", label: "Created Date" },
                { value: "assetNo", label: "Asset No" },
                { value: "assetName", label: "Asset Name" },
              ]}
              value={sortBy}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Sort Order</label>
            <InputSelect
              onChange={handleSortOrderChange}
              options={[
                { value: "desc", label: "Descending" },
                { value: "asc", label: "Ascending" },
              ]}
              value={sortOrder}
            />
          </div>
        </div>
        
        <motion.button
          onClick={handleResetFilters}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-1.5 text-sm shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <X className="w-4 h-4" />
          Reset Filters
        </motion.button>
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-100 border-b border-gray-200 sticky top-0 z-[100]">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-12 items-center py-4 gap-3">
          {/* Search */}
          <div className="col-span-12 md:col-span-5">
            <InputText
              value={search}
              onChange={handleSearchChange}
              icon={<Search className="text-gray-400 w-4 h-4" />}
              placeholder="Search assets by name or number..."
            />
          </div>

          {/* Filter button for mobile/desktop */}
          <div className="col-span-6 md:col-span-2 flex justify-start">
            <motion.button
              onClick={() => setShowSlideUpToolbar(!showSlideUpToolbar)}
              className="flex md:hidden items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm text-sm transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {!showSlideUpToolbar ? <SlidersHorizontal size={16} /> : <X size={16} />}
              <span>Filters</span>
            </motion.button>

            <motion.button
              onClick={() => setShowToolbar(!showToolbar)}
              className="hidden md:flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg shadow-sm text-sm transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {!showToolbar ? <SlidersHorizontal size={16} /> : <X size={16} />}
              <span>Filters</span>
            </motion.button>
          </div>

          {/* View toggles and actions */}
          <div className="col-span-6 md:col-span-5 flex items-center justify-end gap-2">
            <AssetViewToggle
              currentView={currentView}
              onChange={setCurrentView}
            />
            
            <div className="hidden md:block">
              <SelectedAssetsPage />
            </div>
            
            {role !== "read_only" && (
              <motion.button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1.5 btn btn-sm btn-primary"
                // whileHover={{ scale: 1.02 }}
                // whileTap={{ scale: 0.98 }}
              >
                <PlusCircle className="w-4 h-4" /> 
                <span className="hidden md:inline">New Asset</span>
                <span className="md:hidden">New</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Desktop filter panel */}
        <AnimatePresence>
          {showToolbar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden pb-4"
            >
              {renderFilter()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile slide-up filter panel */}
        <SlideUpModal
          modalOpen={showSlideUpToolbar}
          onToggle={setShowSlideUpToolbar}
        >
          {renderFilter()}
        </SlideUpModal>

        {/* TABLE HEADER */}
        {currentView === "table" && (
          <div className="hidden mt-4 w-full md:grid grid-cols-12 items-center font-medium text-xs bg-white px-4 py-3 text-gray-600 rounded-t-lg border border-gray-200">
            <div className="col-span-3 pr-4 flex items-center gap-2">
              <Checkbox 
                checked={allSelected} 
                onChange={toggleSelectAll} 
              />
              <span>Asset Name</span>
            </div>
            <div className="px-4 flex items-center">Condition</div>
            <div className="px-4 flex items-center">Type</div>
            <div className="px-4 flex items-center">Code</div>
            <div className="px-4 flex items-center">Location</div>
            <div className="px-4 col-span-2 flex items-center">Value</div>
            <div className="col-span-2 px-4 flex items-center justify-end gap-2">
              Options
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

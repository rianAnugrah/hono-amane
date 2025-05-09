import InputSelect from "@/components/ui/input-select";
import InputText from "@/components/ui/input-text";
import { AnimatePresence, motion } from "framer-motion";
import {
  Filter,
  FilterX,
  PlusCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import Checkbox from "@/components/ui/checkbox";
import SelectedAssetsPage from "@/pages/(protected)/asset/print/+Page";
import { LocationSelector } from "@/components/blocks/location-selector";
import { useUserStore } from "@/stores/store-user-login";
import AssetViewToggle from "./asset-view-toggle";
import SlideUpModal from "@/components/blocks/slide-up-modal";

export default function AssetToolbar({
  setShowForm,
  showForm,
  search,
  handleSearchChange,
  condition,
  handleConditionChange,
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
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  condition: string;
  handleConditionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  locationDesc_id: string;
  handleLocationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortBy: string;
  handleSortByChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOrder: string;
  handleResetFilters: () => void;
  handleSortOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  toggleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentView: "table" | "card" | "compact";
  setCurrentView: () => void;
  allSelected: any;
}) {
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [showSlideUpToolbar, setShowSlideUpToolbar] = useState<boolean>(false);
  const { role } = useUserStore();

  const renderFIlter = () => {
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-4 px-4 pt-4 pb-1 rounded-lg">
          {/* Filter Controls */}

          <div className="md:col-span-2">
            <LocationSelector
              value={locationDesc_id}
              onChange={(value: any) => handleLocationChange(value)}
            />
          </div>

          <InputSelect
            onChange={handleConditionChange}
            options={[
              { value: "", label: "All Condition" },
              { value: "Good", label: "Good" },
              { value: "Broken", label: "Broken" },
              // { value: "#N/A", label: "N/A" },
              { value: "X", label: "X" },
              { value: "poor", label: "Poor" },
            ]}
            value={condition}
          />

          <InputSelect
            onChange={handleSortByChange}
            options={[
              { value: "createdAt", label: "Sort by Created Date" },
              { value: "assetNo", label: "Sort by Asset No" },
              { value: "assetName", label: "Sort by Asset Name" },
            ]}
            value={sortBy}
          />

          <InputSelect
            onChange={handleSortOrderChange}
            options={[
              { value: "desc", label: "Descending" },
              { value: "asc", label: "Ascending" },
            ]}
            value={sortOrder}
          />
        </div>
        <button
          onClick={handleResetFilters}
          className="btn btn-lg w-[calc(100%_-_2rem)] md:w-auto md:btn-xs text-blue-400 mx-4 mb-4"
        >
          Reset Filter
        </button>
      </>
    );
  };

  return (
    <div className="bg-gray-100 z-[2] rounded-none shadow-none pb-4 md:pb-0 border-b md:border-none px-4  border-gray-300 mb-0 sticky top-0">
      <div className="flex justify-between items-center  gap-2 pt-4">
        <InputText
          value={search}
          onChange={handleSearchChange}
          icon={<Search />}
          placeholder="Search by name"
        />

        <button
          onClick={() => setShowSlideUpToolbar(!showSlideUpToolbar)}
          className="flex md:hidden btn btn-soft "
        >
          {!showSlideUpToolbar ? <Filter size={14} /> : <FilterX size={14} />}{" "}
          Filter
        </button>

        <div className="hidden md:flex flex-grow"></div>

        <button
          onClick={() => setShowToolbar(!showToolbar)}
          className="hidden md:flex btn btn-soft btn-sm"
        >
          {!showToolbar ? <Filter size={14} /> : <FilterX size={14} />} Filter
        </button>
        <div className="md:flex items-center justify-end gap-2 hidden">
          <AssetViewToggle
            currentView={currentView}
            onChange={setCurrentView}
          />
          <SelectedAssetsPage />
          {role !== "read_only" && (
            <>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn  btn-sm btn-primary"
              >
                <PlusCircle className="w-5 h-5" /> New Asset
              </button>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
            animate={{ height: "auto", opacity: 1, overflow: "visible" }}
            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border rounded-lg border-gray-200 bg-white"
          >
            {renderFIlter()}
          </motion.div>
        )}
      </AnimatePresence>

      <SlideUpModal
        modalOpen={showSlideUpToolbar}
        onToggle={setShowSlideUpToolbar}
      >
        {renderFIlter()}
      </SlideUpModal>

      {/* TABLE HEADER */}
      {currentView === "table" && (
        <div className="hidden mt-4 w-full md:grid grid-cols-12 items-center font-bold text-xs bg-white px-4 py-2 text-gray-500 rounded-t-lg border border-gray-200">
          <div className="col-span-4 pr-4 py-2 flex items-center gap-2">
            <Checkbox checked={allSelected} onChange={toggleSelectAll} />
            <InputText
              value={search}
              onChange={handleSearchChange}
              icon={<Search />}
              placeholder="Search by name"
            />
          </div>
          <div className="px-4 py-2 flex items-center">Condition</div>
          <div className="px-4 py-2 flex items-center"> Code</div>
          <div className="px-4 py-2 flex items-center">Location</div>
          <div className="px-4 py-2 col-span-2 flex items-center">Value</div>
          <div className="col-span-3 px-4 py-2 flex items-center justify-end gap-2">
            Options
          </div>
        </div>
      )}
    </div>
  );
}

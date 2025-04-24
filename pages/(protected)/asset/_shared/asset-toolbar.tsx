import InputSelect from "@/components/ui/input-select";
import InputText from "@/components/ui/input-text";
import { AnimatePresence, motion } from "framer-motion";
import {
  Filter,
  FilterX,
  PlusCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import AssetPrintButton from "./asset-print-button";
import { useResponive } from "@/components/hooks/use-responisve";
import Switch from "@/components/ui/switch";
import Checkbox from "@/components/ui/checkbox";
import SelectedAssetsPage from "@/pages/(protected)/asset/print/+Page";

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
}: {
  setShowForm: (showForm: boolean) => void;
  showForm: boolean;
  search: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  condition: string;
  handleConditionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortBy: string;
  handleSortByChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOrder: string;
  handleSortOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  toggleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allSelected: any;
}) {
  const isDesktop = useResponive();
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const shouldShowToolbar = isDesktop || showToolbar;

  return (
    <div className="bg-gray-100 z-10 rounded-none shadow-none border-b px-4  border-gray-300 mb-0 sticky top-0">
      <div className="flex justify-between items-center  gap-2 pt-4">
        <h1 className="text-lg font-bold text-gray-900 flex-grow">
          Asset list
        </h1>

        <button
          onClick={() => setShowToolbar(!showToolbar)}
          className="px-4 py-2 md:hidden  text-gray-500 rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"
        >
          {!showToolbar ? <Filter /> : <FilterX />}
        </button>
      </div>
      <AnimatePresence>
        {(shouldShowToolbar || isDesktop) && (
          <motion.div
            initial={
              isDesktop ? false : { height: 0, opacity: 0, overflow: "hidden" }
            }
            animate={
              isDesktop
                ? {}
                : { height: "auto", opacity: 1, overflow: "visible" }
            }
            exit={
              isDesktop ? {} : { height: 0, opacity: 0, overflow: "hidden" }
            }
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-0"
          >
            {/* Search Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-6  gap-4  my-4   rounded-2xl">
             
              {/* Filter Controls */}
            
                <InputSelect
                  onChange={handleConditionChange}
                  options={[
                    { value: "", label: "All" },
                    { value: "Good", label: "Good" },
                    { value: "Broken", label: "Broken" },
                  ]}
                  value={condition}
                  label="Condition"
                />

                <InputSelect
                  onChange={handleConditionChange}
                  options={[
                    { value: "", label: "All " },
                    { value: "Good", label: "Good" },
                    { value: "Broken", label: "Broken" },
                  ]}
                  value={condition}
                  label="Location"
                />

                <InputSelect
                  onChange={handleConditionChange}
                  options={[
                    { value: "", label: "All " },
                    { value: "Good", label: "Good" },
                    { value: "Broken", label: "Broken" },
                  ]}
                  value={condition}
                  label="Category"
                />

                <InputSelect
                  onChange={handleConditionChange}
                  options={[
                    { value: "", label: "All " },
                    { value: "Good", label: "Good" },
                    { value: "Broken", label: "Broken" },
                  ]}
                  value={condition}
                  label="Grade"
                />
             

            
                <InputSelect
                  onChange={handleSortByChange}
                  options={[
                    { value: "createdAt", label: "Created Date" },
                    { value: "assetNo", label: "Asset No" },
                    { value: "assetName", label: "Asset Name" },
                  ]}
                  value={sortBy}
                  label="Sort by"
                />

                <InputSelect
                  onChange={handleSortOrderChange}
                  options={[
                    { value: "desc", label: "Descending" },
                    { value: "asc", label: "Ascending" },
                  ]}
                  value={sortOrder}
                  label="Sort order"
                />
            
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE HEADER */}

      <div className="hidden w-full md:grid grid-cols-12 items-center font-bold text-xs">
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
        <div className="px-4 py-2 flex items-center">Project Code</div>
        <div className="px-4 py-2 flex items-center">Location</div>
        <div className="px-4 py-2 col-span-2 flex items-center">Value</div>
        <div className="col-span-3 px-4 py-2 flex items-center justify-end gap-2">
          {/* <AssetPrintButton /> */}
          <SelectedAssetsPage />
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle  className="w-5 h-5"/> New Asset
          </button>
        </div>
      </div>

      {/* END OF TABLE HEADER */}
    </div>
  );
}

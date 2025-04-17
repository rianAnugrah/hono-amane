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
}) {
  const [showToolbar, setShowToolbar] = useState<boolean>(false);

  return (
    <div className="bg-gray-100 z-10 rounded-none shadow-none border-b px-4 pb-4 border-gray-300 mb-0 sticky top-0">
      <div className="flex justify-between items-center  gap-2 pt-4">
        <h1 className="text-lg font-bold text-gray-900 flex-grow">Asset</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 flex items-center gap-2 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"
        >
          {/* {showForm ? "Hide Form" : "Add New Asset"} */}
          <PlusCircle /> Add New Asset
        </button>
        <button
          onClick={() => setShowToolbar(!showToolbar)}
          className="px-4 py-2  text-gray-500 rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"
        >
          {!showToolbar ? <Filter /> : <FilterX />}
        </button>
      </div>
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
            animate={{ height: "auto", opacity: 1, overflow: "visible" }} // Set a specific height in pixels
            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className=" p-0 "
            // style={{ overflow: "hidden" }}
          >
            {/* Search Bar */}
            <div className=" flex flex-col md:flex-row  gap-4 p-4 mt-4 bg-white border border-gray-200  rounded-2xl">
              <InputText
                value={search}
                onChange={handleSearchChange}
                icon={<Search />}
                placeholder="Search by name"
              />

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4  gap-4 ">
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
              </div>

              {/* Sort Controls */}
              <div className="grid grid-cols-2  gap-4 ">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

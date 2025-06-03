import { useState, useEffect } from "react";
import axios from "axios";
import { Asset } from "./types";

import AssetToolbar from "../../../components/asset/asset-toolbar";
import AssetPagination from "../../../components/asset/asset-pagination";
import AssetList from "../../../components/asset/asset-list";
import AssetFormModal from "@/components/asset/AssetFormModal";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { useUserStore } from "@/stores/store-user-login";
import { useAssetForm } from "@/hooks/useAssetForm";

const AssetCrudPage = () => {
  // Use the asset form hook for handling form state and operations
  const {
    form,
    editingId,
    showForm,
    handleChange,
    handleSubmit,
    startEdit,
    startCreate,
    handleCancel,
    setShowForm
  } = useAssetForm({ onSuccess: fetchAssets });

  // List state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [locationDesc_id, setLocationDesc_id] = useState<string>("");
  const [projectCode_id, setprojectCode_id] = useState<number | null>(null);
  const [categoryCode, setCategoryCode] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [currentView, setCurrentView] = useState<"table" | "card" | "compact">(
    "card"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { location } = useUserStore();

  //console.log("location", location);

  // Fetch assets with filters
  async function fetchAssets() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `/api/assets?page=${page}&pageSize=${pageSize}&search=${search}&locationDesc_id=${locationDesc_id}&condition=${condition}&type=${type}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (data.assets) {
        setAssets(data.assets);
        setTotalAssets(data.pagination.total);
      } else {
        // Handle direct array response
        setAssets(data);
        setTotalAssets(data.length);
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      setAssets([]);
      setTotalAssets(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [page, pageSize, search, condition, type, sortBy, sortOrder, locationDesc_id]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        await axios.delete(`/api/assets/${id}`);
        fetchAssets();
      } catch (error) {
        console.error("Failed to delete asset:", error);
      }
    }
  };

  // Filter handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement> | string) =>
    setCondition(typeof e === 'string' ? e : e.target.value);
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement> | string) =>
    setType(typeof e === 'string' ? e : e.target.value);
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement> | string) =>
    setLocationDesc_id(typeof e === 'string' ? e : e.target.value);
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement> | string) =>
    setSortBy(typeof e === 'string' ? e : e.target.value);
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement> | string) =>
    setSortOrder(typeof e === 'string' ? e : e.target.value);
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page when changing page size
  };
  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleResetFilters = () => {
    setSearch("");
    setCondition("");
    setType("");
    setLocationDesc_id("");
    setprojectCode_id(null);
    setCategoryCode("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
    setPageSize(20);
  };

  // Handle toggling the form visibility
  const handleToggleForm = (show: boolean) => {
    if (show) {
      startCreate();
    } else {
      setShowForm(false);
    }
  };

  // Inside the component
  const { selectedAssets, selectAsset, deselectAsset } =
    useAssetSelectionStore();
  const allSelected = assets.every((asset) =>
    selectedAssets.some((a) => a.id === asset.id)
  );

  const handleCheckboxChange = (asset: Asset) => {
    const isSelected = selectedAssets.some((a) => a.id === asset.id);
    if (isSelected) {
      deselectAsset(asset.id);
    } else {
      selectAsset(asset);
    }
  };

  const toggleSelectAll = (e?: React.ChangeEvent<HTMLInputElement>) => {
    const allSelected = assets.every((asset) =>
      selectedAssets.some((a) => a.id === asset.id)
    );

    if (allSelected) {
      assets.forEach((asset) => deselectAsset(asset.id));
    } else {
      assets.forEach((asset) => {
        const alreadySelected = selectedAssets.some((a) => a.id === asset.id);
        if (!alreadySelected) {
          selectAsset(asset);
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Asset Form Modal */}
      <AssetFormModal
        showForm={showForm}
        editingId={editingId}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />

      <div className="sticky top-0 z-10">
        <AssetToolbar
          setShowForm={handleToggleForm}
          showForm={showForm}
          currentView={currentView}
          setCurrentView={(view) => setCurrentView(view)}
          search={search}
          handleSearchChange={handleSearchChange}
          condition={condition}
          handleConditionChange={handleConditionChange}
          type={type}
          handleTypeChange={handleTypeChange}
          locationDesc_id={locationDesc_id}
          handleLocationChange={handleLocationChange}
          sortBy={sortBy}
          handleSortByChange={handleSortByChange}
          sortOrder={sortOrder}
          handleResetFilters={handleResetFilters}
          handleSortOrderChange={handleSortOrderChange}
          toggleSelectAll={toggleSelectAll}
          allSelected={allSelected}
        />
      </div>

      <div className="flex-grow overflow-auto bg-gray-100 pb-16">
        <AssetList
          assets={assets}
          handleEdit={startEdit}
          handleDelete={handleDelete}
          currentView={currentView}
          handleCheckboxChange={handleCheckboxChange}
          toggleSelectAll={toggleSelectAll}
          isLoading={isLoading}
        />
      </div>

      {!isLoading && assets.length > 0 && (
        <div className="relative md:sticky bottom-16 md:-bottom-0 z-10 ">
          <AssetPagination
            page={page}
            pageSize={pageSize}
            totalAssets={totalAssets}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default AssetCrudPage;

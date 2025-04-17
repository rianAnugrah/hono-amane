import { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Asset } from "./types";

import AssetToolbar from "./_shared/asset-toolbar";
import AssetForm from "./_shared/asset-form";
import AssetPagination from "./_shared/asset-pagination";
import AssetList from "./_shared/asset-list";

const AssetCrudPage = () => {
  // Form and edit state
  const [form, setForm] = useState<Partial<Asset>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // List state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalAssets, setTotalAssets] = useState<number>(0);

  // Fetch assets with filters
  const fetchAssets = async () => {
    try {
      const { data } = await axios.get(
        `/api/assets?page=${page}&pageSize=${pageSize}&search=${search}&condition=${condition}&sortBy=${sortBy}&sortOrder=${sortOrder}`
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
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [page, pageSize, search, condition, sortBy, sortOrder]);

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/assets/${editingId}`, form);
      } else {
        await axios.post("/api/assets", form);
      }
      setForm({});
      setEditingId(null);
      setShowForm(false);
      fetchAssets();
    } catch (error) {
      console.error("Failed to save asset:", error);
    }
  };

  const handleEdit = (asset: Asset) => {
    setForm(asset);
    setEditingId(asset.id);
    setShowForm(true);
  };

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
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setCondition(e.target.value);
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSortBy(e.target.value);
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSortOrder(e.target.value);
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page when changing page size
  };
  const handlePageChange = (newPage: number) => setPage(newPage);

  // Reset form
  const handleCancel = () => {
    setForm({});
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="">
      {/* Asset Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm p-6"
          >
            <AssetForm
              editingId={editingId}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              form={form}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AssetToolbar
        setShowForm={setShowForm}
        showForm={showForm}
        search={search}
        handleSearchChange={handleSearchChange}
        condition={condition}
        handleConditionChange={handleConditionChange}
        sortBy={sortBy}
        handleSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        handleSortOrderChange={handleSortOrderChange}
      />

      {/* Assets List - Card View */}
      <div className="grid grid-cols-1 mb-8">
        <AssetList
          assets={assets}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      <AssetPagination
        page={page}
        pageSize={pageSize}
        totalAssets={totalAssets}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default AssetCrudPage;
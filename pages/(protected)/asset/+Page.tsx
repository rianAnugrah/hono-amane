import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

interface Asset {
  id: string;
  projectCode: string;
  assetNo: string;
  lineNo: string;
  assetName: string;
  remark?: string | null;
  locationDesc: string;
  detailsLocation?: string | null;
  condition: string;
  pisDate: string;
  transDate: string;
  categoryCode: string;
  afeNo?: string | null;
  adjustedDepre: number;
  poNo?: string | null;
  acqValueIdr: number;
  acqValue: number;
  accumDepre: number;
  ytdDepre: number;
  bookValue: number;
  taggingYear?: string | null;
  version: number;
  isLatest: boolean;
  deletedAt?: string | null;
}

const AssetCrudPage = () => {
  // Form and edit state
  const [form, setForm] = useState<Partial<Asset>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // List state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
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
      console.error('Failed to fetch assets:', error);
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
        await axios.post('/api/assets', form);
      }
      setForm({});
      setEditingId(null);
      setShowForm(false);
      fetchAssets();
    } catch (error) {
      console.error('Failed to save asset:', error);
    }
  };

  const handleEdit = (asset: Asset) => {
    setForm(asset);
    setEditingId(asset.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      try {
        await axios.delete(`/api/assets/${id}`);
        fetchAssets();
      } catch (error) {
        console.error('Failed to delete asset:', error);
      }
    }
  };

  // Filter handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCondition(e.target.value);
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value);
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value);
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {showForm ? 'Hide Form' : 'Add New Asset'}
        </button>
      </div>

      {/* Asset Form */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-lg font-bold mb-4">
            {editingId ? 'Edit' : 'Create'} Asset
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Code</label>
              <input
                name="projectCode"
                placeholder="Project Code"
                className="border rounded px-3 py-2 w-full"
                value={form.projectCode || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Asset No</label>
              <input
                name="assetNo"
                placeholder="Asset No"
                className="border rounded px-3 py-2 w-full"
                value={form.assetNo || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Line No</label>
              <input
                name="lineNo"
                placeholder="Line No"
                className="border rounded px-3 py-2 w-full"
                value={form.lineNo || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Asset Name</label>
              <input
                name="assetName"
                placeholder="Asset Name"
                className="border rounded px-3 py-2 w-full"
                value={form.assetName || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="locationDesc"
                placeholder="Location Description"
                className="border rounded px-3 py-2 w-full"
                value={form.locationDesc || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <input
                name="condition"
                placeholder="Condition"
                className="border rounded px-3 py-2 w-full"
                value={form.condition || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PIS Date</label>
              <input
                type="date"
                name="pisDate"
                placeholder="PIS Date"
                className="border rounded px-3 py-2 w-full"
                value={form.pisDate || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transaction Date</label>
              <input
                type="date"
                name="transDate"
                placeholder="Transaction Date"
                className="border rounded px-3 py-2 w-full"
                value={form.transDate || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Create'} Asset
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="Search by asset name or number"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={condition}
              onChange={handleConditionChange}
            >
              <option value="">All Conditions</option>
              <option value="Good">Good</option>
              <option value="Broken">Broken</option>
              <option value="#N/A">#N/A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={sortBy}
              onChange={handleSortByChange}
            >
              <option value="createdAt">Created Date</option>
              <option value="assetNo">Asset No</option>
              <option value="assetName">Asset Name</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Items Per Page</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets List - Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white p-4 rounded shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className="pr-4">
                  <QRCodeCanvas value={asset.assetNo} size={72} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{asset.assetName}</h3>
                  <p className="text-sm text-gray-600">Asset No: {asset.assetNo}</p>
                  <p className="text-sm text-gray-600">Location: {asset.locationDesc}</p>
                  <p className="text-sm text-gray-600">Condition: {asset.condition}</p>
                  {asset.version && <p className="text-sm text-gray-600">Version: {asset.version}</p>}
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(asset)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow-md">
        <div>
          Showing {Math.min((page - 1) * pageSize + 1, totalAssets)} to {Math.min(page * pageSize, totalAssets)} of {totalAssets} assets
        </div>
        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300 mr-2"
          >
            Previous
          </button>
          <span className="mx-2">{`Page ${page} of ${Math.max(1, Math.ceil(totalAssets / pageSize))}`}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * pageSize >= totalAssets}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCrudPage;
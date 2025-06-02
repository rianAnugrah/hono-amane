import React, { useState, useEffect } from 'react';
import { Asset } from '../types'; // Import from parent directory
import { QRCodeCanvas } from 'qrcode.react';

const AssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalAssets, setTotalAssets] = useState<number>(0);

  const fetchAssets = async () => {
    const response = await fetch(`/api/assets?page=${page}&pageSize=${pageSize}&search=${search}&condition=${condition}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    const data = await response.json();
    if (data.assets) {
      setAssets(data.assets);
      setTotalAssets(data.pagination.total);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [page, pageSize, search, condition, sortBy, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCondition(e.target.value);
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value);
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value);
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPageSize(parseInt(e.target.value, 10));
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          className="px-4 py-2 border rounded"
          placeholder="Search by asset name"
          value={search}
          onChange={handleSearchChange}
        />
        <select
          className="px-4 py-2 ml-4 border rounded"
          value={condition}
          onChange={handleConditionChange}
        >
          <option value="">Filter by Condition</option>
          <option value="Good">Good</option>
          <option value="">#N/A</option>
          <option value="Broken">Broken</option>
        </select>
        <select
          className="px-4 py-2 ml-4 border rounded"
          value={sortBy}
          onChange={handleSortByChange}
        >
          <option value="createdAt">Sort by Created Date</option>
          <option value="assetNo">Sort by Asset No</option>
          <option value="assetName">Sort by Asset Name</option>
        </select>
        <select
          className="px-4 py-2 ml-4 border rounded"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <select
          className="px-4 py-2 ml-4 border rounded"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Asset No</th>
            <th className="px-4 py-2 border">Asset Name</th>
            <th className="px-4 py-2 border">Condition</th>
            <th className="px-4 py-2 border">QR Code</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td className="px-4 py-2 border">{asset.assetNo}</td>
              <td className="px-4 py-2 border">{asset.assetName}</td>
              <td className="px-4 py-2 border">{asset.condition}</td>
              <td className="px-4 py-2 border">
                <QRCodeCanvas value={asset.assetNo} size={64} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Previous
          </button>
          <span className="mx-2">{`Page ${page} of ${Math.ceil(totalAssets / pageSize)}`}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * pageSize >= totalAssets}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;

import { ChevronLeft, ChevronRight } from "lucide-react";

interface AssetPaginationProps {
  page: number;
  pageSize: number;
  totalAssets: number;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function AssetPagination({
  page,
  pageSize,
  totalAssets,
  handlePageChange,
  handlePageSizeChange,
}: AssetPaginationProps) {
  return (
    <div className="fixed bottom-16 md:bottom-4 w-full md:w-[calc(100vw_-_12rem)]  bg-gray-100 border-t border-gray-300 rounded-b-2xl rounded-none p-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-sm text-gray-600">
          Showing {Math.min((page - 1) * pageSize + 1, totalAssets)} to{" "}
          {Math.min(page * pageSize, totalAssets)} of {totalAssets} assets
        </div>
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <select
              className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.max(1, Math.ceil(totalAssets / pageSize))}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * pageSize >= totalAssets}
            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

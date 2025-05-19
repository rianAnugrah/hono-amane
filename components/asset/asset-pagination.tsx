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
  const totalPages = Math.max(1, Math.ceil(totalAssets / pageSize));
  
  return (
    <div className="w-full bg-gray-100 border-t border-gray-200 py-3 px-4 shadow-sm">
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Mobile view */}
        <div className="md:hidden flex w-full justify-between items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 bg-white text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-gray-300 bg-white text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Desktop view */}
        <div className="hidden md:block text-sm text-gray-600">
          Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalAssets)}</span> to{" "}
          <span className="font-medium">{Math.min(page * pageSize, totalAssets)}</span> of{" "}
          <span className="font-medium">{totalAssets}</span> assets
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 border border-gray-300 bg-white text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (page <= 3) {
                  pageNum = idx + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = page - 2 + idx;
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded-md ${
                      page === pageNum 
                        ? "bg-blue-50 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-2 border border-gray-300 bg-white text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Items per page</span>
            <select
              className="px-2 py-1 text-sm border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}




const PileSelect =({onChange, options, label}) => {

  return (
    <div className="flex flex-col gap-2">
      <div>
        {label}
      </div>
      {
        options.map((option, index) => {
            return(
                <div className="border cursor-pointer" onClick={(option) => onChange(option.value)}>
                  {option.label}
                </div>
            )
        })
      }
      <div>

</div>
    </div>
  )
}
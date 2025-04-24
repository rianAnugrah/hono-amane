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
    <div className="fixed bottom-16 md:bottom-4 py-2 w-full md:w-[calc(100vw_-_12rem)]  bg-gray-100 border-t border-gray-300 rounded-b-2xl rounded-none px-4">
      <div className="flex flex-col md:flex-row justify-between items-center  md:space-y-0">
        <div className="text-xs text-gray-600 ">
          Showing <span className="font-bold">{Math.min((page - 1) * pageSize + 1, totalAssets)}</span> to{" "}
          <span className="font-bold">{Math.min(page * pageSize, totalAssets)}</span> of {totalAssets} assets
        </div>
        <div className="flex w-max items-center gap-2">
            <p className="text-xs">Item per page</p>
            <select
              className=" px-2 py-1 text-xs border border-gray-300 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        <div className="flex justify-end items-center space-x-4 ">
          
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1s border border-gray-300 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft />
          </button>
          <span className="text-xs text-gray-600">
            Page <span className="font-bold">{page}</span> of <span className="font-bold">{Math.max(1, Math.ceil(totalAssets / pageSize))}</span>
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * pageSize >= totalAssets}
            className="px-3 py-1s border border-gray-300 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight />
          </button>
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
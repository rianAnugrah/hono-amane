import { QRCodeCanvas } from "qrcode.react";
import { Asset } from "../types";
import { AnimatePresence, motion } from "framer-motion";

export default function AssetItem({
  asset,
  isExpanded,
  onToggle,
  handleEdit,
  handleDelete,
}: {
  asset: Asset;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
}) {
  // Date formatter for consistent date display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(dateString));
  };

  // Currency formatters
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div
      key={asset.id}
      onClick={() => onToggle(asset.id)}
      className="bg-gray-100 rounded-none shadow-none border-gray-300 border-b overflow-hidden transition-transform hover:bg-blue-100"
    >
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {/* Asset Header Section */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {asset.assetName}
              </h3>
              <button
                onClick={() => onToggle(asset.id)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isExpanded ? "Hide Details" : "Show Details"}
              </button>
            </div>

            {/* Collapsible Details Section with Animation */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* QR Code Section */}
                    <div className="hidden flex-shrink-0 md:flex items-center justify-center">
                      <QRCodeCanvas
                        value={asset.assetNo}
                        size={80}
                        className="rounded-lg"
                      />
                    </div>

                    {/* Asset Details Section */}
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">ID:</span>
                          <span className="font-medium">{asset.id}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            Project Code:
                          </span>
                          <span className="font-medium">
                            {asset.projectCode}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">Asset No:</span>
                          <span className="font-medium">{asset.assetNo}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">Line No:</span>
                          <span className="font-medium">{asset.lineNo}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            Category Code:
                          </span>
                          <span className="font-medium">
                            {asset.categoryCode}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">Condition:</span>
                          <span
                            className={`font-medium px-2 py-0.5 rounded-full ${
                              asset.condition === "Good"
                                ? "bg-green-100 text-green-800"
                                : asset.condition === "Broken"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {asset.condition}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">Location:</span>
                          <span className="font-medium">
                            {asset.locationDesc}
                          </span>
                        </p>
                        {asset.detailsLocation && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="w-28 text-gray-500">
                              Detailed Location:
                            </span>
                            <span className="font-medium">
                              {asset.detailsLocation}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">PIS Date:</span>
                          <span className="font-medium">
                            {formatDate(asset.pisDate)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            Trans Date:
                          </span>
                          <span className="font-medium">
                            {formatDate(asset.transDate)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            Acq. Value IDR:
                          </span>
                          <span className="font-medium">
                            {formatIDR(asset.acqValueIdr)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            Acq. Value USD:
                          </span>
                          <span className="font-medium">
                            {formatUSD(asset.acqValue)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            Accum. Depre.:
                          </span>
                          <span className="font-medium">
                            {asset.accumDepre.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            YTD Depre.:
                          </span>
                          <span className="font-medium">
                            {asset.ytdDepre.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            Book Value:
                          </span>
                          <span className="font-medium">
                            {asset.bookValue.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">
                            Adjusted Depre.:
                          </span>
                          <span className="font-medium">
                            {asset.adjustedDepre.toLocaleString()}
                          </span>
                        </p>
                        {asset.afeNo && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="w-28 text-gray-500">AFE No:</span>
                            <span className="font-medium">{asset.afeNo}</span>
                          </p>
                        )}
                        {asset.poNo && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="w-28 text-gray-500">PO No:</span>
                            <span className="font-medium">{asset.poNo}</span>
                          </p>
                        )}
                        {asset.remark && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="w-28 text-gray-500">Remark:</span>
                            <span className="font-medium">{asset.remark}</span>
                          </p>
                        )}
                        {asset.taggingYear && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="w-28 text-gray-500">
                              Tagging Year:
                            </span>
                            <span className="font-medium">
                              {asset.taggingYear}
                            </span>
                          </p>
                        )}
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">Version:</span>
                          <span className="font-medium">{asset.version}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-28 text-gray-500">Is Latest:</span>
                          <span className="font-medium">
                            {asset.isLatest ? "Yes" : "No"}
                          </span>
                        </p>
                        {asset.deletedAt && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="w-28 text-gray-500">
                              Deleted At:
                            </span>
                            <span className="font-medium">
                              {formatDate(asset.deletedAt)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={() => handleEdit(asset)}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(asset.id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

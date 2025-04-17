import React from 'react';
import { QRCodeCanvas } from "qrcode.react";
import { Asset } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/renderer/Link";

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
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(dateString));
  };

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
    <motion.div
      layout
      key={asset.id}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden backdrop-blur-lg transition-all duration-300 hover:shadow-lg hover:border-gray-200"
    >
      <div className="p-6">
        <div className="flex flex-col gap-4">
          {/* Asset Header Section */}
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-medium text-gray-900 tracking-tight">
              {asset.assetName}
            </h3>
            <button
              onClick={() => onToggle(asset.id)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
            >
              {isExpanded ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {/* Quick Info Section */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Asset No:</span>
              <span>{asset.assetNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Location:</span>
              <span>{asset.locationDesc}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Condition:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                asset.condition === "Good"
                  ? "bg-green-50 text-green-700"
                  : asset.condition === "Broken"
                  ? "bg-red-50 text-red-700"
                  : "bg-gray-50 text-gray-700"
              }`}>
                {asset.condition}
              </span>
            </div>
          </div>

          {/* Collapsible Details Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* QR Code Section */}
                  <div className="md:col-span-2 flex items-start justify-center">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <QRCodeCanvas
                        value={asset.assetNo}
                        size={100}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <DetailItem label="Project Code" value={asset.projectCode} />
                      <DetailItem label="Line No" value={asset.lineNo} />
                      <DetailItem label="Category Code" value={asset.categoryCode} />
                      <DetailItem label="PIS Date" value={formatDate(asset.pisDate)} />
                      <DetailItem label="Trans Date" value={formatDate(asset.transDate)} />
                      <DetailItem label="Acq. Value IDR" value={formatIDR(asset.acqValueIdr)} highlight />
                      <DetailItem label="Acq. Value USD" value={formatUSD(asset.acqValue)} highlight />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      <DetailItem label="Accum. Depre." value={asset.accumDepre.toLocaleString()} />
                      <DetailItem label="YTD Depre." value={asset.ytdDepre.toLocaleString()} />
                      <DetailItem label="Book Value" value={asset.bookValue.toLocaleString()} highlight />
                      <DetailItem label="Adjusted Depre." value={asset.adjustedDepre.toLocaleString()} />
                      {asset.afeNo && <DetailItem label="AFE No" value={asset.afeNo} />}
                      {asset.poNo && <DetailItem label="PO No" value={asset.poNo} />}
                      {asset.remark && <DetailItem label="Remark" value={asset.remark} />}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <Link
              href={`/asset/${asset.assetNo}`}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View Details
            </Link>
            <button
              onClick={() => handleEdit(asset)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(asset.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper component for detail items
function DetailItem({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}
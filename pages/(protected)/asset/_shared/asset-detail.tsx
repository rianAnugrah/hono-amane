import { AnimatePresence, motion } from "framer-motion";
import { Asset } from "../types";
import { QRCodeCanvas } from "qrcode.react";
import {
  formatDate,
  formatIDR,
  formatUSD,
} from "@/components/utils/formatting";
import { ImageWithFallback, hasValidImages } from "@/components/utils/ImageUtils";

type DetailItemProps = {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
};

// Detail item component for asset properties
const DetailItem = ({ label, value, highlight }: DetailItemProps) => (
  <div className="grid grid-cols-3 gap-4 border-b border-gray-100 py-2 text-sm">
    <dt className="font-medium text-gray-500">{label}</dt>
    <dd className={`col-span-2 ${highlight ? "text-blue-700 font-semibold" : "text-gray-900"}`}>{value}</dd>
  </div>
);

export default function AssetDetail({
  isExpanded,
  asset,
}: {
  isExpanded: boolean;
  asset: Asset;
}) {
  const hasImages = hasValidImages(asset.images);
  
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden bg-white p-6 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* QR Code Section */}
            <div className="md:col-span-2 flex justify-center">
              <div className="bg-gray-100 p-4 rounded-xl shadow-inner">
                <QRCodeCanvas
                  value={asset.assetNo}
                  size={100}
                  className="rounded-lg"
                />
                <div className="text-xs text-center text-gray-500 mt-2">
                  Asset No: {asset.assetNo}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  General Info
                </h3>
                <DetailItem
                  label="Condition"
                  value={
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        asset.condition === "Good"
                          ? "bg-green-50 text-green-700"
                          : asset.condition === "Broken"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {asset.condition}
                    </span>
                  }
                />
                <DetailItem label="Project Code" value={asset.projectCode?.code || "N/A"} />
                <DetailItem label="Line No" value={asset.lineNo} />
                <DetailItem label="Category Code" value={asset.categoryCode} />
                <DetailItem label="Location" value={asset.locationDesc?.description || "N/A"} />
                <DetailItem label="Area" value={asset.detailsLocation?.description || "N/A"} />
                <DetailItem
                  label="PIS Date"
                  value={formatDate(asset.pisDate)}
                />
                <DetailItem
                  label="Trans Date"
                  value={formatDate(asset.transDate)}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Financials
                </h3>
                <DetailItem
                  label="Acq. Value IDR"
                  value={formatIDR(asset.acqValueIdr)}
                  highlight
                />
                <DetailItem
                  label="Acq. Value USD"
                  value={formatUSD(asset.acqValue)}
                  highlight
                />
                <DetailItem
                  label="Accum. Depre."
                  value={asset.accumDepre.toLocaleString()}
                />
                <DetailItem
                  label="YTD Depre."
                  value={asset.ytdDepre.toLocaleString()}
                />
                <DetailItem
                  label="Book Value"
                  value={asset.bookValue.toLocaleString()}
                  highlight
                />
                <DetailItem
                  label="Adjusted Depre."
                  value={asset.adjustedDepre.toLocaleString()}
                />
                {asset.afeNo && (
                  <DetailItem label="AFE No" value={asset.afeNo} />
                )}
                {asset.poNo && <DetailItem label="PO No" value={asset.poNo} />}
                {asset.remark && (
                  <DetailItem label="Remark" value={asset.remark} />
                )}
              </div>
            </div>
          </div>
          
          {/* Image Gallery Section */}
          {hasImages && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Asset Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {asset.images.map((image, index) => (
                  <a 
                    key={index} 
                    href={image} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors"
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${asset.assetName} - Image ${index + 1}`}
                      assetName={asset.assetName}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// pages/users/[id]/+Page.tsx
import { usePageContext } from "@/renderer/usePageContext";
import { useEffect, useState } from "react";
import { Asset } from "../types";
import { QRCodeCanvas } from "qrcode.react";
import {
  formatDate,
  formatIDR,
  formatUSD,
} from "@/components/utils/formatting";
import { 
  Calendar, 
  DollarSign, 
  Tag, 
  MapPin, 
  FileText, 
  Package, 
  Bookmark, 
  ShoppingBag,
  AlertTriangle,
  Hash,
  Calendar as CalendarIcon,
  ArrowLeft,
  Loader2,
  Download 
} from "lucide-react";
import { ImageWithFallback, hasValidImages } from "@/components/utils/ImageUtils";
import { Link } from "@/renderer/Link";
import { motion } from "framer-motion";

// Item component for displaying asset properties
const DetailItem = ({ 
  label, 
  value, 
  highlight = false,
  icon
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 group">
    {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
    <div className="flex-grow">
      <dt className="text-xs font-medium text-gray-500 mb-1">{label}</dt>
      <dd className={`${highlight ? "text-blue-600 font-semibold" : "text-gray-800"} text-sm`}>
        {value || "—"}
      </dd>
    </div>
  </div>
);

export default function AssetDetailPage() {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/assets/by-asset-number/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAsset(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching asset:", error);
        setLoading(false);
      });
  }, [id]);

  const hasImages = asset && hasValidImages(asset.images);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700">Asset not found</p>
        <Link href="/asset" className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-4">
          <ArrowLeft size={16} />
          Back to Assets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/asset" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Asset Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column: QR Code and Images */}
          <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
            {/* QR Code Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col items-center">
              <QRCodeCanvas
                value={asset.assetNo}
                size={120}
                className="rounded"
                bgColor="#f9fafb"
                fgColor="#1e40af"
                level="M"
              />
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                <Hash size={12} />
                <span className="font-mono">{asset.assetNo}</span>
              </div>
            </div>
            
            {/* Image Gallery - Vertically stacked on mobile, horizontal on desktop */}
            {hasImages && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" />
                  Asset Images
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {asset.images.map((image, index) => (
                    <a 
                      key={index} 
                      href={image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block aspect-square rounded-lg overflow-hidden border border-gray-100 hover:border-blue-300 transition-all hover:shadow-md"
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
                
                {/* View all images button if more than 4 */}
                {asset.images.length > 4 && (
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2">
                    View all {asset.images.length} images
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right column: Asset Details */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
            {/* Asset Basic Info */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-800 mb-4">Asset Information</h3>
              
              <DetailItem 
                label="Asset Name"
                value={asset.assetName}
                highlight={true}
                icon={<Bookmark size={16} />}
              />
              
              <DetailItem 
                label="Condition" 
                value={
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      asset.condition === "Good"
                        ? "bg-green-50 text-green-700"
                        : asset.condition === "Broken"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    <AlertTriangle size={12} />
                    {asset.condition}
                  </span>
                }
                icon={<AlertTriangle size={16} />}
              />
              
              <DetailItem 
                label="Project Code" 
                value={asset.projectCode?.code || "N/A"}
                icon={<Tag size={16} />}
              />
              
              <DetailItem 
                label="Line No" 
                value={asset.lineNo}
                icon={<Hash size={16} />}
              />
              
              <DetailItem 
                label="Category Code" 
                value={asset.categoryCode}
                icon={<Package size={16} />}
              />
              
              <DetailItem 
                label="Location" 
                value={asset.locationDesc?.description || "N/A"}
                icon={<MapPin size={16} />}
              />
              
              {asset.detailsLocation?.description && (
                <DetailItem 
                  label="Area" 
                  value={asset.detailsLocation.description}
                  icon={<MapPin size={16} />}
                />
              )}
              
              <DetailItem 
                label="PIS Date" 
                value={formatDate(asset.pisDate)}
                icon={<Calendar size={16} />}
              />
              
              <DetailItem 
                label="Trans Date" 
                value={formatDate(asset.transDate)}
                icon={<CalendarIcon size={16} />}
              />
              
              {asset.remark && (
                <DetailItem 
                  label="Remark" 
                  value={asset.remark}
                  icon={<FileText size={16} />}
                />
              )}
            </div>

            {/* Financial Details */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-800 mb-4">Financial Information</h3>
              
              <DetailItem 
                label="Acquisition Value (IDR)" 
                value={formatIDR(asset.acqValueIdr)}
                highlight
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="Acquisition Value (USD)" 
                value={formatUSD(asset.acqValue)}
                highlight
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="Accumulated Depreciation" 
                value={asset.accumDepre.toLocaleString()}
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="YTD Depreciation" 
                value={asset.ytdDepre.toLocaleString()}
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="Book Value" 
                value={asset.bookValue.toLocaleString()}
                highlight
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="Adjusted Depreciation" 
                value={asset.adjustedDepre.toLocaleString()}
                icon={<DollarSign size={16} />}
              />
              
              {asset.afeNo && (
                <DetailItem 
                  label="AFE No" 
                  value={asset.afeNo}
                  icon={<FileText size={16} />}
                />
              )}
              
              {asset.poNo && (
                <DetailItem 
                  label="PO No" 
                  value={asset.poNo}
                  icon={<ShoppingBag size={16} />}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

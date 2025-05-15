import React from "react";
import { 
  Bookmark, 
  AlertTriangle, 
  Tag, 
  Hash, 
  Package, 
  MapPin, 
  Calendar, 
  CalendarIcon,
  FileText
} from "lucide-react";
import { Asset } from "../../pages/(protected)/asset/types";
import DetailItem from "./DetailItem";
import { formatDate } from "@/components/utils/formatting";

// Asset basic information component
const AssetBasicInfo = ({ asset }: { asset: Asset }) => (
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
);

export default AssetBasicInfo; 
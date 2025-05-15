import React from "react";
import { DollarSign, FileText, ShoppingBag } from "lucide-react";
import { Asset } from "../../pages/(protected)/asset/types";
import DetailItem from "./DetailItem";
import { formatIDR, formatUSD } from "@/components/utils/formatting";

// Financial details component
const AssetFinancialInfo = ({ asset }: { asset: Asset }) => (
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
);

export default AssetFinancialInfo; 
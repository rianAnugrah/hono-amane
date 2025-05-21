import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Asset } from "../../pages/(protected)/asset/types";
import { formatIDR } from "@/components/utils/formatting";
import { QRCodeCanvas } from "qrcode.react";
import {
  Tag,
  Map,
  User,
  Clock,
  Info,
  DollarSign,
  Package,
  Calendar,
  Hash,
  MapPin,
  Link,
  Clipboard,
  QrCode,
  Share2,
  History,
  Layers
} from "lucide-react";

// Type for mobile view tabs
type DetailTab = 'basic' | 'financial' | 'history';

// Extend the Asset interface in the file to ensure all needed properties are available
declare module "../../pages/(protected)/asset/types" {
  interface Asset {
    createdAt?: string;
    // acqValue is already defined in the original interface
    isCapitalized?: boolean;
    isActive?: boolean;
  }
}

export default function AssetDetail({
  isExpanded,
  asset,
  showVersionHistory = false,
}: {
  isExpanded: boolean;
  asset: Asset;
  showVersionHistory?: boolean;
}) {
  if (!isExpanded) return null;

  // For mobile view tab navigation
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('basic');
  
  // Function to copy asset number to clipboard
  const copyAssetNumber = () => {
    navigator.clipboard.writeText(asset.assetNo);
    // You could add a toast notification here
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const assetDate = asset.createdAt 
    ? new Date(asset.createdAt as string).toLocaleDateString()
    : "N/A";
    
  // Asset Identity Column
  const renderAssetIdentity = () => (
    <motion.div variants={itemVariants} className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
        <Package size={16} className="mr-2" />
        Asset Identity
      </h3>
      
      {/* Asset Number with Copy Button */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-medium text-gray-500">Asset Number</h4>
          <motion.button 
            onClick={copyAssetNumber}
            className="text-blue-600 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Copy to clipboard"
          >
            <Clipboard size={14} />
          </motion.button>
        </div>
        <div className="font-mono text-sm bg-gray-50 p-2 rounded border border-gray-200 break-all">
          {asset.assetNo}
        </div>
      </div>
      
      {/* Asset Name */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="text-xs font-medium text-gray-500 mb-1">Asset Name</h4>
        <p className="text-gray-900 font-medium">{asset.assetName}</p>
      </div>
      
      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
        <div className="flex items-center justify-center mb-2">
          <QrCode size={16} className="mr-2 text-gray-500" />
          <h4 className="text-xs font-medium text-gray-500">QR Code</h4>
        </div>
        <div className="bg-white p-2 border border-gray-200 rounded-md">
          <QRCodeCanvas value={asset.assetNo} size={120} />
        </div>
      </div>
    </motion.div>
  );
  
  // Asset Details Column
  const renderAssetDetails = () => (
    <motion.div variants={itemVariants} className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
        <Info size={16} className="mr-2" />
        Asset Details
      </h3>
      
      {/* Details Grid */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          {/* Condition */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Condition</h4>
            <span 
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                asset.condition?.toLowerCase() === "good" ? "bg-green-100 text-green-700 border border-green-200" :
                asset.condition?.toLowerCase() === "broken" ? "bg-red-100 text-red-700 border border-red-200" :
                "bg-yellow-100 text-yellow-700 border border-yellow-200"
              }`}
            >
              {asset.condition || "N/A"}
            </span>
          </div>
          
          {/* Category Code */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Category</h4>
            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs border border-blue-200">
              {asset.categoryCode || "N/A"}
            </span>
          </div>
          
          {/* Created Date */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Created</h4>
            <div className="flex items-center text-gray-700 text-sm">
              <Calendar size={12} className="mr-1 text-gray-400" />
              <span>{assetDate}</span>
            </div>
          </div>
          
          {/* Project Code */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Project Code</h4>
            <div className="flex items-center text-gray-700 text-sm">
              <Tag size={12} className="mr-1 text-gray-400" />
              <span>{asset.projectCode?.code || "N/A"}</span>
            </div>
          </div>
        </div>
        
        {/* Location - Full Width */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Location</h4>
          <div className="flex items-center text-gray-700 text-sm">
            <MapPin size={12} className="mr-1 text-gray-400 flex-shrink-0" />
            <span className="line-clamp-2">
              {asset.locationDesc?.description || "N/A"}
              {asset.detailsLocation?.description && ` - ${asset.detailsLocation.description}`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Remarks Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Remarks</h4>
        <p className="text-gray-700 text-sm whitespace-pre-line">
          {asset.remark || "No remarks available"}
        </p>
      </div>
    </motion.div>
  );
  
  // Financial Information Column 
  const renderFinancialInfo = () => (
    <motion.div variants={itemVariants} className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
        <DollarSign size={16} className="mr-2" />
        Financial Information
      </h3>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        {/* Acquisition Value */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Acquisition Value (IDR)</h4>
          <p className="text-gray-900 font-semibold text-lg">
            {formatIDR(asset.acqValueIdr)}
          </p>
        </div>
        
        {/* USD Value - if available */}
        {asset.acqValue && (
          <div className="mb-4 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Acquisition Value (USD)</h4>
            <p className="text-gray-900 font-medium">
              ${asset.acqValue.toLocaleString()}
            </p>
          </div>
        )}
        
        {/* Additional Financial Details */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Capitalized</h4>
            <span 
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                asset.isCapitalized ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
              }`}
            >
              {asset.isCapitalized ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Status</h4>
            <span 
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                asset.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {asset.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Share Asset Button */}
      <motion.button 
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigator.clipboard.writeText(window.location.origin + `/asset/${asset.assetNo}`)}
      >
        <Share2 size={16} />
        Share Asset Link
      </motion.button>
    </motion.div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block w-full">
        <motion.div 
          className="px-6 py-6 bg-gray-50 border-t border-gray-200 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Asset Identity */}
            {renderAssetIdentity()}

            {/* Column 2: Details */}
            {renderAssetDetails()}

            {/* Column 3: Financial Information */}
            {renderFinancialInfo()}
          </div>
        </motion.div>
      </div>
      
      {/* Mobile View with Tabs */}
      <div className="md:hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveDetailTab('basic')}
            className={`flex-1 py-2 text-center text-xs font-medium ${
              activeDetailTab === 'basic' 
                ? 'text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-500'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <Package size={14} />
              <span>Basic Info</span>
            </div>
          </button>
          <button
            onClick={() => setActiveDetailTab('financial')}
            className={`flex-1 py-2 text-center text-xs font-medium ${
              activeDetailTab === 'financial' 
                ? 'text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-500'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <DollarSign size={14} />
              <span>Financial</span>
            </div>
          </button>
          {showVersionHistory && (
            <button
              onClick={() => setActiveDetailTab('history')}
              className={`flex-1 py-2 text-center text-xs font-medium ${
                activeDetailTab === 'history' 
                  ? 'text-blue-600 border-b-2 border-blue-500' 
                  : 'text-gray-500'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <History size={14} />
                <span>History</span>
              </div>
            </button>
          )}
        </div>
        
        {/* Tab Content with Animations */}
        <motion.div 
          className="px-2 py-4 bg-gray-50 rounded-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {activeDetailTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {renderAssetIdentity()}
                <div className="mt-6">{renderAssetDetails()}</div>
              </motion.div>
            )}
            
            {activeDetailTab === 'financial' && (
              <motion.div
                key="financial"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderFinancialInfo()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

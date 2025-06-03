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
  FileText,
  PlusCircle,
  CheckCircle,
  XCircle,
  Layers
} from "lucide-react";
import { Asset } from "../../pages/(protected)/asset/types";
import DetailItem from "./DetailItem";
import { formatDate } from "@/components/utils/formatting";
import { motion } from "framer-motion";

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

// Asset basic information component
const AssetBasicInfo = ({ asset }: { asset: Asset }) => (
  <motion.div 
    className="space-y-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {/* Section Header */}
    <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-md">
        <Package size={20} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Asset Information</h3>
        <p className="text-sm text-gray-600">Basic details and specifications</p>
      </div>
    </motion.div>
    
    {/* Asset Name - Highlighted */}
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Asset Name"
        value={
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
            <span className="text-gray-900 font-semibold text-lg">{asset.assetName}</span>
          </div>
        }
        highlight={true}
        icon={<Bookmark size={18} className="text-blue-500" />}
      />
    </motion.div>
    
    {/* Condition Status */}
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Condition Status" 
        value={
          <div className="flex items-center">
            <span
              className={`px-3 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 shadow-sm ${
                asset.condition?.toLowerCase() === "good"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : asset.condition?.toLowerCase() === "broken"
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-amber-100 text-amber-700 border border-amber-200"
              }`}
            >
              {asset.condition?.toLowerCase() === "good" ? (
                <CheckCircle size={16} />
              ) : asset.condition?.toLowerCase() === "broken" ? (
                <XCircle size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              {asset.condition}
            </span>
          </div>
        }
        icon={<AlertTriangle size={18} className="text-amber-500" />}
      />
    </motion.div>

    {/* Codes and Categories Section */}
    <motion.div variants={itemVariants} className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
        Codes & Categories
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailItem 
          label="Project Code" 
          value={
            asset.projectCode?.code ? (
              <span className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 text-sm font-medium shadow-sm">
                {asset.projectCode.code}
              </span>
            ) : (
              <span className="text-gray-500 italic text-sm bg-gray-50 px-3 py-2 rounded-lg">Not assigned</span>
            )
          }
          icon={<Tag size={16} className="text-purple-500" />}
        />
        
        <DetailItem 
          label="Category Code" 
          value={
            <span className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 text-sm font-medium shadow-sm">
              {asset.categoryCode}
            </span>
          }
          icon={<Package size={16} className="text-indigo-500" />}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailItem 
          label="Line Number" 
          value={
            <span className="font-mono text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              {asset.lineNo || "N/A"}
            </span>
          }
          icon={<Hash size={16} className="text-gray-500" />}
        />
        
        {asset.type && (
          <DetailItem 
            label="Asset Type" 
            value={
              <span className={`px-3 py-2 rounded-lg border text-sm font-medium shadow-sm ${
                asset.type === 'HBI' 
                  ? 'bg-orange-50 text-orange-700 border-orange-200' 
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}>
                {asset.type}
              </span>
            }
            icon={<Layers size={16} className="text-orange-500" />}
          />
        )}
      </div>
    </motion.div>
    
    {/* Location Information Section */}
    <motion.div variants={itemVariants} className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
        Location Details
      </h4>
      
      <DetailItem 
        label="Primary Location" 
        value={
          <div className="space-y-2">
            {asset.locationDesc?.description ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <span className="text-gray-800 font-medium">{asset.locationDesc.description}</span>
              </div>
            ) : (
              <span className="text-gray-500 italic text-sm bg-gray-50 px-3 py-2 rounded-lg">Location not specified</span>
            )}
            {asset.detailsLocation?.description && (
              <div className="bg-red-25 border border-red-100 rounded-lg p-2">
                <span className="text-sm text-red-700 flex items-center gap-2">
                  <PlusCircle size={14} />
                  <span className="font-medium">Details:</span> {asset.detailsLocation.description}
                </span>
              </div>
            )}
          </div>
        }
        icon={<MapPin size={18} className="text-red-500" />}
      />
    </motion.div>
    
    {/* Date Information Section */}
    <motion.div variants={itemVariants} className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
        Important Dates
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailItem 
          label="PIS Date" 
          value={
            formatDate(asset.pisDate) ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-800 font-medium">{formatDate(asset.pisDate)}</span>
              </div>
            ) : (
              <span className="text-gray-500 italic text-sm bg-gray-50 px-3 py-2 rounded-lg">Not available</span>
            )
          }
          icon={<Calendar size={16} className="text-blue-500" />}
        />
        
        <DetailItem 
          label="Transaction Date" 
          value={
            formatDate(asset.transDate) ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-gray-800 font-medium">{formatDate(asset.transDate)}</span>
              </div>
            ) : (
              <span className="text-gray-500 italic text-sm bg-gray-50 px-3 py-2 rounded-lg">Not available</span>
            )
          }
          icon={<CalendarIcon size={16} className="text-emerald-500" />}
        />
      </div>
    </motion.div>
    
    {/* Additional Information */}
    {asset.remark && (
      <motion.div variants={itemVariants} className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
          Additional Notes
        </h4>
        
        <DetailItem 
          label="Remarks" 
          value={
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm leading-relaxed">{asset.remark}</p>
            </div>
          }
          icon={<FileText size={18} className="text-gray-500" />}
        />
      </motion.div>
    )}
  </motion.div>
);

export default AssetBasicInfo; 
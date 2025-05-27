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
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Asset basic information component
const AssetBasicInfo = ({ asset }: { asset: Asset }) => (
  <motion.div 
    className="space-y-3"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-md text-white shadow-sm">
        <Package size={16} />
      </div>
      <h3 className="font-semibold text-gray-800">Asset Information</h3>
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Asset Name"
        value={
          <span className="text-gray-800 font-semibold">{asset.assetName}</span>
        }
        highlight={true}
        icon={<Bookmark size={16} className="text-blue-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Condition" 
        value={
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
              asset.condition?.toLowerCase() === "good"
                ? "bg-green-100 text-green-700 border border-green-200"
                : asset.condition?.toLowerCase() === "broken"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
            }`}
          >
            {asset.condition?.toLowerCase() === "good" ? (
              <CheckCircle size={12} />
            ) : asset.condition?.toLowerCase() === "broken" ? (
              <XCircle size={12} />
            ) : (
              <AlertTriangle size={12} />
            )}
            {asset.condition}
          </span>
        }
        icon={<AlertTriangle size={16} className="text-yellow-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Project Code" 
        value={
          asset.projectCode?.code ? (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-sm font-medium inline-block shadow-sm">
              {asset.projectCode.code}
            </span>
          ) : (
            <span className="text-gray-500 italic text-sm">Not assigned</span>
          )
        }
        icon={<Tag size={16} className="text-indigo-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Line No" 
        value={
          <span className="font-mono text-gray-800">{asset.lineNo || "N/A"}</span>
        }
        icon={<Hash size={16} className="text-gray-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Category Code" 
        value={
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200 text-sm font-medium inline-block shadow-sm">
            {asset.categoryCode}
          </span>
        }
        icon={<Package size={16} className="text-purple-500" />}
      />
    </motion.div>
    
    {asset.type && (
      <motion.div variants={itemVariants}>
        <DetailItem 
          label="Asset Type" 
          value={
            <span className={`px-3 py-1 rounded-md border text-sm font-medium inline-block shadow-sm ${
              asset.type === 'HBI' 
                ? 'bg-orange-50 text-orange-700 border-orange-200' 
                : 'bg-teal-50 text-teal-700 border-teal-200'
            }`}>
              {asset.type}
            </span>
          }
          icon={<Layers size={16} className="text-orange-500" />}
        />
      </motion.div>
    )}
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Location" 
        value={
          <div className="flex flex-col space-y-1">
            {asset.locationDesc?.description ? (
              <span className="text-gray-800 font-medium">{asset.locationDesc.description}</span>
            ) : (
              <span className="text-gray-500 italic text-sm">Location not specified</span>
            )}
            {asset.detailsLocation?.description && (
              <span className="text-xs text-gray-600 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block">
                <PlusCircle size={10} />
                {asset.detailsLocation.description}
              </span>
            )}
          </div>
        }
        icon={<MapPin size={16} className="text-red-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="PIS Date" 
        value={
          formatDate(asset.pisDate) ? (
            <span className="flex items-center gap-2 text-gray-800 bg-blue-50 px-3 py-1 rounded-md border border-blue-100 inline-block">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {formatDate(asset.pisDate)}
            </span>
          ) : (
            <span className="text-gray-500 italic text-sm">Not available</span>
          )
        }
        icon={<Calendar size={16} className="text-blue-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Trans Date" 
        value={
          formatDate(asset.transDate) ? (
            <span className="flex items-center gap-2 text-gray-800 bg-green-50 px-3 py-1 rounded-md border border-green-100 inline-block">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {formatDate(asset.transDate)}
            </span>
          ) : (
            <span className="text-gray-500 italic text-sm">Not available</span>
          )
        }
        icon={<CalendarIcon size={16} className="text-green-500" />}
      />
    </motion.div>
    
    {asset.remark && (
      <motion.div variants={itemVariants}>
        <DetailItem 
          label="Remark" 
          value={
            <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-700 text-sm border border-gray-200">
              {asset.remark}
            </div>
          }
          icon={<FileText size={16} className="text-gray-500" />}
        />
      </motion.div>
    )}
  </motion.div>
);

export default AssetBasicInfo; 
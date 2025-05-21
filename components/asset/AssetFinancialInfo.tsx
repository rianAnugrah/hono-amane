import React from "react";
import { DollarSign, FileText, ShoppingBag, TrendingUp, Wallet, CreditCard, Zap, Activity } from "lucide-react";
import { Asset } from "../../pages/(protected)/asset/types";
import DetailItem from "./DetailItem";
import { formatIDR, formatUSD } from "@/components/utils/formatting";
import { motion } from "framer-motion";

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
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

// Financial details component
const AssetFinancialInfo = ({ asset }: { asset: Asset }) => (
  <motion.div 
    className="space-y-3"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
      <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-md text-white shadow-sm">
        <DollarSign size={16} />
      </div>
      <h3 className="font-semibold text-gray-800">Financial Information</h3>
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Acquisition Value (IDR)" 
        value={
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-1.5 rounded-md border border-emerald-200 shadow-sm">
              <span className="font-mono font-semibold text-emerald-700">{formatIDR(asset.acqValueIdr)}</span>
              <span className="ml-2 text-xs px-2 py-0.5 bg-white text-emerald-600 rounded-full border border-emerald-200 inline-block">IDR</span>
            </div>
          </div>
        }
        highlight
        icon={<DollarSign size={16} className="text-emerald-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Acquisition Value (USD)" 
        value={
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1.5 rounded-md border border-blue-200 shadow-sm">
              <span className="font-mono font-semibold text-blue-700">{formatUSD(asset.acqValue)}</span>
              <span className="ml-2 text-xs px-2 py-0.5 bg-white text-blue-600 rounded-full border border-blue-200 inline-block">USD</span>
            </div>
          </div>
        }
        highlight
        icon={<DollarSign size={16} className="text-blue-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Accumulated Depreciation" 
        value={
          <div className="flex items-center">
            <span className="font-mono text-gray-700 bg-orange-50 px-3 py-1 rounded-md border border-orange-100">
              {asset.accumDepre.toLocaleString()}
            </span>
          </div>
        }
        icon={<TrendingUp size={16} className="text-orange-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="YTD Depreciation" 
        value={
          <div className="flex items-center">
            <span className="font-mono text-gray-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-100">
              {asset.ytdDepre.toLocaleString()}
            </span>
          </div>
        }
        icon={<Activity size={16} className="text-amber-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Book Value" 
        value={
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-1.5 rounded-md border border-indigo-200 shadow-sm">
            <span className="font-mono font-semibold text-indigo-700">{asset.bookValue.toLocaleString()}</span>
          </div>
        }
        highlight
        icon={<CreditCard size={16} className="text-indigo-500" />}
      />
    </motion.div>
    
    <motion.div variants={itemVariants}>
      <DetailItem 
        label="Adjusted Depreciation" 
        value={
          <div className="flex items-center">
            <span className="font-mono text-gray-700 bg-purple-50 px-3 py-1 rounded-md border border-purple-100">
              {asset.adjustedDepre.toLocaleString()}
            </span>
          </div>
        }
        icon={<Zap size={16} className="text-purple-500" />}
      />
    </motion.div>
    
    {asset.afeNo && (
      <motion.div variants={itemVariants}>
        <DetailItem 
          label="AFE No" 
          value={
            <span className="bg-gray-100 px-3 py-1.5 rounded-md text-gray-700 border border-gray-200 text-sm font-mono shadow-sm">
              {asset.afeNo}
            </span>
          }
          icon={<FileText size={16} className="text-gray-500" />}
        />
      </motion.div>
    )}
    
    {asset.poNo && (
      <motion.div variants={itemVariants}>
        <DetailItem 
          label="PO No" 
          value={
            <span className="bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-1.5 rounded-md text-orange-700 border border-orange-200 text-sm font-mono shadow-sm">
              {asset.poNo}
            </span>
          }
          icon={<ShoppingBag size={16} className="text-orange-500" />}
        />
      </motion.div>
    )}
  </motion.div>
);

export default AssetFinancialInfo; 
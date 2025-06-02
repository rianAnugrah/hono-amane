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
      staggerChildren: 0.06,
      delayChildren: 0.15
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

// Financial details component
const AssetFinancialInfo = ({ asset }: { asset: Asset }) => (
  <motion.div 
    className="space-y-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {/* Section Header */}
    <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-md">
        <DollarSign size={20} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Financial Information</h3>
        <p className="text-sm text-gray-600">Acquisition values and depreciation details</p>
      </div>
    </motion.div>
    
    {/* Acquisition Values Section */}
    <motion.div variants={itemVariants} className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
        Acquisition Values
      </h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DetailItem 
          label="IDR Value" 
          value={
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-emerald-800 text-lg">{formatIDR(asset.acqValueIdr)}</span>
                  <div className="text-xs text-emerald-600 mt-1">Indonesian Rupiah</div>
                </div>
                <div className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                  IDR
                </div>
              </div>
            </div>
          }
          highlight
          icon={<DollarSign size={18} className="text-emerald-500" />}
        />
        
        <DetailItem 
          label="USD Value" 
          value={
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-blue-800 text-lg">{formatUSD(asset.acqValue)}</span>
                  <div className="text-xs text-blue-600 mt-1">US Dollar</div>
                </div>
                <div className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                  USD
                </div>
              </div>
            </div>
          }
          highlight
          icon={<DollarSign size={18} className="text-blue-500" />}
        />
      </div>
    </motion.div>
    
    {/* Depreciation Information Section */}
    <motion.div variants={itemVariants} className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
        Depreciation Details
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetailItem 
          label="Accumulated" 
          value={
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
              <span className="font-mono font-semibold text-orange-800 text-sm block">
                {asset.accumDepre.toLocaleString()}
              </span>
              <span className="text-xs text-orange-600 mt-1">Total Depreciation</span>
            </div>
          }
          icon={<TrendingUp size={16} className="text-orange-500" />}
        />
        
        <DetailItem 
          label="YTD" 
          value={
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <span className="font-mono font-semibold text-amber-800 text-sm block">
                {asset.ytdDepre.toLocaleString()}
              </span>
              <span className="text-xs text-amber-600 mt-1">Year to Date</span>
            </div>
          }
          icon={<Activity size={16} className="text-amber-500" />}
        />
        
        <DetailItem 
          label="Adjusted" 
          value={
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <span className="font-mono font-semibold text-purple-800 text-sm block">
                {asset.adjustedDepre.toLocaleString()}
              </span>
              <span className="text-xs text-purple-600 mt-1">Adjustments</span>
            </div>
          }
          icon={<Zap size={16} className="text-purple-500" />}
        />
        
        <DetailItem 
          label="Book Value" 
          value={
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-3 text-center">
              <span className="font-mono font-bold text-indigo-800 text-sm block">
                {asset.bookValue.toLocaleString()}
              </span>
              <span className="text-xs text-indigo-600 mt-1">Current Value</span>
            </div>
          }
          highlight
          icon={<CreditCard size={16} className="text-indigo-500" />}
        />
      </div>
    </motion.div>

    {/* Reference Numbers Section */}
    {(asset.afeNo || asset.poNo) && (
      <motion.div variants={itemVariants} className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
          Reference Numbers
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {asset.afeNo && (
            <DetailItem 
              label="AFE Number" 
              value={
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <span className="font-mono text-gray-800 font-medium text-sm">
                    {asset.afeNo}
                  </span>
                  <div className="text-xs text-gray-600 mt-1">Authority for Expenditure</div>
                </div>
              }
              icon={<FileText size={16} className="text-gray-500" />}
            />
          )}
          
          {asset.poNo && (
            <DetailItem 
              label="PO Number" 
              value={
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <span className="font-mono text-orange-800 font-medium text-sm">
                    {asset.poNo}
                  </span>
                  <div className="text-xs text-orange-600 mt-1">Purchase Order</div>
                </div>
              }
              icon={<ShoppingBag size={16} className="text-orange-500" />}
            />
          )}
        </div>
      </motion.div>
    )}

    {/* Financial Summary Card */}
    <motion.div variants={itemVariants}>
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Wallet size={18} className="text-slate-600" />
          <h4 className="font-semibold text-slate-800">Financial Summary</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-600 mb-1">Original Cost</div>
            <div className="font-mono text-sm font-semibold text-gray-800">
              {formatUSD(asset.acqValue)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Depreciated</div>
            <div className="font-mono text-sm font-semibold text-red-600">
              -{asset.accumDepre.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Current Value</div>
            <div className="font-mono text-sm font-semibold text-green-600">
              {asset.bookValue.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Depreciation %</div>
            <div className="font-mono text-sm font-semibold text-orange-600">
              {asset.acqValue > 0 ? ((asset.accumDepre / asset.acqValue) * 100).toFixed(1) : '0'}%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default AssetFinancialInfo; 
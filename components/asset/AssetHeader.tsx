import React, { useState } from "react";
import { ArrowLeft, Download, Share2, Printer, QrCode, MoreHorizontal, X, ClipboardCheck, Camera } from "lucide-react";
import { Link } from "@/renderer/Link";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.3,
      staggerChildren: 0.05,
      delayChildren: 0.1
    } 
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

// Header component with back button and actions
const AssetHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <motion.div 
      className="flex flex-col border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            variants={buttonVariants}
          >
            <Link 
              href="/asset" 
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center"
              aria-label="Back to asset list"
            >
              <ArrowLeft size={20} />
            </Link>
          </motion.div>
          <motion.div className="flex flex-col" variants={buttonVariants}>
            <h1 className="text-lg font-semibold text-gray-900">Asset Details</h1>
            <p className="text-xs text-gray-500">View and manage asset information</p>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Menu for smaller actions - shown on mobile */}
          <div className="md:hidden">
            <motion.button
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X size={18} />
              ) : (
                <MoreHorizontal size={18} />
              )}
            </motion.button>
          </div>
          
          {/* Full actions - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            {/* QR Code button */}
            <motion.button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <QrCode size={14} />
              <span className="hidden lg:inline">QR Code</span>
            </motion.button>
            
            {/* Print button */}
            <motion.button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Printer size={14} />
              <span className="hidden lg:inline">Print</span>
            </motion.button>
            
            {/* Share button */}
            <motion.button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Share2 size={14} />
              <span className="hidden lg:inline">Share</span>
            </motion.button>
            
            {/* Export button - primary action */}
            <motion.button
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full transition-colors shadow-sm"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Download size={14} />
              Export PDF
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile actions menu - slides down when toggled */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden border-t border-gray-100 bg-gray-50"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-4 gap-1 p-2">
              <motion.button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white hover:bg-blue-50 transition-colors shadow-sm border border-gray-100 gap-1"
                whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
              >
                <QrCode size={16} className="text-blue-600" />
                <span className="text-xs text-gray-600">QR Code</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white hover:bg-blue-50 transition-colors shadow-sm border border-gray-100 gap-1"
                whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
              >
                <Printer size={16} className="text-gray-600" />
                <span className="text-xs text-gray-600">Print</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white hover:bg-blue-50 transition-colors shadow-sm border border-gray-100 gap-1"
                whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
              >
                <Camera size={16} className="text-green-600" />
                <span className="text-xs text-gray-600">Upload</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white hover:bg-blue-50 transition-colors shadow-sm border border-gray-100 gap-1"
                whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
              >
                <Share2 size={16} className="text-indigo-600" />
                <span className="text-xs text-gray-600">Share</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-white hover:bg-blue-50 transition-colors shadow-sm border border-gray-100 gap-1 col-span-2"
                whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
              >
                <ClipboardCheck size={16} className="text-amber-600" />
                <span className="text-xs text-gray-600">New Inspection</span>
              </motion.button>
              
              <motion.button
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm border border-blue-700 gap-1 col-span-2"
                whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <Download size={16} className="text-white" />
                <span className="text-xs text-white">Export PDF</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssetHeader; 
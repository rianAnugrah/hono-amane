import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { AssetPreviewCard } from './AssetPreviewCard';
import { AssetPreviewModalProps } from './types';

// PDF Preview Modal
export const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ 
  assets, 
  isOpen, 
  onClose, 
  onDownload 
}) => {
  const [columns, setColumns] = useState(2);
  const [scale, setScale] = useState(0.5);
  const [gap, setGap] = useState(20);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal when clicking on backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking inside modal
    e.stopPropagation();
  };

  const handleDownloadClick = () => {
    onDownload(columns);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" 
      style={{ backdropFilter: 'blur(2px)' }}
      onClick={handleBackdropClick}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleModalClick}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Print Preview</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-12 gap-4 p-4">
          <div className="col-span-12 md:col-span-3 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4 text-gray-700">Customize Layout</h3>
            
            {/* Column Control */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Columns: <span className="text-blue-600">{columns}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="4" 
                value={columns} 
                onChange={(e) => setColumns(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Scale Control */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scale: <span className="text-blue-600">{Math.round(scale * 100)}%</span>
              </label>
              <input 
                type="range" 
                min="0.25" 
                max="1" 
                step="0.05"
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Gap Control */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gap Size: <span className="text-blue-600">{gap}px</span>
              </label>
              <input 
                type="range" 
                min="5" 
                max="40" 
                value={gap} 
                onChange={(e) => setGap(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Download Button */}
            <button
              onClick={handleDownloadClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
          
          <div className="col-span-12 md:col-span-9 overflow-auto max-h-[60vh] p-4 bg-gray-100 rounded-lg">
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: `${gap}px`
            }}>
              {assets.map((asset, index) => (
                <div key={index} className="transform-origin-top-left bg-white">
                  <AssetPreviewCard asset={asset} scale={scale} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Use React Portal to render modal at document body level
  // Check if we're in the browser environment before using createPortal
  if (typeof window === 'undefined') {
    return null; // Don't render on server side
  }
  
  return createPortal(modalContent, document.body);
}; 
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { AssetPreviewModal } from './AssetPreviewModal';
import { printAssets } from './print-service';
import { AssetPrintButtonProps } from './types';

// Component for React use
export const AssetPrintButton: React.FC<AssetPrintButtonProps> = ({ assets }) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const handleOpenPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  };
  
  const handleClosePreview = () => setShowPreview(false);
  
  const handleDownload = (columns: number) => {
    printAssets(assets, columns);
    handleClosePreview();
  };

  useEffect(() => {
    //console.log("assets", assets);
  }, [assets]);
  
  return (
    <>
      <button 
        className="flex items-center gap-1.5 btn btn-neutral btn-soft btn-sm" 
        onClick={handleOpenPreview}
        disabled={assets.length <= 0}
      >
        <Eye size={16} className="mr-1" />
        <span>Preview</span>
        <span className="text-xs text-gray-500">({assets.length})</span>
      </button>
      
      {showPreview && (
        <AssetPreviewModal 
          assets={assets}
          isOpen={showPreview}
          onClose={handleClosePreview}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}; 
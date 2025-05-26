// utils/asset-print-utils.js
import { formatDate } from "@/components/utils/formatting";
import { Asset as BaseAsset } from "../../pages/(protected)/asset/types";
import { Document, Page, View, Text, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Eye, Download } from 'lucide-react';

// Extend the Asset type to include qrCode for PDF generation
interface Asset extends BaseAsset {
  qrCode?: string;
}

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 10,
  },
  assetsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  assetWrapper: {
    width: '48%',
    margin: '1%',
    border: '1pt solid #000',
    height: 240,
    marginBottom: 10,
  },
  topSection: {
    flexDirection: 'row',
    height: '80%',
    borderBottom: '1pt solid #000',
  },
  logoLeft: {
    width: '20%',
    padding: 10,
    borderRight: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 60,
    height: 60,
  },
  mainSection: {
    width: '60%',
    backgroundColor: '#c0d736',
    padding: 5,
    borderRight: '1pt solid #000',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    borderBottom: '1pt solid #000',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  infoItem: {
    flexDirection: 'column',
    padding: 5,
    alignItems: 'center',
  },
  infoType: {
    width: '16.66%',
    borderRight: '1pt solid #000',
  },
  infoSinas: {
    width: '50%',
    borderRight: '1pt solid #000',
  },
  infoYear: {
    width: '33.33%',
  },
  infoLabel: {
    fontSize: 7,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  descriptionRow: {
    flexDirection: 'row',
    height: '50%',
  },
  noteColumn: {
    width: '16.66%',
    padding: 5,
    borderRight: '1pt solid #000',
    alignItems: 'center',
  },
  descriptionColumn: {
    width: '83.33%',
    padding: 5,
    alignItems: 'center',
  },
  logoRight: {
    width: '20%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 60,
    height: 60,
    marginTop: 5,
  },
  warning: {
    backgroundColor: 'orange',
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
    padding: 5,
  },
});

// Generate QR Code as base64 string
const generateQRCode = async (text: string): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      margin: 0,
      width: 128,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
};

// PDF Document component with dynamic grid layout
const AssetsPDF = ({ assets, columnCount = 2 }: { assets: Asset[], columnCount?: number }) => {
  // Calculate the width percentage based on column count
  const widthPercentage = `${Math.floor(96 / columnCount)}%`;
  
  // Apply dynamic styling based on column count
  const dynamicAssetWrapper = {
    ...styles.assetWrapper,
    width: widthPercentage,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Assets Report</Text>
            <Text style={styles.subHeaderText}>Generated on: {new Date().toLocaleString()}</Text>
            <Text style={styles.subHeaderText}>Total Assets: {assets.length}</Text>
          </View>
        </View>
        <View style={styles.assetsGrid}>
          {assets.map((asset, index) => (
            <View key={index} style={dynamicAssetWrapper}>
              <View style={styles.topSection}>
                <View style={styles.logoLeft}>
                  <Text style={{ fontSize: 8, textAlign: 'center' }}>SKK MIGAS</Text>
                </View>
                <View style={styles.mainSection}>
                  <Text style={styles.title}>BARANG MILIK NEGARA</Text>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoItem, styles.infoType]}>
                      <Text style={styles.infoLabel}>Type</Text>
                      <Text style={styles.infoValue}>{asset.projectCode?.code || ''}</Text>
                    </View>
                    <View style={[styles.infoItem, styles.infoSinas]}>
                      <Text style={styles.infoLabel}>Nomor Sinas</Text>
                      <Text style={styles.infoValue}>{asset.assetNo}</Text>
                    </View>
                    <View style={[styles.infoItem, styles.infoYear]}>
                      <Text style={styles.infoLabel}>Tahun Ip</Text>
                      <Text style={styles.infoValue}>{formatDate(asset.pisDate)}</Text>
                    </View>
                  </View>
                  <View style={styles.descriptionRow}>
                    <View style={styles.noteColumn}>
                      <Text style={styles.infoLabel}>Ket :</Text>
                    </View>
                    <View style={styles.descriptionColumn}>
                      <Text style={styles.infoLabel}>Deskripsi</Text>
                      <Text style={styles.infoValue}>{asset.assetName}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.logoRight}>
                  <Text style={{ fontSize: 8, textAlign: 'center', marginBottom: 5 }}>HCML</Text>
                  {asset.qrCode && (
                    <Image 
                      src={asset.qrCode} 
                      style={styles.qrCode} 
                    />
                  )}
                </View>
              </View>
              <View style={styles.warning}>
                <Text>DILARANG MELEPAS / MENGECAT LABEL INI</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

// HTML Preview component (for the modal view)
const AssetPreviewCard = ({ asset, scale }: { asset: Asset, scale: number }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (asset.assetNo) {
      generateQRCode(asset.assetNo).then(setQrUrl);
    }
  }, [asset.assetNo]);

  return (
    <div 
      className="border border-gray-800 bg-white overflow-hidden flex flex-col"
      style={{ 
        width: `${400 * scale}px`, 
        height: `${240 * scale}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      <div className="flex flex-row h-4/5 border-b border-gray-800">
        {/* Logo Left */}
        <div className="w-1/5 border-r border-gray-800 flex items-center justify-center p-2">
          <div className="text-xs text-center font-bold">SKK MIGAS</div>
        </div>
        
        {/* Main Section */}
        <div className="w-3/5 bg-[#c0d736] border-r border-gray-800">
          <div className="border-b border-gray-800 font-bold text-center p-1 text-sm">
            BARANG MILIK NEGARA
          </div>
          
          <div className="flex border-b border-gray-800">
            <div className="w-1/6 border-r border-gray-800 p-1 text-center flex flex-col items-center">
              <span className="text-xs">Type</span>
              <span className="text-xs font-bold">{asset.projectCode?.code || ''}</span>
            </div>
            <div className="w-1/2 border-r border-gray-800 p-1 text-center flex flex-col items-center">
              <span className="text-xs">Nomor Sinas</span>
              <span className="text-xs font-bold">{asset.assetNo}</span>
            </div>
            <div className="w-1/3 p-1 text-center flex flex-col items-center">
              <span className="text-xs">Tahun Ip</span>
              <span className="text-xs font-bold">{formatDate(asset.pisDate)}</span>
            </div>
          </div>
          
          <div className="flex h-1/2">
            <div className="w-1/6 border-r border-gray-800 p-1 text-center flex flex-col items-center">
              <span className="text-xs">Ket :</span>
            </div>
            <div className="w-5/6 p-1 text-center flex flex-col items-center">
              <span className="text-xs">Deskripsi</span>
              <span className="text-xs font-bold">{asset.assetName}</span>
            </div>
          </div>
        </div>
        
        {/* Logo Right */}
        <div className="w-1/5 flex flex-col items-center justify-center p-2">
          <div className="text-xs text-center font-bold mb-2">HCML</div>
          {qrUrl && (
            <img src={qrUrl} className="w-[60px] h-[60px]" alt="QR Code" />
          )}
        </div>
      </div>
      
      {/* Warning */}
      <div className="bg-orange-400 text-red-600 font-bold text-center text-xs py-1 flex-grow flex items-center justify-center">
        DILARANG MELEPAS / MENGECAT LABEL INI
      </div>
    </div>
  );
};

// PDF Preview Modal
export const AssetPreviewModal = ({ 
  assets, 
  isOpen, 
  onClose, 
  onDownload 
}: {
  assets: Asset[],
  isOpen: boolean,
  onClose: () => void,
  onDownload: (columns: number) => void
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

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" 
      style={{ backdropFilter: 'blur(2px)' }}
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
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
              onClick={() => onDownload(columns)}
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

// Function to generate and download PDF
export const printAssets = async (assets: Asset[], columns: number = 2): Promise<void> => {
  try {
    if (!assets || assets.length === 0) {
      alert("No assets are selected for printing. Please select at least one asset.");
      return;
    }

    console.log("Generating PDF for", assets.length, "assets with", columns, "columns");
    
    // Generate QR codes for all assets
    const assetsWithQR = await Promise.all(
      assets.map(async (asset) => {
        const qrCode = await generateQRCode(asset.assetNo);
        return { ...asset, qrCode };
      })
    );
    
    // Create the PDF document
    const blob = await pdf(<AssetsPDF assets={assetsWithQR} columnCount={columns} />).toBlob();
    
    // Save the PDF file
    const fileName = `assets-report-${new Date().toISOString().split('T')[0]}.pdf`;
    saveAs(blob, fileName);
    
    console.log("PDF saved successfully:", fileName);
  } catch (error) {
    console.error("Error printing assets:", error);
    alert("There was an error printing the assets. Please try again.");
  }
};

// Component for React use
export const AssetPrintButton = ({ assets }: { assets: Asset[] }) => {
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
  
  return (
    <>
      <button 
        className="flex items-center gap-1.5 w-full h-full" 
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
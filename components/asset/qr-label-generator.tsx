import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Printer, Download, Settings, Filter, Eye } from 'lucide-react';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import { Asset } from '../../pages/(protected)/asset/types';

// Label Settings Interface
interface LabelSettings {
  width: number; // mm
  height: number; // mm
  columns: number;
  marginTop: number;
  marginLeft: number;
  spacing: number;
  showBorder: boolean;
  fontSize: number;
  qrSize: number;
  qrDataFormat: 'assetNo' | 'id' | 'custom';
  showAssetNo: boolean;
  showAssetName: boolean;
  showLocation: boolean;
  showCondition: boolean;
  showProjectCode: boolean;
  paperSize: 'A4' | 'Letter' | 'custom';
  orientation: 'portrait' | 'landscape';
}

// Filter Settings Interface
interface FilterSettings {
  condition: string[];
  projectCode: string[];
  location: string[];
}

// Default settings
const defaultSettings: LabelSettings = {
  width: 50,
  height: 30,
  columns: 4,
  marginTop: 10,
  marginLeft: 10,
  spacing: 5,
  showBorder: true,
  fontSize: 8,
  qrSize: 20,
  qrDataFormat: 'assetNo',
  showAssetNo: true,
  showAssetName: true,
  showLocation: true,
  showCondition: false,
  showProjectCode: true,
  paperSize: 'A4',
  orientation: 'portrait',
};

// QR Code Label Component
const QRLabel = ({ 
  asset, 
  settings, 
  qrCode 
}: { 
  asset: Asset; 
  settings: LabelSettings; 
  qrCode: string;
}) => {
  const labelStyle = {
    width: `${settings.width}mm`,
    height: `${settings.height}mm`,
    fontSize: `${settings.fontSize}px`,
    border: settings.showBorder ? '1px solid #000' : 'none',
  };

  const qrStyle = {
    width: `${settings.qrSize}mm`,
    height: `${settings.qrSize}mm`,
  };

  return (
    <div 
      className="bg-white flex flex-col items-center justify-center p-1 break-inside-avoid"
      style={labelStyle}
    >
      {/* QR Code */}
      <div className="flex-shrink-0 mb-1">
        {qrCode && (
          <img 
            src={qrCode} 
            alt="QR Code" 
            style={qrStyle}
            className="object-contain"
          />
        )}
      </div>

      {/* Asset Information */}
      <div className="flex-1 w-full text-center overflow-hidden">
        {settings.showAssetNo && (
          <div className="font-bold truncate" style={{ fontSize: `${settings.fontSize + 1}px` }}>
            {asset.assetNo}
          </div>
        )}
        
        {settings.showAssetName && (
          <div className="truncate leading-tight" style={{ fontSize: `${settings.fontSize}px` }}>
            {asset.assetName}
          </div>
        )}
        
        {settings.showLocation && asset.locationDesc && (
          <div className="text-gray-600 truncate" style={{ fontSize: `${settings.fontSize - 1}px` }}>
            Loc: {asset.locationDesc.description}
          </div>
        )}
        
        {settings.showProjectCode && asset.projectCode && (
          <div className="text-gray-600 truncate" style={{ fontSize: `${settings.fontSize - 1}px` }}>
            Proj: {asset.projectCode.code}
          </div>
        )}
        
        {settings.showCondition && (
          <div className="text-gray-600 truncate" style={{ fontSize: `${settings.fontSize - 1}px` }}>
            Cond: {asset.condition}
          </div>
        )}
      </div>
    </div>
  );
};

// Settings Panel Component
const SettingsPanel = ({ 
  settings, 
  onSettingsChange,
  assets,
  filteredAssets,
  onFilterChange 
}: {
  settings: LabelSettings;
  onSettingsChange: (settings: LabelSettings) => void;
  assets: Asset[];
  filteredAssets: Asset[];
  onFilterChange: (filters: FilterSettings) => void;
}) => {
  const [filters, setFilters] = useState<FilterSettings>({
    condition: [],
    projectCode: [],
    location: [],
  });

  // Get unique values for filters
  const uniqueConditions = [...new Set(assets.map(a => a.condition))];
  const uniqueProjectCodes = [...new Set(assets.map(a => a.projectCode?.code).filter(Boolean))];
  const uniqueLocations = [...new Set(assets.map(a => a.locationDesc?.description).filter(Boolean))];

  const handleFilterChange = (type: keyof FilterSettings, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters[type] = [...newFilters[type], value];
    } else {
      newFilters[type] = newFilters[type].filter(v => v !== value);
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Settings size={20} />
        Label Settings
      </h3>

      {/* Asset Filters */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Filter size={16} />
          Filter Assets ({filteredAssets.length}/{assets.length})
        </h4>
        
        {/* Condition Filter */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Condition</label>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {uniqueConditions.map(condition => (
              <label key={condition} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) => handleFilterChange('condition', condition, e.target.checked)}
                />
                {condition}
              </label>
            ))}
          </div>
        </div>

                 {/* Project Code Filter */}
         <div className="mb-3">
           <label className="block text-sm font-medium mb-1">Project Code</label>
           <div className="space-y-1 max-h-24 overflow-y-auto">
             {uniqueProjectCodes.map(code => code && (
               <label key={code} className="flex items-center text-sm">
                 <input
                   type="checkbox"
                   className="mr-2"
                   onChange={(e) => handleFilterChange('projectCode', code, e.target.checked)}
                 />
                 {code}
               </label>
             ))}
           </div>
         </div>

         {/* Location Filter */}
         <div className="mb-3">
           <label className="block text-sm font-medium mb-1">Location</label>
           <div className="space-y-1 max-h-24 overflow-y-auto">
             {uniqueLocations.map(location => location && (
               <label key={location} className="flex items-center text-sm">
                 <input
                   type="checkbox"
                   className="mr-2"
                   onChange={(e) => handleFilterChange('location', location, e.target.checked)}
                 />
                 {location}
               </label>
             ))}
           </div>
         </div>
      </div>

      {/* Label Dimensions */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Label Dimensions (mm)</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm mb-1">Width</label>
            <input
              type="number"
              value={settings.width}
              onChange={(e) => onSettingsChange({ ...settings, width: Number(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
              min="10"
              max="200"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Height</label>
            <input
              type="number"
              value={settings.height}
              onChange={(e) => onSettingsChange({ ...settings, height: Number(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
              min="10"
              max="200"
            />
          </div>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Layout</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Columns: {settings.columns}</label>
            <input
              type="range"
              min="1"
              max="8"
              value={settings.columns}
              onChange={(e) => onSettingsChange({ ...settings, columns: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Spacing: {settings.spacing}mm</label>
            <input
              type="range"
              min="0"
              max="20"
              value={settings.spacing}
              onChange={(e) => onSettingsChange({ ...settings, spacing: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* QR Code Settings */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">QR Code</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Size: {settings.qrSize}mm</label>
            <input
              type="range"
              min="10"
              max="40"
              value={settings.qrSize}
              onChange={(e) => onSettingsChange({ ...settings, qrSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Data Format</label>
            <select
              value={settings.qrDataFormat}
              onChange={(e) => onSettingsChange({ ...settings, qrDataFormat: e.target.value as any })}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="assetNo">Asset Number</option>
              <option value="id">Asset ID</option>
              <option value="custom">Custom Format</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Fields */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Display Fields</h4>
        <div className="space-y-2">
          {[
            { key: 'showAssetNo', label: 'Asset Number' },
            { key: 'showAssetName', label: 'Asset Name' },
            { key: 'showLocation', label: 'Location' },
            { key: 'showProjectCode', label: 'Project Code' },
            { key: 'showCondition', label: 'Condition' },
          ].map(field => (
            <label key={field.key} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={settings[field.key as keyof LabelSettings] as boolean}
                onChange={(e) => onSettingsChange({ 
                  ...settings, 
                  [field.key]: e.target.checked 
                })}
                className="mr-2"
              />
              {field.label}
            </label>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Typography</h4>
        <div>
          <label className="block text-sm mb-1">Font Size: {settings.fontSize}px</label>
          <input
            type="range"
            min="6"
            max="16"
            value={settings.fontSize}
            onChange={(e) => onSettingsChange({ ...settings, fontSize: Number(e.target.value) })}
            className="w-full"
          />
        </div>
        <label className="flex items-center text-sm mt-2">
          <input
            type="checkbox"
            checked={settings.showBorder}
            onChange={(e) => onSettingsChange({ ...settings, showBorder: e.target.checked })}
            className="mr-2"
          />
          Show Border
        </label>
      </div>
    </div>
  );
};

// Main QR Label Generator Component
export const QRLabelGenerator = ({ 
  assets, 
  isOpen, 
  onClose 
}: {
  assets: Asset[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [settings, setSettings] = useState<LabelSettings>(defaultSettings);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const printRef = useRef<HTMLDivElement>(null);

  // Generate QR codes for assets
  useEffect(() => {
    const generateQRCodes = async () => {
      const codes: Record<string, string> = {};
      
      for (const asset of filteredAssets) {
        try {
          let qrData = '';
          switch (settings.qrDataFormat) {
            case 'assetNo':
              qrData = asset.assetNo;
              break;
            case 'id':
              qrData = asset.id;
              break;
            case 'custom':
              qrData = `${asset.assetNo}|${asset.projectCode?.code}|${asset.locationDesc?.description}`;
              break;
          }
          
          const qrUrl = await QRCode.toDataURL(qrData, {
            margin: 1,
            width: 200,
            errorCorrectionLevel: 'M',
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          
          codes[asset.id] = qrUrl;
        } catch (error) {
          console.error('Failed to generate QR code for asset:', asset.id, error);
        }
      }
      
      setQrCodes(codes);
    };

    if (filteredAssets.length > 0) {
      generateQRCodes();
    }
  }, [filteredAssets, settings.qrDataFormat]);

  // Handle asset filtering
  const handleFilterChange = (filters: FilterSettings) => {
    let filtered = assets;

    if (filters.condition.length > 0) {
      filtered = filtered.filter(asset => filters.condition.includes(asset.condition));
    }

    if (filters.projectCode.length > 0) {
      filtered = filtered.filter(asset => 
        asset.projectCode && filters.projectCode.includes(asset.projectCode.code)
      );
    }

    if (filters.location.length > 0) {
      filtered = filtered.filter(asset => 
        asset.locationDesc && filters.location.includes(asset.locationDesc.description)
      );
    }

    setFilteredAssets(filtered);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    // This would require a PDF library like jsPDF or puppeteer
    // For now, we'll use the browser's print to PDF functionality
    window.print();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
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
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div 
        className="bg-white w-full h-full flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 print:hidden">
          <h2 className="text-xl font-bold text-gray-800">QR Label Generator</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download size={16} />
              Export PDF
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Settings Panel */}
          <div className="print:hidden">
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
              assets={assets}
              filteredAssets={filteredAssets}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto bg-gray-100 print:bg-white print:overflow-visible">
            <div 
              ref={printRef}
              className="p-4 print:p-0"
              style={{
                marginTop: `${settings.marginTop}mm`,
                marginLeft: `${settings.marginLeft}mm`,
              }}
            >
              <div 
                className="grid gap-1 print:gap-0"
                style={{
                  gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
                  gap: `${settings.spacing}mm`,
                }}
              >
                {filteredAssets.map((asset) => (
                  <QRLabel
                    key={asset.id}
                    asset={asset}
                    settings={settings}
                    qrCode={qrCodes[asset.id] || ''}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

// QR Label Print Button Component
export const QRLabelPrintButton = ({ assets }: { assets: Asset[] }) => {
  const [showGenerator, setShowGenerator] = useState(false);

  const handleOpenGenerator = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowGenerator(true);
  };

  const handleCloseGenerator = () => setShowGenerator(false);

  return (
    <>
      <button 
        className="flex items-center gap-1.5 w-full h-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition" 
        onClick={handleOpenGenerator}
        disabled={assets.length <= 0}
      >
        <Eye size={16} />
        <span>QR Labels</span>
        <span className="text-xs opacity-75">({assets.length})</span>
      </button>
      
      {showGenerator && (
        <QRLabelGenerator 
          assets={assets}
          isOpen={showGenerator}
          onClose={handleCloseGenerator}
        />
      )}
    </>
  );
};

// Print-specific CSS
const printStyles = `
  @media print {
    @page {
      margin: 0;
      size: A4;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-size: 12pt;
      line-height: 1.2;
    }
    
    .print\\:hidden {
      display: none !important;
    }
    
    .print\\:bg-white {
      background-color: white !important;
    }
    
    .print\\:overflow-visible {
      overflow: visible !important;
    }
    
    .print\\:p-0 {
      padding: 0 !important;
    }
    
    .print\\:gap-0 {
      gap: 0 !important;
    }
    
    .break-inside-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;

// Inject print styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = printStyles;
  document.head.appendChild(styleElement);
} 
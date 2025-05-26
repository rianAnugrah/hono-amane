import React, { useState } from 'react';
import { QRLabelPrintButton } from '../../../../components/asset/qr-label-generator';
import { Asset } from '../types';

// Sample asset data for demonstration
const sampleAssets: Asset[] = [
  {
    id: '1',
    assetNo: 'T1',
    lineNo: '001',
    assetName: 'Test Asset 1',
    remark: 'Sample remark',
    condition: 'Good',
    pisDate: '2024-01-15',
    transDate: '2024-01-15',
    categoryCode: 'CAT001',
    afeNo: 'AFE001',
    adjustedDepre: 1000,
    poNo: 'PO001',
    acqValueIdr: 50000000,
    acqValue: 5000,
    accumDepre: 1000,
    ytdDepre: 500,
    bookValue: 4000,
    taggingYear: '2024',
    deletedAt: null,
    isLatest: true,
    version: 1,
    projectCode_id: 1,
    locationDesc_id: 1,
    detailsLocation_id: 1,
    images: [],
    projectCode: {
      id: 1,
      code: 'Common'
    },
    locationDesc: {
      id: 1,
      description: 'Banyuwangi Office'
    },
    detailsLocation: {
      id: 1,
      description: 'Floor 1'
    }
  },
  {
    id: '2',
    assetNo: 'T2',
    lineNo: '002',
    assetName: 'Laptop Dell Inspiron 15',
    remark: 'Office equipment',
    condition: 'Excellent',
    pisDate: '2024-02-01',
    transDate: '2024-02-01',
    categoryCode: 'CAT002',
    afeNo: 'AFE002',
    adjustedDepre: 2000,
    poNo: 'PO002',
    acqValueIdr: 15000000,
    acqValue: 1500,
    accumDepre: 500,
    ytdDepre: 250,
    bookValue: 1000,
    taggingYear: '2024',
    deletedAt: null,
    isLatest: true,
    version: 1,
    projectCode_id: 2,
    locationDesc_id: 2,
    detailsLocation_id: 2,
    images: [],
    projectCode: {
      id: 2,
      code: 'IT Equipment'
    },
    locationDesc: {
      id: 2,
      description: 'Jakarta Office'
    },
    detailsLocation: {
      id: 2,
      description: 'IT Department'
    }
  },
  {
    id: '3',
    assetNo: 'T3',
    lineNo: '003',
    assetName: 'Office Chair Ergonomic',
    remark: 'Furniture',
    condition: 'Good',
    pisDate: '2024-01-20',
    transDate: '2024-01-20',
    categoryCode: 'CAT003',
    afeNo: null,
    adjustedDepre: 300,
    poNo: 'PO003',
    acqValueIdr: 2500000,
    acqValue: 250,
    accumDepre: 100,
    ytdDepre: 50,
    bookValue: 150,
    taggingYear: '2024',
    deletedAt: null,
    isLatest: true,
    version: 1,
    projectCode_id: 3,
    locationDesc_id: 3,
    detailsLocation_id: null,
    images: [],
    projectCode: {
      id: 3,
      code: 'Furniture'
    },
    locationDesc: {
      id: 3,
      description: 'Surabaya Office'
    },
    detailsLocation: null
  },
  {
    id: '4',
    assetNo: 'T4',
    lineNo: '004',
    assetName: 'Printer HP LaserJet Pro',
    remark: 'Office printer',
    condition: 'Fair',
    pisDate: '2023-12-15',
    transDate: '2023-12-15',
    categoryCode: 'CAT002',
    afeNo: 'AFE004',
    adjustedDepre: 800,
    poNo: 'PO004',
    acqValueIdr: 8000000,
    acqValue: 800,
    accumDepre: 400,
    ytdDepre: 200,
    bookValue: 400,
    taggingYear: '2023',
    deletedAt: null,
    isLatest: true,
    version: 1,
    projectCode_id: 2,
    locationDesc_id: 1,
    detailsLocation_id: 1,
    images: [],
    projectCode: {
      id: 2,
      code: 'IT Equipment'
    },
    locationDesc: {
      id: 1,
      description: 'Banyuwangi Office'
    },
    detailsLocation: {
      id: 1,
      description: 'Floor 1'
    }
  },
  {
    id: '5',
    assetNo: 'T5',
    lineNo: '005',
    assetName: 'Air Conditioner Split 1.5 PK',
    remark: 'HVAC equipment',
    condition: 'Broken',
    pisDate: '2023-11-01',
    transDate: '2023-11-01',
    categoryCode: 'CAT004',
    afeNo: 'AFE005',
    adjustedDepre: 3000,
    poNo: 'PO005',
    acqValueIdr: 12000000,
    acqValue: 1200,
    accumDepre: 600,
    ytdDepre: 300,
    bookValue: 600,
    taggingYear: '2023',
    deletedAt: null,
    isLatest: true,
    version: 1,
    projectCode_id: 4,
    locationDesc_id: 2,
    detailsLocation_id: 2,
    images: [],
    projectCode: {
      id: 4,
      code: 'HVAC'
    },
    locationDesc: {
      id: 2,
      description: 'Jakarta Office'
    },
    detailsLocation: {
      id: 2,
      description: 'IT Department'
    }
  },
  {
    id: '6',
    assetNo: 'T6',
    lineNo: '006',
    assetName: 'Whiteboard Magnetic 120x90cm',
    remark: 'Office supplies',
    condition: 'Excellent',
    pisDate: '2024-03-01',
    transDate: '2024-03-01',
    categoryCode: 'CAT005',
    afeNo: null,
    adjustedDepre: 150,
    poNo: 'PO006',
    acqValueIdr: 1500000,
    acqValue: 150,
    accumDepre: 25,
    ytdDepre: 25,
    bookValue: 125,
    taggingYear: '2024',
    deletedAt: null,
    isLatest: true,
    version: 1,
    projectCode_id: 5,
    locationDesc_id: 3,
    detailsLocation_id: null,
    images: [],
    projectCode: {
      id: 5,
      code: 'Office Supplies'
    },
    locationDesc: {
      id: 3,
      description: 'Surabaya Office'
    },
    detailsLocation: null
  }
];

export default function QRLabelsDemo() {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>(sampleAssets);

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => {
      const isSelected = prev.some(asset => asset.id === assetId);
      if (isSelected) {
        return prev.filter(asset => asset.id !== assetId);
      } else {
        const assetToAdd = sampleAssets.find(asset => asset.id === assetId);
        return assetToAdd ? [...prev, assetToAdd] : prev;
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedAssets(sampleAssets);
  };

  const handleDeselectAll = () => {
    setSelectedAssets([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Code Label Generator Demo
          </h1>
          <p className="text-gray-600">
            Generate customizable QR code labels for your assets with print-ready layouts.
          </p>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium">Customizable Layout</h3>
                <p className="text-sm text-gray-600">Adjust label size, columns, spacing, and margins</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium">Asset Filtering</h3>
                <p className="text-sm text-gray-600">Filter by condition, project code, and location</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium">QR Code Options</h3>
                <p className="text-sm text-gray-600">Choose data format and QR code size</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium">Field Selection</h3>
                <p className="text-sm text-gray-600">Show/hide asset fields on labels</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium">Print Optimized</h3>
                <p className="text-sm text-gray-600">Accurate sizing and high contrast for printing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium">Live Preview</h3>
                <p className="text-sm text-gray-600">Real-time preview before printing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Select Assets for Labeling</h2>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleAssets.map((asset) => {
              const isSelected = selectedAssets.some(selected => selected.id === asset.id);
              return (
                <div
                  key={asset.id}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAssetToggle(asset.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAssetToggle(asset.id)}
                        className="rounded"
                      />
                      <span className="font-medium text-lg">{asset.assetNo}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      asset.condition === 'Excellent' ? 'bg-green-100 text-green-700' :
                      asset.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
                      asset.condition === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {asset.condition}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{asset.assetName}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Project: {asset.projectCode?.code}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {asset.locationDesc?.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate Labels Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Generate QR Labels</h2>
              <p className="text-gray-600">
                Selected {selectedAssets.length} of {sampleAssets.length} assets
              </p>
            </div>
            <div className="w-48">
              <QRLabelPrintButton assets={selectedAssets} />
            </div>
          </div>

          {selectedAssets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Please select at least one asset to generate labels.</p>
            </div>
          )}

          {selectedAssets.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Selected Assets:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAssets.map((asset) => (
                  <span
                    key={asset.id}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {asset.assetNo} - {asset.assetName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Select the assets you want to create labels for</li>
            <li>Click "QR Labels" to open the label generator</li>
            <li>Use the settings panel to customize your labels:
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>Filter assets by condition, project, or location</li>
                <li>Adjust label dimensions (width × height in mm)</li>
                <li>Set number of columns and spacing</li>
                <li>Choose QR code size and data format</li>
                <li>Select which fields to display on labels</li>
                <li>Customize typography and borders</li>
              </ul>
            </li>
            <li>Preview your labels in real-time</li>
            <li>Click "Print" to print directly or "Export PDF" to save as PDF</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 
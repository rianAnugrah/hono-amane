import { useState, useRef, useEffect } from "react";
import { Asset } from "../types";
import AssetItem from "./asset-item";
import { motion } from "framer-motion";
import { useAssetSelectionStore } from "@/stores/asset-selection-store";


export default function AssetList({
  assets,
  handleEdit,
  handleDelete,
}: {
  assets: Asset[];
  handleEdit: (asset: Asset) => void;
  handleDelete: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  
  // Use the global selection store
  const { 
    selectedAssets, 
    selectAll, 
    deselectAll, 
    getSelectedCount 
  } = useAssetSelectionStore();

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSelectAll = () => {
    const allAssetIds = assets.map(asset => asset.id);
    const allCurrentlySelected = allAssetIds.every(id => selectedAssets.has(id));
    
    if (allCurrentlySelected) {
      // Only deselect the assets that are currently visible on this page
      allAssetIds.forEach(id => useAssetSelectionStore.getState().removeAsset(id));
    } else {
      // Select all assets on this page
      selectAll(allAssetIds);
    }
  };

  const handlePrint = () => {
    // Get all selected assets data to print
    const selectedIds = Array.from(selectedAssets);
    
    if (selectedIds.length === 0) {
      alert("Please select at least one asset to print");
      return;
    }
    
    // We need to fetch full data for all selected assets
    // This approach works even when some selected assets are not on the current page
    const findAssetById = (id: string) => {
      return assets.find(asset => asset.id === id);
    };
    
    const visibleSelectedAssets = selectedIds
      .map(findAssetById)
      .filter(asset => asset !== undefined) as Asset[];
    
    // Handle case where no selected assets are on the current page
    if (visibleSelectedAssets.length === 0) {
      alert("None of your selected assets are on the current page. Please navigate to see them or select assets on this page.");
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print");
      return;
    }

    // Create formatted content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Report</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .header { 
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eaeaea;
            }
            .date { 
              font-size: 14px; 
              color: #666;
              margin-bottom: 10px;
            }
            .asset-card { 
              border: 1px solid #eaeaea; 
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .asset-name { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eaeaea;
            }
            .asset-meta { 
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px 30px;
              margin-bottom: 15px;
            }
            .meta-item {
              display: flex;
              flex-direction: column;
            }
            .meta-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 4px;
            }
            .meta-value {
              font-size: 14px;
            }
            .highlight {
              color: #2563eb;
              font-weight: 500;
            }
            .condition {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 12px;
              font-weight: 500;
            }
            .condition-good {
              background-color: #ecfdf5;
              color: #047857;
            }
            .condition-broken {
              background-color: #fef2f2;
              color: #b91c1c;
            }
            .condition-other {
              background-color: #f3f4f6;
              color: #4b5563;
            }
            @media print {
              body { 
                font-size: 12pt; 
                line-height: 1.3;
              }
              .pagebreak { 
                page-break-before: always; 
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Assets Report</h1>
            <div class="date">Generated on: ${new Date().toLocaleString()}</div>
            <div>Total Assets Selected: ${selectedIds.length}</div>
            <div>Visible Assets in Report: ${visibleSelectedAssets.length}</div>
          </div>
          
          ${visibleSelectedAssets.map((asset, index) => `
            ${index > 0 && index % 3 === 0 ? '<div class="pagebreak"></div>' : ''}
            <div class="asset-card">
              <div class="asset-name">${asset.assetName}</div>
              <div class="asset-meta">
                <div class="meta-item">
                  <span class="meta-label">Asset No</span>
                  <span class="meta-value">${asset.assetNo}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Location</span>
                  <span class="meta-value">${asset.locationDesc}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Condition</span>
                  <span class="meta-value">
                    <span class="condition ${
                      asset.condition === "Good"
                        ? "condition-good"
                        : asset.condition === "Broken"
                        ? "condition-broken"
                        : "condition-other"
                    }">
                      ${asset.condition}
                    </span>
                  </span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Project Code</span>
                  <span class="meta-value">${asset.projectCode}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Category Code</span>
                  <span class="meta-value">${asset.categoryCode}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Line No</span>
                  <span class="meta-value">${asset.lineNo}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">PIS Date</span>
                  <span class="meta-value">${new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(asset.pisDate || new Date()))}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Trans Date</span>
                  <span class="meta-value">${new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(asset.transDate || new Date()))}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Acq. Value IDR</span>
                  <span class="meta-value highlight">${new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(asset.acqValueIdr)}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Acq. Value USD</span>
                  <span class="meta-value highlight">${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(asset.acqValue)}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Book Value</span>
                  <span class="meta-value highlight">${asset.bookValue.toLocaleString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Accum. Depre.</span>
                  <span class="meta-value">${asset.accumDepre.toLocaleString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">YTD Depre.</span>
                  <span class="meta-value">${asset.ytdDepre.toLocaleString()}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Adjusted Depre.</span>
                  <span class="meta-value">${asset.adjustedDepre.toLocaleString()}</span>
                </div>
                ${asset.afeNo ? `
                <div class="meta-item">
                  <span class="meta-label">AFE No</span>
                  <span class="meta-value">${asset.afeNo}</span>
                </div>
                ` : ''}
                ${asset.poNo ? `
                <div class="meta-item">
                  <span class="meta-label">PO No</span>
                  <span class="meta-value">${asset.poNo}</span>
                </div>
                ` : ''}
              </div>
              ${asset.remark ? `
                <div class="meta-item">
                  <span class="meta-label">Remark</span>
                  <span class="meta-value">${asset.remark}</span>
                </div>
              ` : ''}
            </div>
          `).join('')}
          <script>
            // Auto-trigger print when content is loaded
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    // Write the content to the print window and print
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Simplified scrolling function
  useEffect(() => {
    if (expandedId) {
      setTimeout(() => {
        const element = itemRefs.current.get(expandedId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, [expandedId]);

  // Check if all assets on current page are selected
  // const areAllSelected = assets.length > 0 && 
  //   assets.every(asset => selectedAssets.has(asset.id));

  return (
    <div className="space-y-6">
      {/* Selection controls and print button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              //checked={areAllSelected}
              onChange={handleSelectAll}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All on This Page
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {getSelectedCount()} total selected
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getSelectedCount() > 0 && (
            <button
              onClick={deselectAll}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={handlePrint}
            disabled={getSelectedCount() === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              getSelectedCount() === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Selected ({getSelectedCount()})
          </button>
        </div>
      </motion.div>

      {/* Assets List */}
      <div className="space-y-6 p-1">
        {assets.map((asset) => (
          <div
            key={asset.id}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(asset.id, el);
              } else {
                itemRefs.current.delete(asset.id);
              }
            }}
          >
            <AssetItem
              asset={asset}
              isExpanded={expandedId === asset.id}
              onToggle={handleToggle}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";
import { Asset } from "../types";
import AssetItem from "../_shared/asset-item";

const SelectedAssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("ids")?.split(",") || [];

    const fetchSelectedAssets = async () => {
      const { data } = await axios.get("/api/assets", {
        params: { ids },
      });
      setAssets(data.assets ?? data);
    };

    fetchSelectedAssets();
  }, []);

  const handlePrint = async () => {
    try {
      if (assets.length === 0) {
        alert(
          "No assets are selected for printing. Please select at least one asset."
        );
        return;
      }

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to print");
        return;
      }

      console.log("SELECTED_ASSETS COUNT:", assets.length);

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
              .asset-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eaeaea;
              }
              .asset-name { 
                font-size: 18px; 
                font-weight: bold; 
              }
              .qr-code {
                text-align: center;
              }
              .qr-label {
                font-size: 10px;
                color: #666;
                margin-top: 4px;
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
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
          </head>
          <body>
            <div class="header">
              <h1>Assets Report</h1>
              <div class="date">Generated on: ${new Date().toLocaleString()}</div>
              <div>Total Assets: ${assets.length}</div>
            </div>
            
            ${assets
              .map(
                (asset, index) => `
              ${
                index > 0 && index % 3 === 0
                  ? '<div class="pagebreak"></div>'
                  : ""
              }
              <div class="asset-card">
                <div class="asset-header">
                  <div class="asset-name">${asset.assetName}</div>
                  <div class="qr-code">
                    <div id="qrcode-${index}"></div>
                    <div class="qr-label">Asset No: ${asset.assetNo}</div>
                  </div>
                </div>
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
                    <span class="meta-value">${new Intl.DateTimeFormat(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }
                    ).format(new Date(asset.pisDate || new Date()))}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Trans Date</span>
                    <span class="meta-value">${new Intl.DateTimeFormat(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }
                    ).format(new Date(asset.transDate || new Date()))}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Acq. Value IDR</span>
                    <span class="meta-value highlight">${new Intl.NumberFormat(
                      "id-ID",
                      {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }
                    ).format(asset.acqValueIdr)}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Acq. Value USD</span>
                    <span class="meta-value highlight">${new Intl.NumberFormat(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    ).format(asset.acqValue)}</span>
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
                  ${
                    asset.afeNo
                      ? `
                  <div class="meta-item">
                    <span class="meta-label">AFE No</span>
                    <span class="meta-value">${asset.afeNo}</span>
                  </div>
                  `
                      : ""
                  }
                  ${
                    asset.poNo
                      ? `
                  <div class="meta-item">
                    <span class="meta-label">PO No</span>
                    <span class="meta-value">${asset.poNo}</span>
                  </div>
                  `
                      : ""
                  }
                </div>
                ${
                  asset.remark
                    ? `
                  <div class="meta-item">
                    <span class="meta-label">Remark</span>
                    <span class="meta-value">${asset.remark}</span>
                  </div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
           <script>
  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function generateQRCodes() {
    ${assets
      .map(
        (asset, index) => `
      new QRCode(document.getElementById("qrcode-${index}"), {
        text: "${asset.assetNo}",
        width: 80,
        height: 80,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    `
      )
      .join("")}

    setTimeout(function () {
      window.print();
    }, 500);
  }

  window.onload = function () {
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js", generateQRCodes);
  };
</script>

          </body>
        </html>
      `;

      // Write the content to the print window and print
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    } catch (error) {
      console.error("Error printing assets:", error);
      alert("There was an error printing the assets. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Selected Assets</h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md print:hidden"
        >
          Print
        </button>
      </div>

      <div className="space-y-4">
        {assets.map((asset) => (
          <AssetItem key={asset.id} asset={asset} isExpanded={false} />
        ))}
      </div>
    </div>
  );
};

export default SelectedAssetsPage;

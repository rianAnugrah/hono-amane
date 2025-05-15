// utils/asset-print-utils.js
import { formatDate } from "@/components/utils/formatting";
import { Asset } from "../../pages/(protected)/asset/types";

export const generateAssetItem = (asset: Asset, index: number): string => {
  return `
    <div class="asset-wrapper">
      <div class="container">
        <div class="logo-left">
          <img src="/img/skk-migas-logo.png" alt="SKK Migas Logo" class="logo-img" />
        </div>
        <div class="main-section">
          <div class="title">BARANG MILIK NEGARA</div>
          <div class="type">
            <p>Type</p>
            <p class="bold">${asset.projectCode?.code}</p>
          </div>
          <div class="sinas">
            <p>Nomor Sinas</p>
            <p class="bold">${asset.assetNo}</p>
          </div>
          <div class="year">
            <p>Tahun Ip</p>
            <p class="bold">${formatDate(asset.pisDate)}</p>
          </div>
          <div class="note">
            <p>Ket :</p>
            <p>&nbsp;</p>
          </div>
          <div class="description">
            <p>Deskripsi</p>
            <p class="bold">${asset.assetName}</p>
          </div>
        </div>
        <div class="logo-right">
          <img src="/img/hcml-logo.png" alt="HCML Logo" class="logo-img" />
        </div>
        <div class="qrcode">
          <div id="qrcode-${index}"></div>
        </div>
        <div class="warning">
          DILARANG MELEPAS / MENGECAT LABEL INI
        </div>
      </div>
    </div>
  `;
};

export const generateControls = (): string => {
  return `
    <div class="print-controls">
      <div class="control-panel">
        <h2>Print Preview</h2>
        <div class="form-group">
          <label for="scale-slider">Asset Size: <span id="scale-value">100</span>%</label>
          <input type="range" id="scale-slider" min="50" max="150" value="100" class="slider">
        </div>
        <div class="form-group">
          <label for="columns-slider">Columns: <span id="columns-value">2</span></label>
          <input type="range" id="columns-slider" min="1" max="4" value="2" class="slider">
        </div>
        <div class="form-group">
          <label for="gap-slider">Gap Size: <span id="gap-value">20</span>px</label>
          <input type="range" id="gap-slider" min="10" max="40" value="20" class="slider">
        </div>
        <div class="buttons">
          <button id="print-btn" class="btn print-btn">Print</button>
          <button id="close-btn" class="btn close-btn">Close</button>
        </div>
      </div>
    </div>
  `;
};

export const generateQRScript = (assets: Asset[], autoprint: boolean = false): string => {
  return `
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
        
        ${autoprint ? `
        setTimeout(function () {
          window.print();
        }, 500);
        ` : ''}
      }

      function setupControls() {
        const scaleSlider = document.getElementById('scale-slider');
        const scaleValue = document.getElementById('scale-value');
        const columnsSlider = document.getElementById('columns-slider');
        const columnsValue = document.getElementById('columns-value');
        const gapSlider = document.getElementById('gap-slider');
        const gapValue = document.getElementById('gap-value');
        const assetGrid = document.getElementById('asset-grid');
        const assetWrappers = document.querySelectorAll('.asset-wrapper');
        const printBtn = document.getElementById('print-btn');
        const closeBtn = document.getElementById('close-btn');
        
        function updateGrid() {
          const scale = parseFloat(scaleSlider.value) / 100;
          const columns = parseInt(columnsSlider.value);
          const gap = parseInt(gapSlider.value);
          
          // Update display values
          scaleValue.textContent = scaleSlider.value;
          columnsValue.textContent = columnsSlider.value;
          gapValue.textContent = gapSlider.value;
          
          // Update the grid layout
          assetGrid.style.gridTemplateColumns = 'repeat(' + columns + ', minmax(0, 1fr))';
          assetGrid.style.gap = gap + 'px';
          
          // Update the scale of all asset wrappers
          assetWrappers.forEach(wrapper => {
            wrapper.style.transform = 'scale(' + scale + ')';
            
            // Calculate the width needed for the wrapper at this scale
            // Original container is 800px wide
            const scaledWidth = 800 * scale;
            wrapper.style.width = scaledWidth + 'px';
            wrapper.style.height = 480 * scale + 'px';
          });
        }
        
        if (scaleSlider) {
          scaleSlider.addEventListener('input', updateGrid);
        }
        
        if (columnsSlider) {
          columnsSlider.addEventListener('input', updateGrid);
        }
        
        if (gapSlider) {
          gapSlider.addEventListener('input', updateGrid);
        }
        
        if (printBtn) {
          printBtn.addEventListener('click', function() {
            document.querySelector('.print-controls').style.display = 'none';
            window.print();
            document.querySelector('.print-controls').style.display = 'flex';
          });
        }
        
        if (closeBtn) {
          closeBtn.addEventListener('click', function() {
            window.close();
          });
        }
        
        // Initialize grid
        updateGrid();
      }

      window.onload = function () {
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js", function() {
          generateQRCodes();
          setupControls();
        });
      };
    </script>
  `;
};

export const getCSSStyles = (): string => {
  return `
    <style>
      body {
        font-family: sans-serif;
        height: auto;
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
      }

      #asset-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
        padding: 20px;
        width: 100%;
        box-sizing: border-box;
      }

      .asset-wrapper {
        transform-origin: top left;
        width: 800px;
        height: 480px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        overflow: visible;
      }

      .container {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(5, 1fr);
        width: 800px;
        height: 480px;
        border: 1px solid #000;
      }

      .content-wrapper {
        padding: 20px;
      }

      .logo-left {
        grid-column: span 2;
        grid-row: span 4;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid black;
        border-left: 1px solid black;
        border-bottom: 1px solid black;
      }

      .logo-img {
        width: 6rem;
      }

      .main-section {
        grid-column: span 6;
        grid-row: span 4;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(3, 1fr);
        background-color: #c0d736;
        border: 1px solid black;
      }

      .title {
        grid-column: span 5;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: bold;
      }

      .type {
        grid-column: span 1;
        border-bottom: 1px solid black;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }

      .sinas {
        grid-column: span 3;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }

      .year {
        grid-column: span 2;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }

      .note {
        grid-column: span 1;
        grid-row: span 2;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }

      .description {
        grid-column: span 5;
        border-right: 1px solid black;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }

      .logo-right {
        grid-column: span 2;
        grid-row: span 2;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
      }

      .qrcode {
        grid-column: span 2;
        grid-row: span 2;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .qr-img {
        width: 100px;
        border-radius: 0.5rem;
      }

      .warning {
        grid-column: span 10;
        background-color: orange;
        color: red;
        text-align: center;
        font-weight: bold;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
      }
      .bold {
        font-weight: bold;
      }

      .print-controls {
        position: sticky;
        top: 0;
        width: 100%;
        background-color: #f5f5f5;
        display: flex;
        justify-content: center;
        padding: 15px 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 100;
      }

      .control-panel {
        width: 90%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .slider {
        width: 100%;
        height: 25px;
      }

      .buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }

      .btn {
        padding: 8px 16px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        font-weight: bold;
      }

      .print-btn {
        background-color: #4CAF50;
        color: white;
      }

      .close-btn {
        background-color: #f44336;
        color: white;
      }

      .header {
        margin-bottom: 30px;
      }

      @media print {
        body { 
          font-size: 12pt; 
          line-height: 1.3;
        }
        .pagebreak { 
          page-break-before: always; 
        }
        .print-controls {
          display: none !important;
        }
      }
    </style>
  `;
};

export const generatePrintContent = (assets: Asset[]): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Asset Report</title>
        ${getCSSStyles()}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
      </head>
      <body>
        ${generateControls()}
        
        <div class="content-wrapper">
          <div class="header">
            <h1>Assets Report</h1>
            <div class="date">Generated on: ${new Date().toLocaleString()}</div>
            <div>Total Assets: ${assets.length}</div>
          </div>
          
          <div id="asset-grid">
            ${assets.map((asset, index) => generateAssetItem(asset, index)).join("")}
          </div>
        </div>
        
        ${generateQRScript(assets, false)}
      </body>
    </html>
  `;
};

export const printAssets = (assets: Asset[]): void => {
  try {
    if (!assets || assets.length === 0) {
      alert("No assets are selected for printing. Please select at least one asset.");
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
    const printContent = generatePrintContent(assets);

    // Write the content to the print window and print
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  } catch (error) {
    console.error("Error printing assets:", error);
    alert("There was an error printing the assets. Please try again.");
  }
};
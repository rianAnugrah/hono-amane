// utils/asset-print-utils.js
import { formatDate } from "@/components/utils/formatting";

export const generateAssetItem = (asset, index) => {
  return `
    ${index > 0 && index % 3 === 0 ? '<div class="pagebreak"></div>' : ""}
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
  `;
};

export const generateQRScript = (assets) => {
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

        setTimeout(function () {
          window.print();
        }, 500);
      }

      window.onload = function () {
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js", generateQRCodes);
      };
    </script>
  `;
};

export const getCSSStyles = () => {
  return `
    <style>
      body {
        font-family: sans-serif;
        height: auto;
        display:flex;
        flex-direction : column;
      }

      .container {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(5, 1fr);
        width: 800px;
        height: 480px;
        border: 1px solid #000;
        margin-bottom : 16px;
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
  `;
};

export const generatePrintContent = (assets) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Asset Report</title>
        ${getCSSStyles()}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
      </head>
      <body>
        <div class="header">
          <h1>Assets Report</h1>
          <div class="date">Generated on: ${new Date().toLocaleString()}</div>
          <div>Total Assets: ${assets.length}</div>
        </div>
        
        ${assets.map((asset, index) => generateAssetItem(asset, index)).join("")}
        
        ${generateQRScript(assets)}
      </body>
    </html>
  `;
};

export const printAssets = (assets) => {
  try {
    if (assets.length === 0) {
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
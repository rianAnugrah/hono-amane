import { useEffect, useState } from "react";
import axios from "axios";

import { formatDate } from "@/components/utils/formatting";
import { Asset } from "../(protected)/asset/types";
import AssetPrintItem from "../../components/asset/asset-print-item";

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

      //console.log("SELECTED_ASSETS COUNT:", assets.length);

      // Create formatted content for printing
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Asset Report</title>
            <style>
body {
  font-family: sans-serif;
}

.container {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(5, 1fr);
  width: 600px;
  height: 320px;
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
    } catch (error: unknown) {
      console.error("Error printing assets:", error);
      alert("There was an error printing the assets. Please try again.");
    }
  };

  const handlePrintNew = () => {
    window.print();
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Selected Assets</h1>
        <button
          onClick={handlePrintNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md print:hidden"
        >
          Print New
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md print:hidden"
        >
          Print Legacy
        </button>
      </div>

      <div className="space-y-4" id="printable-div">
        {assets.map((asset) => (
          <AssetPrintItem key={asset.id} asset={asset} isExpanded={false} />
        ))}
      </div>
    </div>
  );
};

export default SelectedAssetsPage;

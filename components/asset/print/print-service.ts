import { generateQRCode } from './qr-utils';
import { validateAssetsForPrint } from './pdf-utils';
import { Asset } from './types';

// Function to generate and download PDF
export const printAssets = async (assets: Asset[], columns: number = 2): Promise<void> => {
  try {
    if (!validateAssetsForPrint(assets)) {
      return;
    }

    //console.log("Generating PDF for", assets.length, "assets with", columns, "columns");
    
    // Generate QR codes for all assets
    const assetsWithQR = await Promise.all(
      assets.map(async (asset) => {
        const qrCode = await generateQRCode(asset.assetNo);
        return { ...asset, qrCode };
      })
    );
    
    // Dynamic import to avoid SSR issues and type conflicts
    const { pdf } = await import('@react-pdf/renderer');
    const { saveAs } = await import('file-saver');
    const React = await import('react');
    const { AssetsPDF } = await import('./AssetsPDF');
    
    // Create the PDF document
    const pdfDocument = React.createElement(AssetsPDF, { assets: assetsWithQR, columnCount: columns });
    const blob = await pdf(pdfDocument as React.ReactElement).toBlob();
    
    // Save the PDF file
    const fileName = `assets-report-${new Date().toISOString().split('T')[0]}.pdf`;
    saveAs(blob, fileName);
    
    //console.log("PDF saved successfully:", fileName);
  } catch (error) {
    console.error("Error printing assets:", error);
    alert("There was an error printing the assets. Please try again.");
  }
}; 
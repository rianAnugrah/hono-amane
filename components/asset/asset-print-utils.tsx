// Legacy file - components have been moved to ./print/ directory
// This file is kept for backward compatibility

// Re-export everything from the new modular structure
export {
  AssetPrintButton,
  AssetPreviewModal,
  AssetPreviewCard,
  AssetsPDF,
  printAssets,
  generateQRCode,
  getWidthPercentage,
  validateAssetsForPrint,
  pdfStyles
} from './print';

export type {
  Asset,
  AssetPreviewModalProps,
  AssetPreviewCardProps,
  AssetsPDFProps,
  AssetPrintButtonProps
} from './print';
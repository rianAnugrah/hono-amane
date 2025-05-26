import { Asset as BaseAsset } from "../../../pages/(protected)/asset/types";

// Extend the Asset type to include qrCode for PDF generation
export interface Asset extends BaseAsset {
  qrCode?: string;
}

export interface AssetPreviewModalProps {
  assets: Asset[];
  isOpen: boolean;
  onClose: () => void;
  onDownload: (columns: number) => void;
}

export interface AssetPreviewCardProps {
  asset: Asset;
  scale: number;
}

export interface AssetsPDFProps {
  assets: Asset[];
  columnCount?: number;
}

export interface AssetPrintButtonProps {
  assets: Asset[];
} 
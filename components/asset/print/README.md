# Asset Print Components

This directory contains the modular asset printing functionality that was previously in a single large file (`asset-print-utils.tsx`). The code has been split into focused, maintainable modules.

## Structure

```
print/
├── README.md                 # This file
├── index.ts                  # Main exports
├── types.ts                  # TypeScript interfaces
├── pdf-styles.ts             # PDF styling definitions
├── pdf-utils.ts              # PDF utility functions
├── qr-utils.ts               # QR code generation utilities
├── print-service.ts          # Main print orchestration service
├── AssetsPDF.tsx             # PDF document component
├── AssetPreviewCard.tsx      # HTML preview card component
├── AssetPreviewModal.tsx     # Preview modal component
└── AssetPrintButton.tsx      # Main button component
```

## Components

### AssetPrintButton
The main component that provides the print preview functionality.

```tsx
import { AssetPrintButton } from '@/components/asset/print';

<AssetPrintButton assets={selectedAssets} />
```

### AssetPreviewModal
Modal component for previewing assets before printing with customization options.

### AssetPreviewCard
Individual asset card component used in the preview.

### AssetsPDF
React-PDF document component for generating the actual PDF.

## Services

### printAssets
Main service function for generating and downloading PDFs.

```tsx
import { printAssets } from '@/components/asset/print';

await printAssets(assets, columnCount);
```

### generateQRCode
Utility for generating QR codes for assets.

## Utilities

### PDF Utils
- `getWidthPercentage`: Calculate column widths based on column count
- `validateAssetsForPrint`: Validate assets before printing

### Styles
- `pdfStyles`: Complete PDF styling definitions

## Types

All TypeScript interfaces are defined in `types.ts`:
- `Asset`: Extended asset interface with QR code
- `AssetPreviewModalProps`
- `AssetPreviewCardProps`
- `AssetsPDFProps`
- `AssetPrintButtonProps`

## Migration

The original `asset-print-utils.tsx` file now serves as a compatibility layer, re-exporting all components and utilities from this modular structure. Existing imports will continue to work without changes.

## Benefits

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Testing**: Easier to unit test individual components
4. **Performance**: Better tree-shaking and code splitting
5. **Developer Experience**: Clearer code organization and easier debugging
6. **A4 Preview**: True 1:1 scale A4 page preview (210mm × 297mm)
7. **No Image Cutoff**: Automatic page breaks prevent asset cards from being cut off
8. **Multi-page Support**: Handles large asset lists across multiple pages

## Usage Examples

### Basic Usage
```tsx
import { AssetPrintButton } from '@/components/asset/print';

function AssetList({ assets }) {
  return (
    <div>
      <AssetPrintButton assets={assets} />
    </div>
  );
}
```

### Advanced Usage
```tsx
import { AssetPreviewModal, printAssets } from '@/components/asset/print';

function CustomPrintComponent({ assets }) {
  const [showModal, setShowModal] = useState(false);
  
  const handleDownload = async (columns) => {
    await printAssets(assets, columns);
    setShowModal(false);
  };
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Custom Print
      </button>
      
      <AssetPreviewModal
        assets={assets}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDownload={handleDownload}
      />
    </>
  );
}
``` 
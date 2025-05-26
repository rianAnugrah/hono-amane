# QR Code Label Generator

A comprehensive React component for generating customizable QR code labels for physical assets with print-ready layouts.

## Features

### 🎨 **Customizable Layout**
- Adjustable label dimensions (width × height in mm)
- Configurable number of columns (1-8)
- Customizable spacing and margins
- Print-optimized layouts for A4 paper

### 🔍 **Asset Filtering**
- Filter by asset condition (Good, Excellent, Fair, Broken)
- Filter by project code
- Filter by location
- Real-time asset count display

### 📱 **QR Code Options**
- Multiple data formats:
  - Asset Number only
  - Asset ID only
  - Custom format (Asset No | Project Code | Location)
- Adjustable QR code size (10-40mm)
- High-contrast QR codes for easy scanning

### 📋 **Field Selection**
- Toggle display of asset fields:
  - Asset Number
  - Asset Name
  - Location
  - Project Code
  - Condition
- Customizable typography and font sizes

### 🖨️ **Print Optimization**
- Accurate physical sizing (mm measurements)
- Print-friendly CSS with proper page breaks
- High contrast for clear printing
- No-break labels (prevents cutting across pages)

### 👁️ **Live Preview**
- Real-time preview of label layout
- Interactive settings panel
- Responsive design for desktop and tablet

## Components

### `QRLabelGenerator`
Main component that provides the full label generation interface.

```tsx
import { QRLabelGenerator } from '@/components/asset/qr-label-generator';

<QRLabelGenerator 
  assets={selectedAssets}
  isOpen={showGenerator}
  onClose={handleCloseGenerator}
/>
```

### `QRLabelPrintButton`
Button component that opens the label generator.

```tsx
import { QRLabelPrintButton } from '@/components/asset/qr-label-generator';

<QRLabelPrintButton assets={assets} />
```

## Usage

### Basic Implementation

```tsx
import React, { useState } from 'react';
import { QRLabelPrintButton } from '@/components/asset/qr-label-generator';
import { Asset } from '@/types/asset';

function AssetManagement() {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  return (
    <div>
      {/* Your asset selection UI */}
      <QRLabelPrintButton assets={selectedAssets} />
    </div>
  );
}
```

### Advanced Usage with Custom Settings

```tsx
import { QRLabelGenerator } from '@/components/asset/qr-label-generator';

function CustomLabelGenerator() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  return (
    <>
      <button onClick={() => setShowGenerator(true)}>
        Generate Labels
      </button>
      
      <QRLabelGenerator
        assets={assets}
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
      />
    </>
  );
}
```

## Configuration

### Label Settings Interface

```typescript
interface LabelSettings {
  width: number;           // Label width in mm (10-200)
  height: number;          // Label height in mm (10-200)
  columns: number;         // Number of columns (1-8)
  marginTop: number;       // Top margin in mm
  marginLeft: number;      // Left margin in mm
  spacing: number;         // Spacing between labels in mm (0-20)
  showBorder: boolean;     // Show/hide label borders
  fontSize: number;        // Font size in px (6-16)
  qrSize: number;          // QR code size in mm (10-40)
  qrDataFormat: 'assetNo' | 'id' | 'custom';
  showAssetNo: boolean;    // Display asset number
  showAssetName: boolean;  // Display asset name
  showLocation: boolean;   // Display location
  showCondition: boolean;  // Display condition
  showProjectCode: boolean; // Display project code
  paperSize: 'A4' | 'Letter' | 'custom';
  orientation: 'portrait' | 'landscape';
}
```

### Default Settings

```typescript
const defaultSettings: LabelSettings = {
  width: 50,              // 50mm width
  height: 30,             // 30mm height
  columns: 4,             // 4 columns per row
  marginTop: 10,          // 10mm top margin
  marginLeft: 10,         // 10mm left margin
  spacing: 5,             // 5mm spacing
  showBorder: true,       // Show borders
  fontSize: 8,            // 8px font size
  qrSize: 20,             // 20mm QR code
  qrDataFormat: 'assetNo', // Use asset number for QR
  showAssetNo: true,      // Show asset number
  showAssetName: true,    // Show asset name
  showLocation: true,     // Show location
  showCondition: false,   // Hide condition
  showProjectCode: true,  // Show project code
  paperSize: 'A4',        // A4 paper
  orientation: 'portrait' // Portrait orientation
};
```

## Asset Data Structure

The component expects assets to follow this interface:

```typescript
interface Asset {
  id: string;
  assetNo: string;
  assetName: string;
  condition: string;
  projectCode?: {
    id: number;
    code: string;
  };
  locationDesc?: {
    id: number;
    description: string;
  };
  // ... other asset properties
}
```

## Sample Label Layout

```
┌─────────────────────┐
│     [QR CODE]       │  ← Contains asset data
│                     │
│ T1                  │  ← Asset Number
│ Test Asset 1        │  ← Asset Name
│ Loc: Banyuwangi...  │  ← Location
│ Proj: Common        │  ← Project Code
│ Cond: Good          │  ← Condition (optional)
└─────────────────────┘
```

## Print Workflow

1. **Asset Selection**: Select assets for labeling
2. **Open Generator**: Click "QR Labels" button
3. **Filter Assets**: Use filters to narrow down assets
4. **Customize Layout**: Adjust dimensions, columns, spacing
5. **Configure QR Codes**: Choose data format and size
6. **Select Fields**: Toggle which information to display
7. **Preview**: Review layout in real-time
8. **Print/Export**: Print directly or export as PDF

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## Print Recommendations

### Label Paper
- Use high-quality label paper for durability
- Recommended: Avery 5160 or similar (2⅝" × 1")
- For custom sizes, adjust width/height settings accordingly

### Printer Settings
- Use highest quality print setting
- Ensure "Actual Size" or "100%" scaling
- Disable "Fit to Page" options
- Use black ink for best QR code contrast

### QR Code Scanning
- Minimum QR code size: 15mm for reliable scanning
- Test scan QR codes after printing
- Ensure good contrast between QR code and background

## Troubleshooting

### Common Issues

**QR Codes not generating**
- Check that assets have valid `assetNo` or `id` fields
- Verify network connectivity for QR code generation

**Labels not printing at correct size**
- Ensure browser print settings use "Actual Size"
- Check that CSS units (mm) are supported by browser
- Verify printer supports the selected paper size

**Layout issues**
- Adjust margins and spacing if labels overlap
- Reduce number of columns for better fit
- Check that label dimensions fit within paper size

**Performance issues with many assets**
- QR code generation is done asynchronously
- Large asset lists may take time to process
- Consider filtering assets to reduce processing time

## Dependencies

- `react`: ^18.0.0
- `react-dom`: ^18.0.0
- `qrcode`: ^1.5.4
- `framer-motion`: ^12.7.2
- `lucide-react`: ^0.487.0
- `tailwindcss`: ^3.0.0

## Demo

Visit `/asset/qr-labels-demo` to see a working demonstration with sample data.

## License

This component is part of the Hono-Amane asset management system. 
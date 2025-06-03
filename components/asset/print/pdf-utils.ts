// Calculate the width percentage based on column count with proper spacing
export const getWidthPercentage = (columns: number): string => {
  // Calculate width to fit within A4 page (210mm - 40mm padding = 170mm usable width)
  // Account for margins between columns
  const marginPercentage = (columns - 1) * 2; // 2% margin between columns
  const availableWidth = 100 - marginPercentage;
  const widthPerColumn = availableWidth / columns;
  
  switch (columns) {
    case 1: return '96%';
    case 2: return '47%';
    case 3: return '30.67%';
    case 4: return '22%';
    case 5: return '17.2%';
    case 6: return '14%';
    default: return `${Math.max(widthPerColumn, 10)}%`; // Minimum 10% width
  }
};

// Define Asset interface for type safety
interface Asset {
  id: string;
  assetNo: string;
  assetName: string;
}

// Validation function for print assets
export const validateAssetsForPrint = (assets: Asset[]): boolean => {
  if (!assets || assets.length === 0) {
    alert("No assets are selected for printing. Please select at least one asset.");
    return false;
  }
  return true;
}; 
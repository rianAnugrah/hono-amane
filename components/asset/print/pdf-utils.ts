// Calculate the width percentage based on column count with proper spacing
export const getWidthPercentage = (columns: number): string => {
  switch (columns) {
    case 1: return '95%';
    case 2: return '47%';
    case 3: return '31%';
    case 4: return '23%';
    default: return '47%';
  }
};

// Validation function for print assets
export const validateAssetsForPrint = (assets: any[]): boolean => {
  if (!assets || assets.length === 0) {
    alert("No assets are selected for printing. Please select at least one asset.");
    return false;
  }
  return true;
}; 
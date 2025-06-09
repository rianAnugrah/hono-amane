// Load assets data from JSON file
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsJsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets-hbi.json'), 'utf-8'));

// Define interface for JSON data structure
interface AssetJsonItem {
  PROJECT_CODE: string;
  ASSET_NO: string;
  LINE_NO: string;
  ASSET_NAME: string;
  REMARK: string | null;
  LOCATION_DESC: string;
  DETAILS_LOCATION: string;
  CONDITION: string;
  PIS_DATE: string;
  TRANS_DATE: string;
  CATEGORY_CODE: string;
  AFE_NO: string | number;
  ADJUSTED_DEPRE: string;
  PO_NO: string | number;
  ACQ_VALUE_IDR: string;
  ACQ_VALUE: string;
  ACCUM_DEPRE: string;
  YTD_DEPRE: string;
  BOOK_VALUE: string;
  TAGGING_YEAR: string;
}

// Project codes data
export const projectCodesData = [
  { code: "Common" },
  { code: "Gas1" },
  { code: "n/a" }
];

// Location descriptions data
export const locationDescsData = [
  { description: "GMS Pasuruan" },
  { description: "BD WHP" },
  { description: "MDA - MBH Development Wells" },
  { description: "MDA - MBH WHP" },
  { description: "MAC" },
  { description: "Jakarta Office" },
  { description: "Banyuwangi Shorebase" },
  { description: "BD Subsea Pipeline" },
  { description: "Surabaya Office" },
  { description: "BD Development Wells" },
  { description: "Sampang Shorebase" },
  { description: "Storage (Sigma)" },

];

// Details locations data
export const detailsLocationsData = [
  { description: "OUTSIDE AREA" },
  { description: "Cellar Deck - Control Room" },
  { description: "Mezzanine" },
  { description: "Control Room" },
  { description: "Cellar Deck" },
  { description: "Top of Jacket" },
  { description: "Main Deck" },
  { description: "Cover Warehouse" },
  { description: "PORTACAMP" },
  { description: "GMS Area" },
  { description: "EQUIPMENT STORAGE SHELTER" },
  { description: "MBH Mezzanine" },
  { description: "MDA Sub Cellar Deck" },
  { description: "MBH Cellar Deck" },
  { description: "MAC WHP" },
  { description: "FILTER COALESCER" },
  { description: "CLOSE DRAIN" },
  { description: "SPT ROOM" },
  { description: "MCC" },
  { description: "WORKSHOP" },
  { description: "METERING" },
  { description: "PIG RECEIVER" },
  { description: "MBH Jacket" },
  { description: "Gudang HRGA" },
  { description: "0" },
  { description: "#N/A" },
  { description: "Line 1" },
  { description: "25th Floor" },
  { description: "Mail Room" },
  { description: "Open Yard" },
  { description: "EDG" },
  { description: "MV Room" },
  { description: "CCR" },
  { description: "POTABLE WATER TANK" },
  { description: "NEAR ANALYZER SHELTER" },
  { description: "Filling Room" },
  { description: "SECURITY ROOM" },
  { description: "PANTRY" },
  { description: "HCML Office Room" },
  { description: "SCM - Sarah P" },
  { description: "Main deck" },
  { description: "Sampang" },
  { description: "Gas Export" },
  { description: "KO DRUM" },
  { description: "INCOMING" },
  { description: "CCR " },
  { description: "BATTERY ROOM" },
  { description: "CO2 SKID" },
  { description: "WC SPT ROOM" },
  { description: "MDA Mezzanine" },
  { description: "COPY CENTER" },
  { description: "Mezzanine " },
  { description: "MDA Jacket" },
  { description: "STAFF ROOM" },
  { description: "VENT STACK" },
  { description: "MV ROOM" },
  { description: "SHELTER AREA" },
  { description: "STAFF AREA" },
  { description: "MANAGER ROOM" },
  { description: "Panaboard di Office (Lt 25)" },
  { description: "FPU, Doctor Room" },
  { description: "MBH" },
  { description: "MBH Sub Cellar Deck" },
  { description: "STORAGE CONTAINER" },
  { description: "HSSE 25th Floor" },
  { description: "Mezzanine/ Control Room" },
  { description: "Line 2" },
  { description: "MDA" },
  { description: "FPU  " },
  { description: "NEAR MV Room" },
  { description: "PLN ROOM" },
  { description: "LOBBY" },
  { description: "MEETING ROOM" },
  { description: "MDA/MBH" },
  { description: "Subsurface File Area" },
  { description: "HEAD ROOM" },
  { description: "Raas 2" },
  { description: "Pantry Lt.24" },
];

// Helper function to get project code ID
const getProjectCodeId = (code: string): number => {
  const index = projectCodesData.findIndex(item => item.code === code);
  return index !== -1 ? index + 1 : 1; // IDs start from 1, default to first if not found
};

// Helper function to get location description ID
const getLocationDescId = (description: string): number => {
  const index = locationDescsData.findIndex(item => item.description === description);
  return index !== -1 ? index + 1 : 1; // IDs start from 1, default to first if not found
};

// Helper function to get details location ID
const getDetailsLocationId = (description: string): number => {
  const index = detailsLocationsData.findIndex(item => item.description === description);
  return index !== -1 ? index + 1 : 1; // IDs start from 1, default to first if not found
};

// Helper function to parse numeric values
const parseNumericValue = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  
  const stringValue = String(value);
  if (!stringValue || stringValue.trim() === "" || stringValue.trim() === "-" || stringValue.trim() === "N/A") {
    return 0;
  }
  // Remove spaces, commas, and other non-numeric characters except decimal point
  const cleaned = stringValue.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper function to parse date
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.trim() === "" || dateStr.trim() === "N/A" || dateStr.trim() === "#N/A") {
    return null;
  }
  
  // Parse MM/DD/YYYY format
  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    return null;
  }
  
  const [month, day, year] = parts;
  const monthNum = parseInt(month);
  const dayNum = parseInt(day);
  const yearNum = parseInt(year);
  
  // Validate parsed numbers
  if (isNaN(monthNum) || isNaN(dayNum) || isNaN(yearNum)) {
    return null;
  }
  
  // Validate date ranges
  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900 || yearNum > 2100) {
    return null;
  }
  
  const date = new Date(yearNum, monthNum - 1, dayNum);
  
  // Check if the date is valid (handles cases like Feb 30th)
  if (date.getFullYear() !== yearNum || date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) {
    return null;
  }
  
  return date;
};

// Helper function to handle empty string values
const parseStringValue = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === 'N/A' || value === '#N/A') {
    return '';
  }
  return String(value).trim();
};

// Transform JSON data to the format expected by the application
const transformAssetData = (jsonItem: AssetJsonItem) => ({
  assetNo: parseStringValue(jsonItem.ASSET_NO) + '-I',
  lineNo: parseStringValue(jsonItem.LINE_NO),
  assetName: parseStringValue(jsonItem.ASSET_NAME),
  remark: parseStringValue(jsonItem.REMARK),
  condition: parseStringValue(jsonItem.CONDITION),
  pisDate: parseDate(jsonItem.PIS_DATE),
  transDate: parseDate(jsonItem.TRANS_DATE),
  categoryCode: parseStringValue(jsonItem.CATEGORY_CODE),
  afeNo: typeof jsonItem.AFE_NO === 'number' ? jsonItem.AFE_NO.toString() : parseStringValue(String(jsonItem.AFE_NO)),
  adjustedDepre: parseNumericValue(jsonItem.ADJUSTED_DEPRE),
  poNo: typeof jsonItem.PO_NO === 'number' ? jsonItem.PO_NO.toString() : parseStringValue(String(jsonItem.PO_NO)),
  acqValueIdr: parseNumericValue(jsonItem.ACQ_VALUE_IDR),
  acqValue: parseNumericValue(jsonItem.ACQ_VALUE),
  accumDepre: parseNumericValue(jsonItem.ACCUM_DEPRE),
  ytdDepre: parseNumericValue(jsonItem.YTD_DEPRE),
  bookValue: parseNumericValue(jsonItem.BOOK_VALUE),
  taggingYear: parseStringValue(jsonItem.TAGGING_YEAR),
  projectCode_id: getProjectCodeId(parseStringValue(jsonItem.PROJECT_CODE) || 'n/a'),
  locationDesc_id: getLocationDescId(parseStringValue(jsonItem.LOCATION_DESC) || 'n/a'),
  detailsLocation_id: getDetailsLocationId(parseStringValue(jsonItem.DETAILS_LOCATION) || 'n/a'),
  type: 'HBI' // ini hardcode, pastikan tidak salah saat import
});

// Dynamically load and transform assets data from JSON file
export const assetsData = (assetsJsonData as AssetJsonItem[]).map(transformAssetData); 
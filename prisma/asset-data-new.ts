// Load assets data from JSON file
import assetsJsonData from './assets-hbi.json';

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
  { code: "Gas1" }
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
  { description: "Sampang Shorebase" }
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
  { description: "Pantry Lt.24" }
];

// Helper function to get project code ID
const getProjectCodeId = (code: string): number => {
  const projectCodes = ["Common", "Gas1"];
  const index = projectCodes.indexOf(code);
  return index + 1; // IDs start from 1
};

// Helper function to get location description ID
const getLocationDescId = (description: string): number => {
  const locationDescs = ["GMS Pasuruan", "BD WHP", "MDA - MBH Development Wells", "MDA - MBH WHP", "MAC", "Jakarta Office", "Banyuwangi Shorebase", "BD Subsea Pipeline", "Surabaya Office", "BD Development Wells", "Sampang Shorebase"];
  const index = locationDescs.indexOf(description);
  return index + 1; // IDs start from 1
};

// Helper function to get details location ID
const getDetailsLocationId = (description: string): number => {
  const detailsLocations = ["OUTSIDE AREA", "Cellar Deck - Control Room", "Mezzanine", "Control Room", "Cellar Deck", "Top of Jacket", "Main Deck", "Cover Warehouse", "PORTACAMP", "GMS Area", "EQUIPMENT STORAGE SHELTER", "MBH Mezzanine", "MDA Sub Cellar Deck", "MBH Cellar Deck", "MAC WHP", "FILTER COALESCER", "CLOSE DRAIN", "SPT ROOM", "MCC", "WORKSHOP", "METERING", "PIG RECEIVER", "MBH Jacket", "Gudang HRGA", "0", "#N/A", "Line 1", "25th Floor", "Mail Room", "Open Yard", "EDG", "MV Room", "CCR", "POTABLE WATER TANK", "NEAR ANALYZER SHELTER", "Filling Room", "SECURITY ROOM", "PANTRY", "HCML Office Room", "SCM - Sarah P", "Main deck", "Sampang", "Gas Export", "KO DRUM", "INCOMING", "CCR ", "BATTERY ROOM", "CO2 SKID", "WC SPT ROOM", "MDA Mezzanine", "COPY CENTER", "Mezzanine ", "MDA Jacket", "STAFF ROOM", "VENT STACK", "MV ROOM", "SHELTER AREA", "STAFF AREA", "MANAGER ROOM", "Panaboard di Office (Lt 25)", "FPU, Doctor Room", "MBH", "MBH Sub Cellar Deck", "STORAGE CONTAINER", "HSSE 25th Floor", "Mezzanine/ Control Room", "Line 2", "MDA", "FPU  ", "NEAR MV Room", "PLN ROOM", "LOBBY", "MEETING ROOM", "MDA/MBH", "Subsurface File Area", "HEAD ROOM", "Raas 2", "Pantry Lt.24"];
  const index = detailsLocations.indexOf(description);
  return index + 1; // IDs start from 1
};

// Helper function to parse numeric values
const parseNumericValue = (value: string): number => {
  if (!value || value.trim() === "" || value.trim() === "-" || value.trim() === "N/A") {
    return 0;
  }
  // Remove spaces, commas, and other non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper function to parse date
const parseDate = (dateStr: string): Date => {
  if (!dateStr || dateStr.trim() === "" || dateStr.trim() === "N/A") {
    return new Date();
  }
  // Parse MM/DD/YYYY format
  const [month, day, year] = dateStr.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

// Transform JSON data to the format expected by the application
const transformAssetData = (jsonItem: AssetJsonItem) => ({
  assetNo: jsonItem.ASSET_NO,
  lineNo: jsonItem.LINE_NO,
  assetName: jsonItem.ASSET_NAME,
  remark: jsonItem.REMARK,
  condition: jsonItem.CONDITION,
  pisDate: parseDate(jsonItem.PIS_DATE),
  transDate: parseDate(jsonItem.TRANS_DATE),
  categoryCode: jsonItem.CATEGORY_CODE,
  afeNo: typeof jsonItem.AFE_NO === 'number' ? jsonItem.AFE_NO.toString() : jsonItem.AFE_NO,
  adjustedDepre: parseNumericValue(jsonItem.ADJUSTED_DEPRE),
  poNo: typeof jsonItem.PO_NO === 'number' ? jsonItem.PO_NO.toString() : jsonItem.PO_NO,
  acqValueIdr: parseNumericValue(jsonItem.ACQ_VALUE_IDR),
  acqValue: parseNumericValue(jsonItem.ACQ_VALUE),
  accumDepre: parseNumericValue(jsonItem.ACCUM_DEPRE),
  ytdDepre: parseNumericValue(jsonItem.YTD_DEPRE),
  bookValue: parseNumericValue(jsonItem.BOOK_VALUE),
  taggingYear: jsonItem.TAGGING_YEAR,
  projectCode_id: getProjectCodeId(jsonItem.PROJECT_CODE),
  locationDesc_id: getLocationDescId(jsonItem.LOCATION_DESC),
  detailsLocation_id: getDetailsLocationId(jsonItem.DETAILS_LOCATION),
});

// Dynamically load and transform assets data from JSON file
export const assetsData = (assetsJsonData as AssetJsonItem[]).map(transformAssetData); 
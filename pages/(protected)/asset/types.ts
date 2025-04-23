export interface Asset {
  id: string;
  projectCode: AssetProjectCode;
  assetNo: string;
  lineNo: string;
  assetName: string;
  remark?: string | null;
  locationDesc: string;
  detailsLocation?: string | null;
  condition: string;
  pisDate: string;
  transDate: string;
  categoryCode: string;
  afeNo?: string | null;
  adjustedDepre: number;
  poNo?: string | null;
  acqValueIdr: number;
  acqValue: number;
  accumDepre: number;
  ytdDepre: number;
  bookValue: number;
  taggingYear?: string | null;
  version: number;
  isLatest: boolean;
  deletedAt?: string | null;
}


export interface AssetProjectCode {
  id : string;
  code : string;
}
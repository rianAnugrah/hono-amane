export interface Asset {
  id: string;
  projectCode: AssetProjectCode | null;
  projectCode_id?: number | null;
  assetNo: string;
  lineNo: string;
  assetName: string;
  remark?: string | null;
  locationDesc: LocationDesc | null;
  locationDesc_id?: number | null;
  detailsLocation?: DetailsLocation | null;
  detailsLocation_id?: number | null;
  condition: string;
  pisDate: string;
  transDate: string;
  categoryCode: string;
  afeNo?: string | null;
  type?: string | null;
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
  images: string[];
}

export interface AssetProjectCode {
  id: number;
  code: string;
}

export interface LocationDesc {
  id: number;
  description: string;
}

export interface DetailsLocation {
  id: number;
  description: string;
}
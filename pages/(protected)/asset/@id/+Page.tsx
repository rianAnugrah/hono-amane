// pages/users/[id]/+Page.tsx
import { usePageContext } from "@/renderer/usePageContext";
import { useEffect, useState } from "react";
import { Asset } from "../types";
import { QRCodeCanvas } from "qrcode.react";
import {
  formatDate,
  formatIDR,
  formatUSD,
} from "@/components/utils/formatting";

export default function UserDetailPage() {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;

  const [asset, setAsset] = useState<Asset | null>(null);

  useEffect(() => {
    fetch(`/api/assets/by-asset-number/${id}`)
      .then((res) => res.json())
      .then(setAsset);
  }, [id]);

  if (!asset) return <div className="p-4">Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6">
      {/* QR Code Section */}
      <div className="md:col-span-2 flex justify-center">
        <div className="bg-gray-100 p-4 rounded-xl shadow-inner flex flex-col gap-4 items-center">
          <QRCodeCanvas
            value={asset.assetNo}
            size={100}
            className="rounded-lg"
          />
          <div className="text-xs text-center text-gray-500 mt-2">
            Asset No: {asset.assetNo}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            General Info
          </h3>
          <DetailItem label="Project name" value={asset.assetName} />

          <DetailItem
            label="Condition"
            value={
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  asset.condition === "Good"
                    ? "bg-green-50 text-green-700"
                    : asset.condition === "Broken"
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                {asset.condition}
              </span>
            }
          />
          <DetailItem label="Project Code" value={asset.projectCode?.code} />
          <DetailItem label="Line No" value={asset.lineNo} />
          <DetailItem label="Category Code" value={asset.categoryCode} />
          <DetailItem
            label="Location"
            value={asset.locationDesc?.description}
          />
          <DetailItem label="Area" value={asset.detailsLocation?.description} />
          <DetailItem label="PIS Date" value={formatDate(asset.pisDate)} />
          <DetailItem label="Trans Date" value={formatDate(asset.transDate)} />
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Financials
          </h3>
          <DetailItem
            label="Acq. Value IDR"
            value={formatIDR(asset.acqValueIdr)}
            highlight
          />
          <DetailItem
            label="Acq. Value USD"
            value={formatUSD(asset.acqValue)}
            highlight
          />
          <DetailItem
            label="Accum. Depre."
            value={asset.accumDepre.toLocaleString()}
          />
          <DetailItem
            label="YTD Depre."
            value={asset.ytdDepre.toLocaleString()}
          />
          <DetailItem
            label="Book Value"
            value={asset.bookValue.toLocaleString()}
            highlight
          />
          <DetailItem
            label="Adjusted Depre."
            value={asset.adjustedDepre.toLocaleString()}
          />
          {asset.afeNo && <DetailItem label="AFE No" value={asset.afeNo} />}
          {asset.poNo && <DetailItem label="PO No" value={asset.poNo} />}
          {asset.remark && <DetailItem label="Remark" value={asset.remark} />}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number | React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-indigo-600" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

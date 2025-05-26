import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { Printer } from "lucide-react";
import { AssetPrintButton as AssetPrintPreview } from "./asset-print-utils";

export default function AssetPrintButton() {
  // Inside component
  const { selectedAssets } = useAssetSelectionStore();

  return (
    <>
      <div className="">
        <button
          className="btn btn-neutral btn-sm"
          disabled={selectedAssets.length <= 0}
        >
          <AssetPrintPreview assets={selectedAssets} />
          <Printer className="w-5 h-5 mr-1"/> ({selectedAssets.length})
        </button>
      </div>
    </>
  );
}

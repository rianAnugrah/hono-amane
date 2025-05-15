import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { Printer } from "lucide-react";
import { printAssets } from "./asset-print-utils";

export default function AssetPrintButton() {
  // Inside component
  const { selectedAssets } = useAssetSelectionStore();

  const handlePrint = () => {
    printAssets(selectedAssets);
  };

  return (
    <>
      <div className="">
        <button
          onClick={handlePrint}
          className="btn btn-neutral btn-sm "
          disabled={selectedAssets.length <= 0}
        >
          <Printer className="w-5 h-5"/> Print({selectedAssets.length})
        </button>
      </div>
    </>
  );
}

import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { Printer } from "lucide-react";

export default function AssetPrintButton() {
  // Inside component
  const { selectedAssets } = useAssetSelectionStore();

  const handleOpenSelected = () => {
    const selectedIds = Object.keys(selectedAssets);
    const url = `/asset/print?ids=${selectedIds.join(",")}`;
    window.open(url, "_blank");
  };
  return (
    <>
      <div className="">
        <button
          onClick={handleOpenSelected}
          className="btn btn-neutral btn-sm "
          disabled={Object.keys(selectedAssets).length <= 0}
        >
          <Printer className="w-5 h-5"/> Print({Object.keys(selectedAssets).length})
        </button>
      </div>
    </>
  );
}

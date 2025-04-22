import { useAssetSelectionStore } from "@/stores/store-asset-selection";

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
      {Object.keys(selectedAssets).length > 0 && (
        <div className="p-4">
          <button
            onClick={handleOpenSelected}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            View Selected ({Object.keys(selectedAssets).length})
          </button>
        </div>
      )}
    </>
  );
}

import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { AssetPrintButton } from "@/components/asset/print/AssetPrintButton";

const SelectedAssetsPage = () => {
  const { selectedAssets} =
    useAssetSelectionStore();

  return (
    <>
      <AssetPrintButton assets={selectedAssets} />
    </>
  );
};

export default SelectedAssetsPage;

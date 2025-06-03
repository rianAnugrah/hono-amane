import { useEffect, useState } from "react";
import axios from "axios";
import { Asset } from "../types";
import { formatDate } from "@/components/utils/formatting";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { Printer } from "lucide-react";
import { AssetPrintButton } from "@/components/asset/print/AssetPrintButton";

const SelectedAssetsPage = () => {
  const { selectedAssets, selectAsset, deselectAsset } =
    useAssetSelectionStore();

  return (
    <>
      <AssetPrintButton assets={selectedAssets} />
    </>
  );
};

export default SelectedAssetsPage;

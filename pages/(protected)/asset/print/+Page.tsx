import { useEffect, useState } from "react";
import axios from "axios";
import { Asset } from "../types";
import { formatDate } from "@/components/utils/formatting";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { Printer } from "lucide-react";
import { printAssets } from "../_shared/asset-print-utils";


const SelectedAssetsPage = () => {
 
  const { selectedAssets, selectAsset, deselectAsset } = useAssetSelectionStore();
  
 

  const handlePrint = async () => {
    printAssets(selectedAssets);
  };

  return (
    <button
      onClick={handlePrint}
      className="btn btn-neutral btn-soft btn-sm"
      disabled={selectedAssets.length <= 0}
    >
      <Printer className="w-5 h-5"/> Print({selectedAssets.length})
    </button>
  );
};

export default SelectedAssetsPage;
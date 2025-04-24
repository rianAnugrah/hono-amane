import { useEffect, useState } from "react";
import axios from "axios";
import { Asset } from "../types";
import { formatDate } from "@/components/utils/formatting";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { Printer } from "lucide-react";
import { printAssets } from "../_shared/asset-print-utils";


const SelectedAssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { selectedAssets, selectAsset, deselectAsset } = useAssetSelectionStore();
  
  useEffect(() => {
    const selectedIds = Object.keys(selectedAssets).filter(id => selectedAssets[id]);
    
    const fetchSelectedAssets = async () => {
      if (selectedIds.length === 0) {
        setAssets([]);
        return;
      }
      
      try {
        const { data } = await axios.get("/api/assets", {
          params: { ids: selectedIds },
        });
        
        // Ensure we only keep assets that are still in selectedAssets
        const filteredAssets = (data.assets ?? data).filter(
          (asset) => selectedAssets[asset.id]
        );
        
        setAssets(filteredAssets);
      } catch (error) {
        console.error("Error fetching selected assets:", error);
        setAssets([]);
      }
    };
    
    fetchSelectedAssets();
  }, [selectedAssets]);

  const handlePrint = async () => {
    printAssets(assets);
  };

  return (
    <button
      onClick={handlePrint}
      className="btn btn-neutral btn-sm"
      disabled={assets.length <= 0}
    >
      <Printer className="w-5 h-5"/> Print({assets.length})
    </button>
  );
};

export default SelectedAssetsPage;
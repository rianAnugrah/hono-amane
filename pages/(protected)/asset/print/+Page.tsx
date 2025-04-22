


import { useEffect, useState } from "react";
import axios from "axios";
import { Asset } from "../types";
import AssetItem from "../_shared/asset-item";


const SelectedAssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("ids")?.split(",") || [];

    const fetchSelectedAssets = async () => {
      const { data } = await axios.get("/api/assets", {
        params: { ids },
      });
      setAssets(data.assets ?? data); // adapt based on response structure
    };

    fetchSelectedAssets();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Selected Assets</h1>
      <div className="space-y-4">
        {assets.map((asset) => (
          <AssetItem key={asset.id} asset={asset} isExpanded={false} />
        ))}
      </div>
    </div>
  );
};

export default SelectedAssetsPage;

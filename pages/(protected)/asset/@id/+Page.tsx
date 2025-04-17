// pages/users/[id]/+Page.tsx
import { usePageContext } from "@/renderer/usePageContext";
import { useEffect, useState } from "react";
import { Asset } from "../types";

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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Detail</h1>
      <div className="space-y-2 text-lg">
        <p>Asset id = {asset.id}</p>
        <p>Asset number = {asset.assetNo}</p>
        <p>Asset name = {asset.assetName}</p>
      </div>
    </div>
  );
}

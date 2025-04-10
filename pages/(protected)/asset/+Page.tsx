// File: pages/assets/index.jsx (atau sesuai struktur Vike Anda)
import { useState, useEffect } from "react";
import { Link } from "../../../renderer/Link";

export default function AssetsTablePage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/assets", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }

      const data = await response.json();
      setAssets(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" mx-auto p-4">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={fetchAssets}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Assets List</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Project Code</th>
              <th>Asset No</th>
              <th>Line No</th>
              <th>Asset Name</th>
              <th>Location</th>
              <th>Condition</th>
              <th>PIS Date</th>
              <th>Trans Date</th>
              <th>Category</th>
              <th>Adj. Depre</th>
              <th>Acq. Value (IDR)</th>
              <th>Acq. Value</th>
              <th>Accum. Depre</th>
              <th>YTD Depre</th>
              <th>Book Value</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="15" className="text-center">
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset, index) => (
                <tr key={index}>
                  <td>{asset.projectCode}</td>
                  <td>{asset.assetNo}</td>
                  <td>{asset.lineNo}</td>
                  <td>{asset.assetName}</td>
                  <td>{asset.locationDesc}</td>
                  <td>{asset.condition}</td>
                  <td>{new Date(asset.pisDate).toLocaleString()}</td>
                  <td>{new Date(asset.transDate).toLocaleString()}</td>
                  <td>{asset.categoryCode}</td>
                  <td>{asset.adjustedDepre.toLocaleString()}</td>
                  <td>{asset.acqValueIdr.toLocaleString()}</td>
                  <td>{asset.acqValue.toLocaleString()}</td>
                  <td>{asset.accumDepre.toLocaleString()}</td>
                  <td>{asset.ytdDepre.toLocaleString()}</td>
                  <td>{asset.bookValue.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button onClick={fetchAssets} className="btn btn-secondary mt-4">
        Refresh Data
      </button>

      <Link href="/asset/create" className="btn btn-primary mt-4">
        Create new
      </Link>
    </div>
  );
}

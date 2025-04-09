// File: pages/assets/index.jsx (atau sesuai struktur Vike Anda)
import { useState, useEffect } from 'react';

export default function AssetsTablePage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assets');
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
      <div className="container mx-auto p-4">
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assets List</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Project Code</th>
              <th className="border p-2 text-left">Asset No</th>
              <th className="border p-2 text-left">Line No</th>
              <th className="border p-2 text-left">Asset Name</th>
              <th className="border p-2 text-left">Location</th>
              <th className="border p-2 text-left">Condition</th>
              <th className="border p-2 text-left">PIS Date</th>
              <th className="border p-2 text-left">Trans Date</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Adj. Depre</th>
              <th className="border p-2 text-left">Acq. Value (IDR)</th>
              <th className="border p-2 text-left">Acq. Value</th>
              <th className="border p-2 text-left">Accum. Depre</th>
              <th className="border p-2 text-left">YTD Depre</th>
              <th className="border p-2 text-left">Book Value</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="15" className="border p-2 text-center">
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border p-2">{asset.projectCode}</td>
                  <td className="border p-2">{asset.assetNo}</td>
                  <td className="border p-2">{asset.lineNo}</td>
                  <td className="border p-2">{asset.assetName}</td>
                  <td className="border p-2">{asset.locationDesc}</td>
                  <td className="border p-2">{asset.condition}</td>
                  <td className="border p-2">
                    {new Date(asset.pisDate).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    {new Date(asset.transDate).toLocaleString()}
                  </td>
                  <td className="border p-2">{asset.categoryCode}</td>
                  <td className="border p-2">{asset.adjustedDepre.toLocaleString()}</td>
                  <td className="border p-2">{asset.acqValueIdr.toLocaleString()}</td>
                  <td className="border p-2">{asset.acqValue.toLocaleString()}</td>
                  <td className="border p-2">{asset.accumDepre.toLocaleString()}</td>
                  <td className="border p-2">{asset.ytdDepre.toLocaleString()}</td>
                  <td className="border p-2">{asset.bookValue.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={fetchAssets}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh Data
      </button>
    </div>
  );
}


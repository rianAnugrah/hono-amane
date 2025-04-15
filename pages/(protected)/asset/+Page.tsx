import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

interface Asset {
  id: string;
  projectCode: string;
  assetNo: string;
  lineNo: string;
  assetName: string;
  remark?: string | null;
  locationDesc: string;
  detailsLocation?: string | null;
  condition: string;
  pisDate: string;
  transDate: string;
  categoryCode: string;
  afeNo?: string | null;
  adjustedDepre: number;
  poNo?: string | null;
  acqValueIdr: number;
  acqValue: number;
  accumDepre: number;
  ytdDepre: number;
  bookValue: number;
  taggingYear?: string | null;
  version: number;
  isLatest: boolean;
  deletedAt?: string | null;
}

export default function AssetCrudPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState<Partial<Asset>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const { data } = await axios.get("/api/assets");
    setAssets(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(`/api/assets/${editingId}`, form);
    } else {
      await axios.post("/api/assets", form);
    }
    setForm({});
    setEditingId(null);
    fetchAssets();
  };

  const handleEdit = (asset: Asset) => {
    setForm(asset);
    setEditingId(asset.id);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/assets/${id}`);
    fetchAssets();
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">
          {editingId ? "Edit" : "Create"} Asset
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="projectCode"
            placeholder="Project Code"
            className="input"
            value={form.projectCode || ""}
            onChange={handleChange}
          />
          <input
            name="assetNo"
            placeholder="Asset No"
            className="input"
            value={form.assetNo || ""}
            onChange={handleChange}
          />
          <input
            name="lineNo"
            placeholder="Line No"
            className="input"
            value={form.lineNo || ""}
            onChange={handleChange}
          />
          <input
            name="assetName"
            placeholder="Asset Name"
            className="input"
            value={form.assetName || ""}
            onChange={handleChange}
          />
          <input
            name="locationDesc"
            placeholder="Location Desc"
            className="input"
            value={form.locationDesc || ""}
            onChange={handleChange}
          />
          <input
            name="condition"
            placeholder="Condition"
            className="input"
            value={form.condition || ""}
            onChange={handleChange}
          />
          <input
            name="pisDate"
            placeholder="PIS Date (YYYY-MM-DD)"
            className="input"
            value={form.pisDate || ""}
            onChange={handleChange}
          />
          <input
            name="transDate"
            placeholder="Trans Date (YYYY-MM-DD)"
            className="input"
            value={form.transDate || ""}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update" : "Create"} Asset
        </button>
      </div>

      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white p-4 rounded shadow-md">
            <div className="flex justify-start items-center">
              <div className="pr-4 ">
                <QRCodeCanvas value={asset.assetNo} size={72} />
              </div>
              <div className="w-full">
                <p className="font-bold text-lg">
                  {asset.assetName} ({asset.assetNo})
                </p>
                <p className="text-sm text-gray-600">
                  Location: {asset.locationDesc}
                </p>
                <p className="text-sm text-gray-600">
                  Condition: {asset.condition}
                </p>
                <p className="text-sm text-gray-600">
                  Version: {asset.version}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(asset)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tailwind CSS utility class input (optional global style):
// .input { @apply border rounded px-3 py-2 w-full; }

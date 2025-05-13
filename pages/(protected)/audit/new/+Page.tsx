import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { navigate } from "vike/client/router";
import { useUserStore } from "@/stores/store-user-login";
import InputSelect from "@/components/ui/input-select";

// Define the Asset type to fix the error
interface Asset {
  id: string;
  assetNo: string;
  assetName: string;
}

export default function NewAssetAuditPage() {
  // Get current user from store
  const { id: currentUserId } = useUserStore();

  // List state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [locationDesc_id, setLocationDesc_id] = useState<string>("");
  const [projectCode_id, setProjectCode_id] = useState<number | null>(null);
  const [categoryCode, setCategoryCode] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalAssets, setTotalAssets] = useState<number>(0);

  const [users, setUsers] = useState<any[]>([]);

  console.log("users", users);

  const [form, setForm] = useState({
    assetId: "",
    checkedById: currentUserId, // Set current user ID as default
    status: "OK",
    remarks: "",
  });

  // Update form when currentUserId changes
  useEffect(() => {
    if (currentUserId) {
      setForm((prev) => ({ ...prev, checkedById: currentUserId }));
    }
  }, [currentUserId]);

  useEffect(() => {
    Promise.all([
      fetch(
        `/api/assets?page=${page}&pageSize=${pageSize}&search=${search}&locationDesc_id=${locationDesc_id}&condition=${condition}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      ).then((res) => res.json()),
      fetch("/api/users").then((res) => res.json()),
    ])
      .then(([assetData, userData]) => {
        setAssets(assetData.assets || assetData);
        setUsers(Array.isArray(userData) ? userData : userData.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page, pageSize, search, locationDesc_id, condition, sortBy, sortOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/asset-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        navigate("/audit");
      } else {
        const errorData = await res.json();
        alert(`Failed to submit audit: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting audit:", error);
      alert("Failed to submit audit due to a network error");
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-4">New Asset Audit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Asset</label>
          <select
            value={form.assetId}
            onChange={(e) => setForm({ ...form, assetId: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.assetNo} - {a.assetName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Auditor</label>
          <select
            value={currentUserId}
            onChange={(e) => setForm({ ...form, checkedById: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
            disabled
          >
            {Array.isArray(users) &&
              users
                .filter((u) => u.id === currentUserId)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>

          <InputSelect
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: "", label: "All Condition" },
              { value: "Good", label: "Good" },
              { value: "Broken", label: "Broken" },
              // { value: "#N/A", label: "N/A" },
              { value: "X", label: "X" },
              { value: "poor", label: "Poor" },
            ]}
            value={form.status}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <textarea
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit Audit
        </button>
      </form>
    </motion.div>
  );
}

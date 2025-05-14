import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { navigate } from "vike/client/router";
import { useUserStore } from "@/stores/store-user-login";
import InputSelect from "@/components/ui/input-select";
import { InputUpload } from "@/components/ui/input-upload";

// Define the Asset type to fix the error
interface Asset {
  id: string;
  assetNo: string;
  assetName: string;
}

export default function NewAssetAuditPage() {
  // Get current user from store
  const { id: currentUserId, role } = useUserStore();

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
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    assetId: "",
    checkedById: currentUserId,
    status: "OK",
    remarks: "",
    images: [] as string[],
  });

  // Update form when currentUserId changes
  useEffect(() => {
    if (currentUserId) {
      setForm((prev) => ({ ...prev, checkedById: currentUserId }));
    }
  }, [currentUserId]);

  // Update form when attachments change
  useEffect(() => {
    if (Array.isArray(attachments)) {
      setForm((prev) => ({ ...prev, images: attachments }));
      console.log("Attachments updated:", attachments);
    }
  }, [attachments]);

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
    setSubmitError(null);
    
    // Ensure images are properly set in the form
    const formData = {
      ...form,
      images: Array.isArray(form.images) ? form.images : []
    };
    
    console.log("Submitting form data:", formData);
    
    try {
      const res = await fetch("/api/asset-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Response data:", data);
        navigate("/audit");
      } else {
        const errorData = await res.json();
        console.error("API error:", errorData);
        setSubmitError(errorData.error || "Unknown error");
        alert(`Failed to submit audit: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting audit:", error);
      setSubmitError("Network error");
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
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Asset</label>
          <InputSelect
            value={form.assetId}
            onChange={(e) => setForm({ ...form, assetId: e.target.value })}
            options={[
              { value: "", label: "Select Asset" },
              ...assets.map((a) => ({ value: a.id, label: `${a.assetNo} - ${a.assetName}` })),
            ]}
            
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Auditor</label>
          <InputSelect
            value={currentUserId}
            onChange={(e) => setForm({ ...form, checkedById: e.target.value })}
            options={
              role !== 'admin'
                ? [{ value: currentUserId, label: `${users.find(u => u.id === currentUserId)?.name || 'Current User'} (You)` }]
                : Array.isArray(users)
                  ? [
                      { value: "", label: "Choose user" },
                      ...users.map((u) => ({ 
                        value: u.id, 
                        label: u.id === currentUserId ? `${u.name} (You)` : u.name 
                      }))
                    ]
                  : [{ value: "", label: "Choose user" }]
            }
          />
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

        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <InputUpload 
            useCamera={true}
            cameraFacing="user" 
            value={attachments} 
            onChange={(newAttachments) => {
              console.log("InputUpload onChange:", newAttachments);
              setAttachments(newAttachments);
            }} 
          />
          <p className="text-xs text-gray-500 mt-1">Click "Open Camera" to activate your camera. Use the blue expand button for fullscreen mode. Take photos with the circular button at the bottom.</p>
          
          {/* Display current images for debugging */}
          {form.images && form.images.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Images to upload: {form.images.length}</p>
            </div>
          )}
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

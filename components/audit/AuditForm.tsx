import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/stores/store-user-login";
import InputSelect from "@/components/ui/input-select";
import { InputUpload } from "@/components/ui/input-upload";
import { Loader2 } from "lucide-react";

// Define the Asset type
interface Asset {
  id: string;
  assetNo: string;
  assetName: string;
}

// Props for the AuditForm component
interface AuditFormProps {
  assetId?: string;
  onSubmit: (formData: any) => Promise<void>;
  onCancel?: () => void;
  showAssetSelector?: boolean;
  isCompact?: boolean;
  submitButtonText?: string;
  isLoading?: boolean;
}

export default function AuditForm({
  assetId,
  onSubmit,
  onCancel,
  showAssetSelector = true,
  isCompact = false,
  submitButtonText = "Submit Audit",
  isLoading = false,
}: AuditFormProps) {
  // Get current user from store
  const { id: currentUserId, role } = useUserStore();

  // List state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    assetId: assetId || "",
    checkedById: currentUserId,
    status: "Good",
    remarks: "",
    images: [] as string[],
  });

  // Update form when assetId prop changes
  useEffect(() => {
    if (assetId) {
      setForm(prev => ({ ...prev, assetId }));
    }
  }, [assetId]);

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
    }
  }, [attachments]);

  // Fetch assets and users data
  useEffect(() => {
    Promise.all([
      fetch(`/api/assets`).then((res) => res.json()),
      fetch("/api/users").then((res) => res.json()),
    ])
      .then(([assetData, userData]) => {
        setAssets(assetData.assets || assetData);
        setUsers(Array.isArray(userData) ? userData : userData.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Ensure images are properly set in the form
    const formData = {
      ...form,
      images: Array.isArray(form.images) ? form.images : []
    };
    
    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error("Error submitting audit:", error);
      setSubmitError(error.message || "An error occurred");
    }
  };

  return (
    <motion.div
      className={`${isCompact ? '' : 'p-6 bg-white rounded-lg shadow'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {!isCompact && <h2 className="text-lg font-semibold mb-4">Asset Audit</h2>}
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {showAssetSelector && (
          <div>
            <label className="block text-sm font-medium mb-1">Asset</label>
            <InputSelect
              value={form.assetId}
              onChange={(e) => {
                if (typeof e === 'string') {
                  setForm({ ...form, assetId: e });
                } else {
                  setForm({ ...form, assetId: e.target.value });
                }
              }}
              options={[
                { value: "", label: "Select Asset" },
                ...assets.map((a) => ({ value: a.id, label: `${a.assetNo} - ${a.assetName}` })),
              ]}
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">Auditor</label>
          <InputSelect
            value={form.checkedById}
            onChange={(e) => {
              if (typeof e === 'string') {
                setForm({ ...form, checkedById: e });
              } else {
                setForm({ ...form, checkedById: e.target.value });
              }
            }}
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
          <label className="block text-sm font-medium mb-1">Status</label>
          <InputSelect
            value={form.status}
            onChange={(e) => {
              if (typeof e === 'string') {
                setForm({ ...form, status: e });
              } else {
                setForm({ ...form, status: e.target.value });
              }
            }}
            options={[
              { value: "", label: "Select Condition" },
              { value: "Good", label: "Good" },
              { value: "Broken", label: "Broken" },
              { value: "Pending", label: "Pending" },
              { value: "X", label: "X" },
              { value: "Poor", label: "Poor" },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Remarks</label>
          <textarea
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <InputUpload 
            useCamera={true}
            cameraFacing="user" 
            value={attachments} 
            onChange={(newAttachments) => {
              setAttachments(newAttachments);
            }} 
          />
          <p className="text-xs text-gray-500 mt-1">Click "Open Camera" to activate your camera. Take photos with the circular button at the bottom.</p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {submitButtonText}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 
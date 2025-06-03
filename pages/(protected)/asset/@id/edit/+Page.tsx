// pages/users/[id]/+Page.tsx
import { usePageContext } from "vike-react/usePageContext";
import { useEffect, useState } from "react";
import { Asset } from "../types";
import { Link } from "@/renderer/Link";
import {
  ArrowLeft,
  Loader2,
  ClipboardCheck,
  PlusCircle,
  History,
  ListChecks,
  FileText,
  ChevronRight,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import the extracted components
import AssetHeader from "@/components/asset/AssetHeader";
import AssetMediaSection from "@/components/asset/AssetMediaSection";
import AssetBasicInfo from "@/components/asset/AssetBasicInfo";
import AssetFinancialInfo from "@/components/asset/AssetFinancialInfo";
import NewInspectionForm from "@/components/asset/NewInspectionForm";
import InspectionLogTable, {
  InspectionLog,
} from "@/components/asset/InspectionLogTable";
import AssetVersionHistory from "@/components/asset/AssetVersionHistory";
import { useAssetForm } from "@/hooks/useAssetForm";
import axios from "axios";
import AssetForm from "@/components/forms/AssetForm";

// Type for mobile view tabs
type MobileTab = "info" | "history";

// Main component
export default function AssetDetailPage() {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [inspectionLogs, setInspectionLogs] = useState<InspectionLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showNewInspection, setShowNewInspection] = useState(false);

  // New state for mobile tab view
  const [activeTab, setActiveTab] = useState<MobileTab>("info");

  // New state for mobile tab view

  // Use the asset form hook for handling form state and operations
  const {
    form,
    editingId,
    showForm,
    handleChange,
    handleSubmit,
    startEdit,
    startCreate,
    handleCancel,
    setShowForm,
  } = useAssetForm({ onSuccess: fetchAssets });

  // Fetch asset details
  useEffect(() => {
    setLoading(true);
    fetchAssets();
  }, [id]);

  // Fetch assets with filters
  async function fetchAssets() {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/assets/by-asset-number/${id}`);

      if (data) {
        setAsset(data);
        startEdit(data);
      } else {
        // Handle direct array response
        setAsset(data);
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      setAsset(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700">Asset not found</p>
        <Link
          href="/asset"
          className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-4"
        >
          <ArrowLeft size={16} />
          Back to Assets
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <AssetHeader />
      <div className="w-full p-4 overflow-y-auto h-[600px] flex mx-auto">

      <AssetForm
        form={form}
        editingId={editingId}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        hasToolbar={false}
        />
        </div>
    </div>
  );
}

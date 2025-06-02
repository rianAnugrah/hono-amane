// pages/users/[id]/+Page.tsx
import { usePageContext } from "vike-react/usePageContext";
import { useEffect, useState } from "react";
import { Asset } from "../types";
import { Link } from "@/renderer/Link";
import { ArrowLeft, Loader2, ClipboardCheck, PlusCircle, History, ListChecks, FileText, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import the extracted components
import AssetHeader from "@/components/asset/AssetHeader";
import AssetMediaSection from "@/components/asset/AssetMediaSection";
import AssetBasicInfo from "@/components/asset/AssetBasicInfo";
import AssetFinancialInfo from "@/components/asset/AssetFinancialInfo";
import NewInspectionForm from "@/components/asset/NewInspectionForm";
import InspectionLogTable, { InspectionLog } from "@/components/asset/InspectionLogTable";
import AssetVersionHistory from "@/components/asset/AssetVersionHistory";

// Type for mobile view tabs
type MobileTab = 'info' | 'history';

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
  const [activeTab, setActiveTab] = useState<MobileTab>('info');

  // Fetch asset details
  useEffect(() => {
    setLoading(true);
    fetch(`/api/assets/by-asset-number/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAsset(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching asset:", error);
        setLoading(false);
      });
  }, [id]);

  // Fetch audit logs once the page loads, using the asset number from the route
  useEffect(() => {
    if (id) {
      fetchInspectionLogs(id);
    }
  }, [id]);

  // Function to fetch inspection logs from the audit API
  const fetchInspectionLogs = (assetNumber: string) => {
    setLogsLoading(true);
    // Use the assetNo (which is the route parameter) directly
    fetch(`/api/asset-audit/by-asset-number/${assetNumber}`)
      .then(res => {
        //console.log(`Fetching inspection logs for asset number: ${assetNumber}`);
        if (!res.ok) {
          throw new Error(`Error fetching audit logs: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Transform audit data to match our InspectionLog interface
        //console.log(`Fetched ${Array.isArray(data) ? data.length : 0} inspection logs for asset number: ${assetNumber}`);
        const formattedLogs: InspectionLog[] = Array.isArray(data) 
          ? data.map(audit => {
              // Get auditor name from auditUsers if available
              let auditorName = 'Unknown';
              if (audit.auditUsers && audit.auditUsers.length > 0 && audit.auditUsers[0].user) {
                auditorName = audit.auditUsers[0].user.name || audit.auditUsers[0].user.email || 'Unknown';
              }
              
              return {
                id: audit.id,
                date: audit.checkDate || audit.createdAt,
                inspector: auditorName,
                status: mapAuditStatus(audit.status || 'pending'),
                notes: audit.remarks || '',
                assetId: audit.assetId,
                images: audit.images
              };
            })
          : [];
        
        setInspectionLogs(formattedLogs);
        setLogsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching audit logs:", error);
        setLogsLoading(false);
      });
  };

  // Map audit status values to our standard status values
  const mapAuditStatus = (auditStatus: string): 'good' | 'broken' | 'pending' | 'x' | 'poor' => {
    const status = auditStatus.toLowerCase();
    if (status === 'pass' || status === 'passed' || status === 'completed' || status === 'approved' || status === 'good') {
      return 'good';
    } else if (status === 'fail' || status === 'failed' || status === 'rejected' || status === 'broken') {
      return 'broken';
    } else if (status === 'x') {
      return 'x';
    } else if (status === 'poor') {
      return 'poor';
    }
    return 'pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-600 font-medium">Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Asset not found</h2>
            <p className="text-gray-600 mb-6">The asset you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/asset" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Back to Assets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderAssetInfoSection = () => (
    <div className="space-y-8">
      {/* Media Section */}
      <div className="lg:hidden">
        <AssetMediaSection asset={asset} />
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Media (Desktop Only) */}
        <div className="hidden lg:block">
          <AssetMediaSection asset={asset} />
        </div>

        {/* Middle & Right: Asset Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <AssetBasicInfo asset={asset} />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <AssetFinancialInfo asset={asset} />
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderVersionHistorySection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <History size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Version History</h2>
          <p className="text-sm text-gray-600">Track changes and updates to this asset</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <AssetVersionHistory assetNo={asset.assetNo} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AssetHeader />

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'info' 
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Info size={18} />
                Asset Information
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'history' 
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <History size={18} />
                Version History
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mobile View (Tab-based) */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {renderAssetInfoSection()}
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderVersionHistorySection()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop View (Split Layout) */}
        <div className="hidden lg:block space-y-12">
          {/* Asset Information Section */}
          <section>
            {renderAssetInfoSection()}
          </section>

          {/* Version History Section */}
          <section>
            {renderVersionHistorySection()}
          </section>
        </div>
      </div>
    </div>
  );
}

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
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700">Asset not found</p>
        <Link href="/asset" className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-4">
          <ArrowLeft size={16} />
          Back to Assets
        </Link>
      </div>
    );
  }

  const renderAssetInfoSection = () => (
    <div className="flex flex-col  gap-6 h-[calc(100vh-200px)] overflow-y-auto">
      <AssetMediaSection asset={asset} />

      {/* Right column: Asset Details */}
      <div className="flex-grow grid grid-cols-1  gap-x-8 gap-y-0">
        <AssetBasicInfo asset={asset} />
        <AssetFinancialInfo asset={asset} />
      </div>
    </div>
  );
  
  const renderVersionHistorySection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <History size={20} className="text-blue-500" />
          Version History
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-4">
        <AssetVersionHistory assetNo={asset.assetNo} />
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto">
      <AssetHeader />

      {/* Mobile Tab Navigation - Only visible on mobile */}
      <div className="md:hidden border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'info' 
                ? 'text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Info size={16} />
              Asset Info
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'history' 
                ? 'text-blue-600 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <History size={16} />
              History
            </div>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Mobile view (tab-based) */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {renderAssetInfoSection()}
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderVersionHistorySection()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop view (split view) */}
        <div className="hidden md:flex w-full gap-6">
          {/* Asset Info Section */}
          <div>
            {renderAssetInfoSection()}
          </div>

          {/* Asset Version History Section - Always visible on desktop */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {renderVersionHistorySection()}
          </div>
        </div>
      </div>
    </div>
  );
}

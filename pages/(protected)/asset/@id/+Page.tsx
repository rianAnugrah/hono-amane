// pages/users/[id]/+Page.tsx
import { usePageContext } from "@/renderer/usePageContext";
import { useEffect, useState } from "react";
import { Asset } from "../types";
import { Link } from "@/renderer/Link";
import { ArrowLeft, Loader2, ClipboardCheck, PlusCircle, History } from "lucide-react";

// Import the extracted components
import AssetHeader from "@/components/asset/AssetHeader";
import AssetMediaSection from "@/components/asset/AssetMediaSection";
import AssetBasicInfo from "@/components/asset/AssetBasicInfo";
import AssetFinancialInfo from "@/components/asset/AssetFinancialInfo";
import NewInspectionForm from "@/components/asset/NewInspectionForm";
import InspectionLogTable, { InspectionLog } from "@/components/asset/InspectionLogTable";
import AssetVersionHistory from "@/components/asset/AssetVersionHistory";

// Main component
export default function AssetDetailPage() {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [inspectionLogs, setInspectionLogs] = useState<InspectionLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showNewInspection, setShowNewInspection] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

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
        console.log(`Fetching inspection logs for asset number: ${assetNumber}`);
        if (!res.ok) {
          throw new Error(`Error fetching audit logs: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Transform audit data to match our InspectionLog interface
        console.log(`Fetched ${Array.isArray(data) ? data.length : 0} inspection logs for asset number: ${assetNumber}`);
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

  return (
    <div className="max-w-7xl mx-auto">
      <AssetHeader />

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AssetMediaSection asset={asset} />

          {/* Right column: Asset Details */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
            <AssetBasicInfo asset={asset} />
            <AssetFinancialInfo asset={asset} />
          </div>
        </div>

     

        {/* Asset Version History Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <History size={20} className="text-gray-400" />
              Version History
            </h2>
            <button 
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
            >
              {showVersionHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>

          {/* Version History Component */}
          {showVersionHistory && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-4">
              <AssetVersionHistory assetNo={asset.assetNo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

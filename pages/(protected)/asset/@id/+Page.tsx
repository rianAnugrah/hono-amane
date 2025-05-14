// pages/users/[id]/+Page.tsx
import { usePageContext } from "@/renderer/usePageContext";
import { useEffect, useState } from "react";
import { Asset } from "../types";
import { QRCodeCanvas } from "qrcode.react";
import {
  formatDate,
  formatIDR,
  formatUSD,
} from "@/components/utils/formatting";
import { 
  Calendar, 
  DollarSign, 
  Tag, 
  MapPin, 
  FileText, 
  Package, 
  Bookmark, 
  ShoppingBag,
  AlertTriangle,
  Hash,
  Calendar as CalendarIcon,
  ArrowLeft,
  Loader2,
  Download,
  ClipboardCheck,
  Plus,
  PlusCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ImageWithFallback, hasValidImages } from "@/components/utils/ImageUtils";
import { Link } from "@/renderer/Link";
import { motion } from "framer-motion";

// Item component for displaying asset properties
const DetailItem = ({ 
  label, 
  value, 
  highlight = false,
  icon
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 group">
    {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
    <div className="flex-grow">
      <dt className="text-xs font-medium text-gray-500 mb-1">{label}</dt>
      <dd className={`${highlight ? "text-blue-600 font-semibold" : "text-gray-800"} text-sm`}>
        {value || "—"}
      </dd>
    </div>
  </div>
);

// Inspection log data interface
interface InspectionLog {
  id: string;
  date: string;
  inspector: string;
  status: 'passed' | 'failed' | 'pending';
  notes: string;
  assetId?: string;
}

export default function AssetDetailPage() {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [inspectionLogs, setInspectionLogs] = useState<InspectionLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showNewInspection, setShowNewInspection] = useState(false);
  const [newInspection, setNewInspection] = useState<Partial<InspectionLog>>({
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: '',
    inspector: 'Current User'
  });

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
          ? data.map(audit => ({
              id: audit.id,
              date: audit.auditDate || audit.createdAt,
              inspector: audit.auditor || audit.createdBy || 'Unknown',
              status: mapAuditStatus(audit.status || 'pending'),
              notes: audit.notes || audit.description || '',
              assetId: audit.assetId
            }))
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
  const mapAuditStatus = (auditStatus: string): 'passed' | 'failed' | 'pending' => {
    const status = auditStatus.toLowerCase();
    if (status === 'pass' || status === 'passed' || status === 'completed' || status === 'approved') {
      return 'passed';
    } else if (status === 'fail' || status === 'failed' || status === 'rejected') {
      return 'failed';
    }
    return 'pending';
  };

  // Handle saving new inspection
  const handleSaveInspection = () => {
    if (!asset?.id) return;

    const newLog: InspectionLog = {
      id: Date.now().toString(),
      date: newInspection.date || new Date().toISOString().split('T')[0],
      inspector: newInspection.inspector || 'Unknown',
      status: newInspection.status as 'passed' | 'failed' | 'pending',
      notes: newInspection.notes || '',
      assetId: asset.id
    };
    
    // Show loading state
    setLogsLoading(true);
    
    // Post the new audit to the API using the correct endpoint
    fetch('/api/asset-audit/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assetNumber: asset.assetNo, // Use asset number instead of ID
        auditDate: newLog.date,
        auditor: newLog.inspector,
        status: newLog.status,
        notes: newLog.notes
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create audit log');
        }
        return response.json();
      })
      .then(data => {
        console.log('Successfully created audit log:', data);
        // If successful, add the newly created audit to the list
        const createdAudit: InspectionLog = {
          id: data.id || newLog.id,
          date: data.auditDate || newLog.date,
          inspector: data.auditor || newLog.inspector,
          status: mapAuditStatus(data.status) || newLog.status,
          notes: data.notes || newLog.notes,
          assetId: data.assetId || asset.id
        };
        
        setInspectionLogs([createdAudit, ...inspectionLogs]);
        setShowNewInspection(false);
        setNewInspection({
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          notes: '',
          inspector: 'Current User'
        });
        setLogsLoading(false);
      })
      .catch(error => {
        console.error('Error creating audit log:', error);
        alert('Failed to save inspection. Please try again.');
        setLogsLoading(false);
      });
  };

  const hasImages = asset && hasValidImages(asset.images);

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
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/asset" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Asset Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column: QR Code and Images */}
          <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
            {/* QR Code Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col items-center">
              <QRCodeCanvas
                value={asset.assetNo}
                size={120}
                className="rounded"
                bgColor="#f9fafb"
                fgColor="#1e40af"
                level="M"
              />
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                <Hash size={12} />
                <span className="font-mono">{asset.assetNo}</span>
              </div>
            </div>
            
            {/* Image Gallery - Vertically stacked on mobile, horizontal on desktop */}
            {hasImages && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" />
                  Asset Images
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {asset.images.map((image, index) => (
                    <a 
                      key={index} 
                      href={image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block aspect-square rounded-lg overflow-hidden border border-gray-100 hover:border-blue-300 transition-all hover:shadow-md"
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${asset.assetName} - Image ${index + 1}`}
                        assetName={asset.assetName}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
                
                {/* View all images button if more than 4 */}
                {asset.images.length > 4 && (
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2">
                    View all {asset.images.length} images
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right column: Asset Details */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
            {/* Asset Basic Info */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-800 mb-4">Asset Information</h3>
              
              <DetailItem 
                label="Asset Name"
                value={asset.assetName}
                highlight={true}
                icon={<Bookmark size={16} />}
              />
              
              <DetailItem 
                label="Condition" 
                value={
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      asset.condition === "Good"
                        ? "bg-green-50 text-green-700"
                        : asset.condition === "Broken"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    <AlertTriangle size={12} />
                    {asset.condition}
                  </span>
                }
                icon={<AlertTriangle size={16} />}
              />
              
              <DetailItem 
                label="Project Code" 
                value={asset.projectCode?.code || "N/A"}
                icon={<Tag size={16} />}
              />
              
              <DetailItem 
                label="Line No" 
                value={asset.lineNo}
                icon={<Hash size={16} />}
              />
              
              <DetailItem 
                label="Category Code" 
                value={asset.categoryCode}
                icon={<Package size={16} />}
              />
              
              <DetailItem 
                label="Location" 
                value={asset.locationDesc?.description || "N/A"}
                icon={<MapPin size={16} />}
              />
              
              {asset.detailsLocation?.description && (
                <DetailItem 
                  label="Area" 
                  value={asset.detailsLocation.description}
                  icon={<MapPin size={16} />}
                />
              )}
              
              <DetailItem 
                label="PIS Date" 
                value={formatDate(asset.pisDate)}
                icon={<Calendar size={16} />}
              />
              
              <DetailItem 
                label="Trans Date" 
                value={formatDate(asset.transDate)}
                icon={<CalendarIcon size={16} />}
              />
              
              {asset.remark && (
                <DetailItem 
                  label="Remark" 
                  value={asset.remark}
                  icon={<FileText size={16} />}
                />
              )}
            </div>

            {/* Financial Details */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-800 mb-4">Financial Information</h3>
              
              <DetailItem 
                label="Acquisition Value (IDR)" 
                value={formatIDR(asset.acqValueIdr)}
                highlight
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="Acquisition Value (USD)" 
                value={formatUSD(asset.acqValue)}
                highlight
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="Accumulated Depreciation" 
                value={asset.accumDepre.toLocaleString()}
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="YTD Depreciation" 
                value={asset.ytdDepre.toLocaleString()}
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="Book Value" 
                value={asset.bookValue.toLocaleString()}
                highlight
                icon={<DollarSign size={16} />}
              />
              
              <DetailItem 
                label="Adjusted Depreciation" 
                value={asset.adjustedDepre.toLocaleString()}
                icon={<DollarSign size={16} />}
              />
              
              {asset.afeNo && (
                <DetailItem 
                  label="AFE No" 
                  value={asset.afeNo}
                  icon={<FileText size={16} />}
                />
              )}
              
              {asset.poNo && (
                <DetailItem 
                  label="PO No" 
                  value={asset.poNo}
                  icon={<ShoppingBag size={16} />}
                />
              )}
            </div>
          </div>
        </div>

        {/* Inspection Log Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardCheck size={20} className="text-gray-400" />
              Inspection Log
            </h2>
            <button 
              onClick={() => setShowNewInspection(true)}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <PlusCircle size={16} />
              New Inspection
            </button>
          </div>

          {/* New Inspection Form */}
          {showNewInspection && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-blue-800">New Inspection Entry</h3>
                <button onClick={() => setShowNewInspection(false)} className="text-blue-600 p-1 hover:bg-blue-100 rounded-full">
                  <XCircle size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newInspection.date} 
                    onChange={(e) => setNewInspection({...newInspection, date: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Inspector</label>
                  <input 
                    type="text" 
                    value={newInspection.inspector} 
                    onChange={(e) => setNewInspection({...newInspection, inspector: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="status" 
                      value="passed" 
                      checked={newInspection.status === 'passed'}
                      onChange={() => setNewInspection({...newInspection, status: 'passed'})}
                      className="text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Passed</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="status" 
                      value="failed" 
                      checked={newInspection.status === 'failed'}
                      onChange={() => setNewInspection({...newInspection, status: 'failed'})}
                      className="text-red-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Failed</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="status" 
                      value="pending" 
                      checked={newInspection.status === 'pending'}
                      onChange={() => setNewInspection({...newInspection, status: 'pending'})}
                      className="text-yellow-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pending</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  value={newInspection.notes} 
                  onChange={(e) => setNewInspection({...newInspection, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter inspection notes here..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowNewInspection(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveInspection}
                  disabled={logsLoading}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {logsLoading && <Loader2 size={14} className="animate-spin" />}
                  Save Inspection
                </button>
              </div>
            </motion.div>
          )}

          {/* Inspection Log Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {logsLoading && !showNewInspection ? (
              <div className="py-10 text-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading inspection logs...</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inspectionLogs.length > 0 ? (
                    inspectionLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.inspector}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              log.status === 'passed' 
                                ? 'bg-green-100 text-green-800' 
                                : log.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {log.status === 'passed' && <CheckCircle size={12} className="mr-1" />}
                            {log.status === 'failed' && <XCircle size={12} className="mr-1" />}
                            {log.status === 'pending' && <AlertTriangle size={12} className="mr-1" />}
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{log.notes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No inspection logs found for this asset.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

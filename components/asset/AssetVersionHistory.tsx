import { useEffect, useState } from "react";
import { Asset } from "@/pages/(protected)/asset/types";
import { History, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/helpers";

interface AssetVersionHistoryProps {
  assetNo: string;
}

interface AssetVersion extends Asset {
  createdAt: string;
  updatedAt: string;
}

const AssetVersionHistory = ({ assetNo }: AssetVersionHistoryProps) => {
  const [versions, setVersions] = useState<AssetVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchVersionHistory();
  }, [assetNo]);

  const fetchVersionHistory = async () => {
    if (!assetNo) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/assets/versions/${assetNo}`);
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      } else {
        console.error("Failed to fetch asset version history");
      }
    } catch (error) {
      console.error("Error fetching asset version history:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVersionDetails = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Helper function to find changes between versions
  const getChanges = (currentVersion: AssetVersion, index: number): Record<string, { old: any, new: any }> => {
    if (index === versions.length - 1) {
      // This is the first version, so everything is new
      return {};
    }
    
    const previousVersion = versions[index + 1];
    const changes: Record<string, { old: any, new: any }> = {};
    
    // Fields to compare (excluding metadata fields)
    const fieldsToCompare = [
      'assetName', 'lineNo', 'condition', 'remark', 'categoryCode', 'afeNo', 
      'poNo', 'acqValueIdr', 'acqValue', 'accumDepre', 'ytdDepre', 'bookValue', 
      'taggingYear', 'pisDate', 'transDate'
    ];
    
    fieldsToCompare.forEach(field => {
      const currentValue = (currentVersion as any)[field];
      const previousValue = (previousVersion as any)[field];
      
      if (currentValue !== previousValue) {
        changes[field] = {
          old: previousValue,
          new: currentValue,
        };
      }
    });
    
    // Check location changes
    if (currentVersion.locationDesc?.id !== previousVersion.locationDesc?.id) {
      changes['location'] = {
        old: previousVersion.locationDesc?.description,
        new: currentVersion.locationDesc?.description,
      };
    }
    
    // Check detailed location changes
    if (currentVersion.detailsLocation?.id !== previousVersion.detailsLocation?.id) {
      changes['detailedLocation'] = {
        old: previousVersion.detailsLocation?.description,
        new: currentVersion.detailsLocation?.description,
      };
    }
    
    // Check project code changes
    if (currentVersion.projectCode?.id !== previousVersion.projectCode?.id) {
      changes['projectCode'] = {
        old: previousVersion.projectCode?.code,
        new: currentVersion.projectCode?.code,
      };
    }
    
    return changes;
  };

  // Format the change in a user-friendly way
  const formatChange = (fieldName: string, change: { old: any, new: any }) => {
    const formatValue = (value: any) => {
      if (value === null || value === undefined) return 'N/A';
      if (value instanceof Date || (typeof value === 'string' && value.includes('T'))) {
        return formatDate(value);
      }
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      return value;
    };

    // Friendly field names
    const fieldLabels: Record<string, string> = {
      'assetName': 'Asset Name',
      'lineNo': 'Line Number',
      'condition': 'Condition',
      'remark': 'Remarks',
      'categoryCode': 'Category Code',
      'afeNo': 'AFE Number',
      'poNo': 'PO Number',
      'acqValueIdr': 'Acquisition Value (IDR)',
      'acqValue': 'Acquisition Value',
      'accumDepre': 'Accumulated Depreciation',
      'ytdDepre': 'YTD Depreciation',
      'bookValue': 'Book Value',
      'taggingYear': 'Tagging Year',
      'pisDate': 'PIS Date',
      'transDate': 'Transaction Date',
      'location': 'Location',
      'detailedLocation': 'Detailed Location',
      'projectCode': 'Project Code',
    };

    const friendlyName = fieldLabels[fieldName] || fieldName;
    return (
      <div key={fieldName} className="py-2 border-b border-gray-100 last:border-0">
        <span className="font-medium">{friendlyName}:</span>{' '}
        <span className="text-red-500 line-through mr-2">{formatValue(change.old)}</span>
        <span className="text-green-500">{formatValue(change.new)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No version history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version, index) => {
        const changes = getChanges(version, index);
        const changeCount = Object.keys(changes).length;
        
        return (
          <div key={version.id} className="border border-gray-200 rounded-md overflow-hidden">
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
              onClick={() => toggleVersionDetails(version.id)}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">Version {version.version}</span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {new Date(version.updatedAt).toLocaleDateString()}
                </span>
                {index === 0 && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    Current
                  </span>
                )}
                {changeCount > 0 && index !== versions.length - 1 && (
                  <span className="text-xs text-gray-500">
                    {changeCount} change{changeCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button 
                className="text-gray-400 hover:text-gray-700"
                aria-label={expanded[version.id] ? "Collapse" : "Expand"}
              >
                <svg 
                  className={`w-5 h-5 transition-transform ${expanded[version.id] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {expanded[version.id] && (
              <div className="p-3 border-t border-gray-200 bg-white">
                {index === versions.length - 1 ? (
                  <div className="text-gray-500 italic">Initial version</div>
                ) : changeCount > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(changes).map(([field, change]) => 
                      formatChange(field, change)
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No changes in this version</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AssetVersionHistory; 
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

// Define interface for the change object
interface ChangeItem {
  old: any;
  new: any;
  removedCount?: number;
  addedCount?: number;
  currentCount?: number;
  previousCount?: number;
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
  const getChanges = (currentVersion: AssetVersion, index: number): Record<string, ChangeItem> => {
    if (index === versions.length - 1) {
      // This is the first version, so everything is new
      return {};
    }
    
    const previousVersion = versions[index + 1];
    const changes: Record<string, ChangeItem> = {};
    
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
    
    // Check for image changes
    const currentImages = currentVersion.images || [];
    const previousImages = previousVersion.images || [];
    
    // Compare image arrays
    if (JSON.stringify(currentImages) !== JSON.stringify(previousImages)) {
      // Find added images
      const addedImages = currentImages.filter(img => !previousImages.includes(img));
      
      // Find removed images
      const removedImages = previousImages.filter(img => !currentImages.includes(img));
      
      changes['images'] = {
        old: removedImages.length > 0 ? removedImages : null,
        new: addedImages.length > 0 ? addedImages : null,
        removedCount: removedImages.length,
        addedCount: addedImages.length,
        currentCount: currentImages.length,
        previousCount: previousImages.length
      };
    }
    
    return changes;
  };

  // Format the change in a user-friendly way
  const formatChange = (fieldName: string, change: ChangeItem) => {
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
      'images': 'Images',
    };

    const friendlyName = fieldLabels[fieldName] || fieldName;

    // Special handling for images
    if (fieldName === 'images') {
      return (
        <div key={fieldName} className="py-2 border-b border-gray-100 last:border-0">
          <span className="font-medium">{friendlyName}:</span>
          <div className="mt-1">
            {change.removedCount && change.removedCount > 0 ? (
              <div className="text-red-500">Removed {change.removedCount} image{change.removedCount !== 1 ? 's' : ''}</div>
            ) : null}
            {change.addedCount && change.addedCount > 0 ? (
              <div className="text-green-500">Added {change.addedCount} image{change.addedCount !== 1 ? 's' : ''}</div>
            ) : null}
            <div className="text-gray-500 text-sm">
              Total images: {change.currentCount} (Previously: {change.previousCount})
            </div>
            
            {/* Preview of added images */}
            {Array.isArray(change.new) && change.new.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium mb-1">Added images:</div>
                <div className="flex flex-wrap gap-2">
                  {change.new.slice(0, 3).map((img: string, i: number) => (
                    <div key={i} className="border border-green-200 rounded overflow-hidden w-16 h-16">
                      <img src={img} alt={`Added ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {change.new.length > 3 && (
                    <div className="flex items-center justify-center w-16 h-16 border border-green-200 rounded bg-green-50 text-green-700">
                      +{change.new.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Preview of removed images */}
            {Array.isArray(change.old) && change.old.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium mb-1">Removed images:</div>
                <div className="flex flex-wrap gap-2">
                  {change.old.slice(0, 3).map((img: string, i: number) => (
                    <div key={i} className="border border-red-200 rounded overflow-hidden w-16 h-16 opacity-70">
                      <img src={img} alt={`Removed ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {change.old.length > 3 && (
                    <div className="flex items-center justify-center w-16 h-16 border border-red-200 rounded bg-red-50 text-red-700">
                      +{change.old.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

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
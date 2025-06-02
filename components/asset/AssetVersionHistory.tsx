import React, { useEffect, useState } from "react";
import { Asset } from "@/pages/(protected)/asset/types";
import { 
  History, 
  Loader2, 
  ChevronDown, 
  Clock, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  FileArchive, 
  ArrowRight, 
  ThumbsUp,
  Bookmark,
  Hash,
  MapPin,
  DollarSign,
  FileText,
  Camera
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { motion, AnimatePresence } from "framer-motion";

interface AssetVersionHistoryProps {
  assetNo: string;
}

interface AssetVersion extends Asset {
  createdAt: string;
  updatedAt: string;
}

// Define interface for the change object
interface ChangeItem {
  old: unknown;
  new: unknown;
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
        
        // Auto-expand the first item if there are versions
        if (data.length > 0) {
          setExpanded({ [data[0].id]: true });
        }
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
      const currentValue = (currentVersion as unknown as Record<string, unknown>)[field];
      const previousValue = (previousVersion as unknown as Record<string, unknown>)[field];
      
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
    const formatValue = (value: unknown) => {
      if (value === null || value === undefined) return 'N/A';
      if (value instanceof Date || (typeof value === 'string' && value.includes('T'))) {
        return formatDate(value as string);
      }
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      return String(value);
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
        <div key={fieldName} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Camera size={16} className="text-blue-500" />
            <span className="font-semibold text-gray-800">{friendlyName}</span>
          </div>
          <div className="space-y-3">
            {change.removedCount && change.removedCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-red-700 flex items-center gap-2 mb-2 text-sm font-medium">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Removed {change.removedCount} image{change.removedCount !== 1 ? 's' : ''}
                </div>
                
                {/* Preview of removed images */}
                {Array.isArray(change.old) && change.old.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {change.old.slice(0, 3).map((img: string, i: number) => (
                      <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-red-300 opacity-70 relative bg-gray-100">
                        <div className="absolute inset-0 bg-red-100/50 backdrop-blur-[1px]"></div>
                        <img src={img} alt={`Removed ${i+1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {change.old.length > 3 && (
                      <div className="flex items-center justify-center w-16 h-16 border border-red-300 rounded-lg bg-red-100 text-red-700 font-medium text-xs">
                        +{change.old.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {change.addedCount && change.addedCount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-green-700 flex items-center gap-2 mb-2 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Added {change.addedCount} image{change.addedCount !== 1 ? 's' : ''}
                </div>
                
                {/* Preview of added images */}
                {Array.isArray(change.new) && change.new.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {change.new.slice(0, 3).map((img: string, i: number) => (
                      <motion.div 
                        key={i} 
                        className="w-16 h-16 rounded-lg overflow-hidden border border-green-300 shadow-sm bg-gray-100"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img src={img} alt={`Added ${i+1}`} className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                    {change.new.length > 3 && (
                      <div className="flex items-center justify-center w-16 h-16 border border-green-300 rounded-lg bg-green-100 text-green-700 font-medium text-xs">
                        +{change.new.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="text-gray-600 text-sm bg-gray-100 px-3 py-2 rounded-lg">
              Total images: <span className="font-medium">{change.currentCount}</span> (Previously: {change.previousCount})
            </div>
          </div>
        </div>
      );
    }

    return (
      <motion.div 
        key={fieldName} 
        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          {getFieldIcon(fieldName)}
          <span className="font-semibold text-gray-800">{friendlyName}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm line-through">
            {formatValue(change.old)}
          </div>
          <ArrowRight size={16} className="text-gray-400" />
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
            {formatValue(change.new)}
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Helper function to get an icon for each field type
  const getFieldIcon = (fieldName: string) => {
    const iconSize = 16;
    const iconMap: Record<string, JSX.Element> = {
      'assetName': <Bookmark size={iconSize} className="text-blue-500" />,
      'lineNo': <Hash size={iconSize} className="text-gray-500" />,
      'condition': <AlertCircle size={iconSize} className="text-yellow-500" />,
      'pisDate': <Calendar size={iconSize} className="text-blue-500" />,
      'transDate': <Calendar size={iconSize} className="text-green-500" />,
      'location': <MapPin size={iconSize} className="text-red-500" />,
      'detailedLocation': <MapPin size={iconSize} className="text-red-500" />,
      'projectCode': <FileArchive size={iconSize} className="text-indigo-500" />,
      'acqValueIdr': <DollarSign size={iconSize} className="text-blue-500" />,
      'acqValue': <DollarSign size={iconSize} className="text-blue-500" />,
    };
    
    return iconMap[fieldName] || <FileText size={iconSize} className="text-gray-500" />;
  };

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="text-center">
            <p className="text-gray-600 font-medium">Loading version history...</p>
            <p className="text-gray-500 text-sm mt-1">Retrieving asset changes</p>
          </div>
        </div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-70" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Version History Available</h3>
          <p className="text-gray-500 max-w-md mx-auto">Changes to this asset will be tracked here. Once modifications are made, you'll see a detailed history of all updates.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {versions.map((version, index) => {
        const changes = getChanges(version, index);
        const changeCount = Object.keys(changes).length;
        const isFirst = index === 0;
        const isExpanded = expanded[version.id] || false;
        const date = new Date(version.updatedAt);
        
        return (
          <motion.div 
            key={version.id} 
            className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 ${
              isExpanded ? 'border-blue-200 ring-4 ring-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            variants={itemVariants}
            whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            <motion.div 
              className="flex items-center justify-between p-6 cursor-pointer group"
              onClick={() => toggleVersionDetails(version.id)}
            >
              <div className="flex items-center gap-4">
                {isFirst ? (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                    <ThumbsUp size={20} />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Clock size={20} />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg text-gray-800">Version {version.version}</span>
                    {isFirst && (
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} />
                      {date.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })} at {date.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {changeCount > 0 && index !== versions.length - 1 && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200 font-medium">
                        {changeCount} change{changeCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isExpanded 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}
              >
                <ChevronDown 
                  size={20} 
                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
                />
              </motion.div>
            </motion.div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-gray-100">
                    {index === versions.length - 1 ? (
                      <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl">
                        <FileArchive size={24} className="mb-3 text-gray-500" />
                        <p className="font-semibold text-gray-700">Initial Version</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Created on {new Date(version.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : changeCount > 0 ? (
                      <div className="space-y-4 mt-4">
                        {Object.entries(changes).map(([field, change]) => 
                          formatChange(field, change)
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl mt-4">
                        <p className="font-semibold text-gray-700">No Changes in This Version</p>
                        <p className="text-sm text-gray-500 mt-1">This version was saved without modifications</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default AssetVersionHistory; 
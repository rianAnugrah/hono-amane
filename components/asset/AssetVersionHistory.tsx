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
        <div key={fieldName} className="py-3 border-b border-gray-100 last:border-0">
          <span className="font-medium text-gray-700 flex items-center gap-1.5">
            <Camera size={14} className="text-blue-500" />
            {friendlyName}:
          </span>
          <div className="mt-2 ml-5">
            {change.removedCount && change.removedCount > 0 ? (
              <div className="text-red-500 flex items-center gap-1.5 mb-2 text-sm">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                Removed {change.removedCount} image{change.removedCount !== 1 ? 's' : ''}
              </div>
            ) : null}
            {change.addedCount && change.addedCount > 0 ? (
              <div className="text-green-500 flex items-center gap-1.5 mb-2 text-sm">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                Added {change.addedCount} image{change.addedCount !== 1 ? 's' : ''}
              </div>
            ) : null}
            <div className="text-gray-500 text-sm mt-1 bg-gray-50 py-1 px-2 rounded-md inline-block">
              Total images: {change.currentCount} (Previously: {change.previousCount})
            </div>
            
            {/* Preview of added images */}
            {Array.isArray(change.new) && change.new.length > 0 && (
              <motion.div 
                className="mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-sm font-medium mb-2 text-green-700 flex items-center gap-1">
                  <Sparkles size={12} />
                  Added images:
                </div>
                <div className="flex flex-wrap gap-2">
                  {change.new.slice(0, 3).map((img: string, i: number) => (
                    <motion.div 
                      key={i} 
                      className="border border-green-200 rounded-md overflow-hidden w-20 h-20 shadow-sm"
                      whileHover={{ scale: 1.05, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    >
                      <img src={img} alt={`Added ${i+1}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  {change.new.length > 3 && (
                    <div className="flex items-center justify-center w-20 h-20 border border-green-200 rounded-md bg-green-50 text-green-700 font-medium">
                      +{change.new.length - 3}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Preview of removed images */}
            {Array.isArray(change.old) && change.old.length > 0 && (
              <motion.div 
                className="mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-sm font-medium mb-2 text-red-700 flex items-center gap-1">
                  <Sparkles size={12} />
                  Removed images:
                </div>
                <div className="flex flex-wrap gap-2">
                  {change.old.slice(0, 3).map((img: string, i: number) => (
                    <div key={i} className="border border-red-200 rounded-md overflow-hidden w-20 h-20 opacity-70 relative">
                      <div className="absolute inset-0 bg-red-100/30 backdrop-blur-[1px]"></div>
                      <img src={img} alt={`Removed ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {change.old.length > 3 && (
                    <div className="flex items-center justify-center w-20 h-20 border border-red-200 rounded-md bg-red-50 text-red-700 font-medium">
                      +{change.old.length - 3}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      );
    }

    return (
      <motion.div 
        key={fieldName} 
        className="py-3 border-b border-gray-100 last:border-0"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="font-medium text-gray-700 flex items-center gap-1.5">
          {getFieldIcon(fieldName)}
          {friendlyName}:
        </span>
        <div className="mt-1 flex items-baseline gap-2 flex-wrap ml-5">
          <div className="text-red-500 line-through bg-red-50 px-2 py-1 rounded text-sm border border-red-100">
            {formatValue(change.old)}
          </div>
          <ArrowRight size={14} className="text-gray-400" />
          <div className="text-green-600 bg-green-50 px-2 py-1 rounded text-sm font-medium border border-green-100">
            {formatValue(change.new)}
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Helper function to get an icon for each field type
  const getFieldIcon = (fieldName: string) => {
    const iconSize = 14;
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
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading version history...</p>
        </div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-gray-500 text-center p-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <History className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-70" />
        <p className="text-gray-700 font-medium text-lg">No version history available</p>
        <p className="text-gray-500 text-sm mt-2">Changes to this asset will be tracked here</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-5"
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
            className={`border ${isExpanded ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'} rounded-lg overflow-hidden shadow-sm transition-all duration-200`}
            variants={itemVariants}
            whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', y: -2 }}
          >
            <motion.div 
              className="flex items-center justify-between p-4 cursor-pointer group"
              onClick={() => toggleVersionDetails(version.id)}
            >
              <div className="flex items-center gap-3">
                {isFirst ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-sm">
                    <ThumbsUp size={16} />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                    <Clock size={16} />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">Version {version.version}</span>
                    {isFirst && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium border border-green-200">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="inline-flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {date.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      <span className="mx-1 text-gray-400">•</span>
                      {date.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {changeCount > 0 && index !== versions.length - 1 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                        {changeCount} change{changeCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-8 h-8 rounded-full ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} flex items-center justify-center transition-colors group-hover:bg-blue-100 group-hover:text-blue-600`}
              >
                <ChevronDown 
                  size={18} 
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
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {index === versions.length - 1 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-600 bg-gray-50/80 rounded-lg">
                        <FileArchive size={20} className="mb-2 text-gray-500" />
                        <p className="font-medium">Initial version</p>
                        <p className="text-xs mt-1 text-gray-500">Created on {new Date(version.createdAt).toLocaleDateString()}</p>
                      </div>
                    ) : changeCount > 0 ? (
                      <div className="space-y-1 pl-2">
                        {Object.entries(changes).map(([field, change]) => 
                          formatChange(field, change)
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-600 bg-gray-50/80 rounded-lg">
                        <p className="font-medium">No changes in this version</p>
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
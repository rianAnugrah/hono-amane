import { useState, useEffect } from "react";
import { usePageContext } from "@/renderer/usePageContext";
import { navigate } from "vike/client/router";
import { Filter, FilterX, PlusCircle, Search, ArrowLeft, Edit, Save, X, Trash2, CheckSquare, PlusSquare, Square, ChevronRight, Tag, ScanLine } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowSize } from '@/hooks/useWindowSize';

type Inspector = {
  id: string;
  name: string | null;
  email: string;
};

type Asset = {
  id: string;
  assetNo: string;
  assetName: string;
  condition: string;
  version: number;
  remark?: string | null;
  locationDesc?: {
    id: number;
    description: string;
  } | null;
  detailsLocation?: {
    id: number;
    description: string;
  } | null;
};

type InspectionItem = {
  id: string;
  asset: Asset;
  assetVersion: number;
};

type Inspection = {
  id: string;
  date: string;
  notes: string | null;
  inspector: Inspector;
  items: InspectionItem[];
};

// Define form state interface
interface InspectionForm {
  id?: string;
  date: string;
  notes: string;
  inspectorId: string;
  items: string[]; // Array of asset IDs
}

type ViewMode = 'list' | 'detail' | 'form';

export default function InspectionMasterPage() {
  const pageContext = usePageContext();
  const initialDetailId = pageContext.routeParams?.id;
  
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialDetailId ? 'detail' : 'list');
  const [formData, setFormData] = useState<InspectionForm>({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    inspectorId: '',
    items: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [inspectorOptions, setInspectorOptions] = useState<{id: string, name: string}[]>([]);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false; // 768px is typical md breakpoint
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState(false);
  const [conditionFilter, setConditionFilter] = useState<string>('All');

  // Fetch inspections data
  useEffect(() => {
    fetchInspections();
    fetchInspectors();
    fetchAvailableAssets();
  }, []);

  // Fetch detail data if ID is provided
  useEffect(() => {
    if (initialDetailId) {
      fetchInspectionDetail(initialDetailId);
    }
  }, [initialDetailId]);

  // Fetch inspections data
  const fetchInspections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inspections');
      
      if (!res.ok) {
        throw new Error('Failed to fetch inspection data');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setInspections(data.data);
      } else {
        throw new Error(data.error || 'Failed to load inspection data');
      }
    } catch (err) {
      console.error('Error fetching inspection data:', err);
      setError('Failed to load inspection data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single inspection detail
  const fetchInspectionDetail = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/inspections/${id}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch inspection detail');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setSelectedInspection(data.data);
        setViewMode('detail');
      } else {
        throw new Error(data.error || 'Failed to load inspection detail');
      }
    } catch (err) {
      console.error('Error fetching inspection detail:', err);
      setError('Failed to load inspection detail. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch inspectors for the dropdown
  const fetchInspectors = async () => {
    try {
      const res = await fetch('/api/users');
      
      if (!res.ok) {
        throw new Error('Failed to fetch inspectors');
      }
      
      const data = await res.json();
      
      if (data) {
        const inspectors = Array.isArray(data) ? data : data.data || [];
        setInspectorOptions(inspectors.map((user: Inspector) => ({
          id: user.id,
          name: user.name || user.email
        })));
      }
    } catch (err) {
      console.error('Error fetching inspectors:', err);
    }
  };

  // Fetch available assets
  const fetchAvailableAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      
      if (!res.ok) {
        throw new Error('Failed to fetch assets');
      }
      
      const data = await res.json();
      
      if (data) {
        const assets = Array.isArray(data) ? data : data.assets || [];
        setAvailableAssets(assets);
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
    }
  };

  // Filter inspections based on search input
  const filteredInspections = inspections.filter(inspection => {
    const inspectorName = inspection.inspector?.name || '';
    const searchTerm = search.toLowerCase();
    
    return (
      inspection.id.toLowerCase().includes(searchTerm) || 
      inspectorName.toLowerCase().includes(searchTerm)
    );
  });

  // Filter assets based on search input and condition filter
  const filteredAssets = availableAssets.filter(asset => {
    const searchTerm = assetSearch.toLowerCase();
    const matchesSearch = !searchTerm || 
      asset.assetName.toLowerCase().includes(searchTerm) ||
      asset.assetNo.toLowerCase().includes(searchTerm) ||
      asset.condition.toLowerCase().includes(searchTerm);
    
    const matchesCondition = conditionFilter === 'All' || asset.condition === conditionFilter;
    
    return matchesSearch && matchesCondition;
  });

  // Handle inspection selection
  const handleInspectionSelect = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setViewMode('detail');
    // Update URL to include the selected inspection ID
    navigate(`/inspection/master?id=${inspection.id}`, { keepScrollPosition: true });
  };

  // Back to list in mobile view
  const handleBackToList = () => {
    setSelectedInspection(null);
    setViewMode('list');
    // Update URL to remove the ID
    navigate('/inspection/master', { keepScrollPosition: true });
  };

  // Handle new inspection
  const handleNewInspection = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      notes: '',
      inspectorId: inspectorOptions.length > 0 ? inspectorOptions[0].id : '',
      items: []
    });
    setIsEditing(false);
    setViewMode('form');
  };

  // Handle edit inspection
  const handleEditInspection = () => {
    if (selectedInspection) {
      setFormData({
        id: selectedInspection.id,
        date: selectedInspection.date,
        notes: selectedInspection.notes || '',
        inspectorId: selectedInspection.inspector.id,
        items: selectedInspection.items.map(item => item.asset.id)
      });
      setIsEditing(true);
      setViewMode('form');
    }
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle asset selection in form
  const handleAssetSelection = (assetId: string) => {
    setFormData(prev => {
      const isAlreadySelected = prev.items.includes(assetId);
      
      if (isAlreadySelected) {
        return {
          ...prev,
          items: prev.items.filter(id => id !== assetId)
        };
      } else {
        return {
          ...prev,
          items: [...prev.items, assetId]
        };
      }
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/inspections/${formData.id}` : '/api/inspections';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspector_id: formData.inspectorId,
          date: formData.date,
          notes: formData.notes.trim() || null,
          // We wouldn't send items directly in a real API call
          // This would typically be handled separately by adding items one by one
          // But for simplicity in this demo, we're pretending to send them
          items: formData.items
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (isEditing) {
          // Update the inspection in the list
          setInspections(prev => prev.map(item => 
            item.id === formData.id ? data.data : item
          ));
          // Update the selected inspection
          setSelectedInspection(data.data);
        } else {
          // Add the new inspection to the list
          setInspections(prev => [...prev, data.data]);
          // Select the new inspection
          setSelectedInspection(data.data);
        }
        
        // Return to detail view
        setViewMode('detail');
        
        // Update URL
        navigate(`/inspection/master?id=${data.data.id}`, { keepScrollPosition: true });
      } else {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} inspection`);
      }
    } catch (error) {
      console.error('Error saving inspection:', error);
      setError(`Failed to ${isEditing ? 'update' : 'create'} inspection. Please try again.`);
    }
  };

  // Handle delete inspection
  const handleDeleteInspection = async () => {
    if (!selectedInspection || !window.confirm('Are you sure you want to delete this inspection?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/inspections/${selectedInspection.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the inspection from the list
        setInspections(prev => prev.filter(item => item.id !== selectedInspection.id));
        // Clear the selected inspection
        setSelectedInspection(null);
        // Return to list view
        setViewMode('list');
        // Update URL
        navigate('/inspection/master', { keepScrollPosition: true });
      } else {
        throw new Error(data.error || 'Failed to delete inspection');
      }
    } catch (error) {
      console.error('Error deleting inspection:', error);
      setError('Failed to delete inspection. Please try again.');
    }
  };

  // Handle cancel form
  const handleCancelForm = () => {
    if (selectedInspection) {
      setViewMode('detail');
    } else {
      setViewMode('list');
      navigate('/inspection/master', { keepScrollPosition: true });
    }
  };

  // Handle scan mode toggle
  const handleScanModeToggle = () => {
    setScanMode(!scanMode);
    if (!scanMode) {
      // Focus on scan input when enabling scan mode
      setTimeout(() => {
        const scanInput = document.getElementById('barcode-scan-input');
        if (scanInput) {
          (scanInput as HTMLInputElement).focus();
        }
      }, 100);
    }
  };

  // Handle barcode scan
  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value.trim();
      if (value) {
        // Find asset by barcode/assetNo
        const asset = availableAssets.find(a => a.assetNo === value);
        if (asset) {
          setSelectedAsset(asset);
          setExpandedAsset(asset.id);
          // Add to inspection if in edit mode
          if (viewMode === 'form' && !formData.items.includes(asset.id)) {
            handleAssetSelection(asset.id);
          }
        } else {
          alert('Asset not found with barcode: ' + value);
        }
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  // Handle asset expansion
  const toggleAssetExpansion = (assetId: string) => {
    if (expandedAsset === assetId) {
      setExpandedAsset(null);
    } else {
      setExpandedAsset(assetId);
      const asset = availableAssets.find(a => a.id === assetId);
      if (asset) {
        setSelectedAsset(asset);
      }
    }
  };

  // Rendering functions
  const renderToolbar = () => (
    <div className="sticky top-0 z-10 bg-gray-100 shadow-none border-b border-gray-200 mb-0">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-3 items-center py-4 gap-3">
          {/* Title/Back Button */}
          {isMobile && (viewMode === 'detail' || viewMode === 'form') ? (
            <div className="col-span-2 md:col-span-1 flex items-center">
              <button 
                onClick={handleBackToList} 
                className="flex items-center gap-2 text-blue-600"
              >
                <ArrowLeft size={18} />
                <span>Back to list</span>
              </button>
            </div>
          ) : (
            <>
              {/* Search Input - Only show in list view */}
              <div className="col-span-2 md:col-span-1">
                {viewMode === 'list' && (
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search inspections..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                )}
                {viewMode === 'detail' && (
                  <div className="text-lg font-semibold">Inspection Details</div>
                )}
                {viewMode === 'form' && (
                  <div className="text-lg font-semibold flex items-center">
                    {isEditing ? (
                      <>
                        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded-full mr-2">Editing</span>
                        Inspection #{formData.id?.substring(0, 8)}
                      </>
                    ) : (
                      <>New Inspection</>
                    )}
                  </div>
                )}
              </div>

              {/* Filter Button - Only show in list view */}
              <div className="flex justify-center md:justify-start">
                {viewMode === 'list' && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn btn-soft btn-sm flex items-center gap-1"
                  >
                    {!showFilters ? <Filter size={14} /> : <FilterX size={14} />} Filter
                  </button>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            {viewMode === 'list' && (
              <button
                onClick={handleNewInspection}
                className="btn btn-sm btn-primary btn-soft flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" /> 
                <span className="hidden md:inline">New Inspection</span>
                <span className="md:hidden">New</span>
              </button>
            )}
            {viewMode === 'detail' && (
              <div className="flex gap-2">
                <button
                  onClick={handleEditInspection}
                  className="btn btn-sm btn-primary btn-soft flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" /> 
                  <span className="hidden md:inline">Edit</span>
                  <span className="md:hidden">Edit</span>
                </button>
                <button
                  onClick={handleDeleteInspection}
                  className="btn btn-sm btn-soft text-red-600 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> 
                  <span className="hidden md:inline">Delete</span>
                  <span className="md:hidden">Delete</span>
                </button>
              </div>
            )}
            {viewMode === 'form' && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelForm}
                  className="btn btn-sm btn-soft flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> 
                  <span className="hidden md:inline">Cancel</span>
                  <span className="md:hidden">Cancel</span>
                </button>
                <button
                  form="inspection-form"
                  type="submit"
                  className="btn btn-sm btn-primary btn-soft flex items-center gap-1"
                >
                  <Save className="w-4 h-4" /> 
                  <span className="hidden md:inline">Save</span>
                  <span className="md:hidden">Save</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && viewMode === 'list' && (
            <motion.div
              initial={{ height: 0, opacity: 0, overflow: "hidden" }}
              animate={{ height: "auto", opacity: 1, overflow: "visible" }}
              exit={{ height: 0, opacity: 0, overflow: "hidden" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="pb-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-2 rounded-lg">
                <div>
                  <select 
                    className="w-full rounded border py-2 px-4 bg-white"
                    defaultValue="All"
                  >
                    <option value="All">All Inspectors</option>
                    {inspectorOptions.map(inspector => (
                      <option key={inspector.id} value={inspector.id}>
                        {inspector.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select 
                    className="w-full rounded border py-2 px-4 bg-white"
                    defaultValue="date"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="inspector">Sort by Inspector</option>
                    <option value="assets">Sort by Assets Count</option>
                  </select>
                </div>
                
                <div>
                  <select 
                    className="w-full rounded border py-2 px-4 bg-white"
                    defaultValue="desc"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setShowFilters(false);
                }}
                className="btn btn-lg w-[calc(100%_-_2rem)] md:w-auto md:btn-sm text-blue-400 mb-4"
              >
                Reset Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderInspectionList = () => (
    <div className={`${isMobile && viewMode !== 'list' ? 'hidden' : 'block'} md:block ${viewMode !== 'list' ? 'md:w-1/4' : 'w-full'}`}>
      {loading && viewMode === 'list' ? (
        <div className="flex-grow flex items-center justify-center text-gray-600 p-6">
          <div>Loading...</div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      ) : filteredInspections.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-600 p-6">
          <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">
            No inspection records found.
          </div>
        </div>
      ) : (
        <div className="overflow-auto p-4">
          <h2 className="text-lg font-medium mb-4 text-gray-800">Inspection List</h2>
          <div className="space-y-4">
            {filteredInspections.map((inspection) => (
              <div 
                key={inspection.id} 
                className={`p-4 border rounded-lg bg-white shadow-sm cursor-pointer transition hover:shadow-md ${selectedInspection?.id === inspection.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleInspectionSelect(inspection)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {new Date(inspection.date).toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Inspector: {inspection.inspector?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {inspection.items.length} assets
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderInspectionDetail = () => {
    if (!selectedInspection) {
      return (
        <div className="hidden md:flex md:w-3/4 items-center justify-center bg-gray-50 text-gray-400 border-l h-full">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">👈</div>
            <p className="text-xl">Select an inspection to view details</p>
          </div>
        </div>
      );
    }

    if (isMobile && viewMode !== 'detail') return null;

    return (
      <div className={`${isMobile && viewMode !== 'detail' ? 'hidden' : 'block'} md:block ${viewMode === 'form' ? 'md:w-2/4' : 'md:w-3/4'} overflow-auto border-l`}>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Inspection on {new Date(selectedInspection.date).toLocaleDateString()}
                </h2>
                <p className="text-lg text-gray-600 mt-1">
                  Inspector: {selectedInspection.inspector?.name || 'Unknown'}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-soft flex items-center gap-1">
                  <span>Print</span>
                </button>
                <button className="btn btn-sm btn-soft flex items-center gap-1">
                  <span>Export</span>
                </button>
              </div>
            </div>

            {selectedInspection.notes && (
              <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-gray-800 mb-2">Notes</h3>
                <p className="text-gray-700">{selectedInspection.notes}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Inspected Assets</h3>
              <div className="bg-gray-50 rounded-lg border">
                <div className="p-3 border-b bg-gray-100 text-sm font-medium text-gray-700 grid grid-cols-4">
                  <div>Asset Name</div>
                  <div>Asset No.</div>
                  <div>Condition</div>
                  <div>Version</div>
                </div>
                <div className="divide-y">
                  {selectedInspection.items.map((item) => (
                    <div key={item.id} className="p-3 text-sm text-gray-800 grid grid-cols-4">
                      <div>{item.asset.assetName}</div>
                      <div>{item.asset.assetNo}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.asset.condition === 'Good' ? 'bg-green-100 text-green-800' : 
                          item.asset.condition === 'Broken' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.asset.condition}
                        </span>
                      </div>
                      <div>v{item.asset.version}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInspectionForm = () => {
    if (viewMode !== 'form') {
      return null;
    }

    return (
      <div className={`${isMobile ? 'block' : 'md:block md:w-1/3'} overflow-auto border-l`}>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form id="inspection-form" onSubmit={handleFormSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspection Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspector
                  </label>
                  <select
                    name="inspectorId"
                    value={formData.inspectorId}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select an inspector</option>
                    {inspectorOptions.map(inspector => (
                      <option key={inspector.id} value={inspector.id}>
                        {inspector.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assets to Inspect ({formData.items.length})
                  </label>
                  <div className="border border-gray-300 rounded-md p-4 bg-gray-50 max-h-80 overflow-y-auto">
                    {formData.items.length === 0 ? (
                      <div className="text-gray-500 text-center py-4">
                        <div className="mb-2 text-gray-400">No assets selected</div>
                        <p className="text-sm">Use the asset browser panel to add assets to this inspection.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.items.map((assetId) => {
                          const asset = availableAssets.find(a => a.id === assetId);
                          return asset ? (
                            <div key={asset.id} className="flex items-start justify-between bg-white p-2 rounded border border-gray-200">
                              <div className="flex-1">
                                <div className="font-medium text-sm truncate">{asset.assetName}</div>
                                <div className="text-xs text-gray-500">Asset No: {asset.assetNo}</div>
                              </div>
                              <div className="flex items-center">
                                <span className={`mr-2 px-2 py-1 rounded-full text-xs ${
                                  asset.condition === 'Good' ? 'bg-green-100 text-green-800' : 
                                  asset.condition === 'Broken' ? 'bg-red-100 text-red-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {asset.condition}
                                </span>
                                <button 
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                  onClick={() => handleAssetSelection(asset.id)}
                                  title="Remove from inspection"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
            
            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 md:static bg-white border-t border-gray-200 p-4 md:border md:rounded-lg md:mt-4 md:shadow-sm">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {formData.items.length} assets selected for inspection
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="btn btn-sm btn-soft flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> 
                    <span>Cancel</span>
                  </button>
                  <button
                    form="inspection-form"
                    type="submit"
                    className="btn btn-sm btn-primary flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> 
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssetBrowser = () => {
    if (viewMode !== 'form') {
      return null;
    }

    return (
      <div className={`hidden md:block md:w-1/3 overflow-auto border-l bg-gray-50`}>
        <div className="p-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Asset Browser</h3>
              <div className="flex gap-2">
                <button 
                  className={`btn btn-sm ${scanMode ? 'btn-primary' : 'btn-soft'} flex items-center gap-1`}
                  onClick={handleScanModeToggle}
                >
                  <ScanLine size={16} />
                  <span>Scan</span>
                </button>
              </div>
            </div>

            {scanMode && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Scan Barcode
                </label>
                <input 
                  id="barcode-scan-input"
                  type="text" 
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Scan barcode..."
                  autoFocus
                  onKeyDown={handleBarcodeScan}
                />
              </div>
            )}

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search assets..."
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Condition filter tabs */}
            <div className="flex mb-4 overflow-x-auto pb-1 gap-1">
              {['All', 'Good', 'Broken', 'X', 'poor'].map(condition => (
                <button
                  key={condition}
                  className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${
                    conditionFilter === condition
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setConditionFilter(condition)}
                >
                  {condition}
                  {condition !== 'All' && (
                    <span className="ml-1 text-xs">
                      ({availableAssets.filter(a => a.condition === condition).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="max-h-[calc(100vh-320px)] overflow-y-auto rounded-lg border border-gray-200">
              {filteredAssets.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  No assets found matching your search.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} className="bg-white">
                      <div 
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition ${expandedAsset === asset.id ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleAssetExpansion(asset.id)}
                      >
                        <div className="mr-3">
                          {formData.items.includes(asset.id) ? (
                            <CheckSquare 
                              className="text-blue-600 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssetSelection(asset.id);
                              }}
                            />
                          ) : (
                            <Square 
                              className="text-gray-400 hover:text-blue-600 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssetSelection(asset.id);
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{asset.assetName}</div>
                          <div className="text-sm text-gray-500">Asset No: {asset.assetNo}</div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            asset.condition === 'Good' ? 'bg-green-100 text-green-800' : 
                            asset.condition === 'Broken' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {asset.condition}
                          </span>
                        </div>
                        <ChevronRight 
                          className={`ml-2 transition-transform duration-200 ${expandedAsset === asset.id ? 'transform rotate-90' : ''}`} 
                          size={18} 
                        />
                      </div>
                      
                      {/* Expanded Asset View */}
                      {expandedAsset === asset.id && (
                        <div className="p-4 bg-blue-50 border-t border-blue-100">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                              <div className="mt-1 text-sm">{asset.assetName}</div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Asset No</label>
                              <div className="mt-1 text-sm flex items-center">
                                <Tag size={14} className="mr-1 text-gray-500" /> {asset.assetNo}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Condition</label>
                              <div className="mt-1 text-sm">{asset.condition} (Version {asset.version})</div>
                            </div>
                            {asset.locationDesc && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <div className="mt-1 text-sm">{asset.locationDesc.description}</div>
                              </div>
                            )}
                            {asset.remark && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                                <div className="mt-1 text-sm">{asset.remark}</div>
                              </div>
                            )}
                            <div className="pt-2">
                              <button 
                                className="btn btn-sm btn-soft text-blue-600 mr-2"
                                onClick={() => window.open(`/asset/edit/${asset.id}`, '_blank')}
                              >
                                Edit Asset
                              </button>
                              <button 
                                className={`btn btn-sm ${formData.items.includes(asset.id) ? 'btn-soft text-red-600' : 'btn-primary btn-soft'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssetSelection(asset.id);
                                }}
                              >
                                {formData.items.includes(asset.id) 
                                  ? 'Remove from Inspection' 
                                  : 'Add to Inspection'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {formData.items.length} assets selected for inspection
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {renderToolbar()}
      <div className="flex flex-grow overflow-hidden">
        {renderInspectionList()}
        {(viewMode === 'detail' || (!isMobile && viewMode !== 'form')) && renderInspectionDetail()}
        {viewMode === 'form' && renderInspectionForm()}
        {viewMode === 'form' && renderAssetBrowser()}
      </div>
    </div>
  );
}
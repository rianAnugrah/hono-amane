import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/renderer/Link'
import { navigate } from 'vike/client/router'
import InspectionDetail from '@/components/inspection/InspectionDetail'
import InspectionForm from '@/components/inspection/InspectionForm'
import type { Inspection, InspectionItem, Asset } from '@/components/inspection/InspectionDetail'

export default function InspectionListPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null)
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isFullView, setIsFullView] = useState(false)
  const [showNewInspectionForm, setShowNewInspectionForm] = useState(false)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [filterByInspector, setFilterByInspector] = useState("")
  const [filterByDateRange, setFilterByDateRange] = useState<{start: string, end: string}>({
    start: "",
    end: ""
  })
  const [inspectors, setInspectors] = useState<Array<{id: string, name: string}>>([])
  const [showFilters, setShowFilters] = useState(false)

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const loadInspections = () => {
    setLoading(true);
    fetch('/api/inspections')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch inspection data')
        }
        return res.json()
      })
      .then((data) => {
        if (data.success) {
          setInspections(data.data)
          setFilteredInspections(data.data)
          
          // Extract unique inspectors for filter dropdown
          const uniqueInspectors = Array.from(
            new Set(
              data.data
                .filter((inspection: Inspection) => inspection.inspector && inspection.inspector.id)
                .map((inspection: Inspection) => JSON.stringify({
                  id: inspection.inspector.id,
                  name: inspection.inspector.name || inspection.inspector.email || 'Unknown'
                }))
            )
          ).map((str) => JSON.parse(str as string));
          
          setInspectors(uniqueInspectors);
        } else {
          throw new Error(data.error || 'Failed to load inspection data')
        }
      })
      .catch((err) => {
        console.error('Error fetching inspection data:', err)
        setError('Failed to load inspection data. Please try again later.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadInspections();
  }, [])

  // Apply filters to inspections
  useEffect(() => {
    if (!inspections.length) return;
    
    let filtered = [...inspections];
    
    // Apply search filter (on date and inspector name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(inspection => 
        (inspection.date && new Date(inspection.date).toLocaleDateString().toLowerCase().includes(query)) ||
        (inspection.inspector?.name && inspection.inspector.name.toLowerCase().includes(query)) ||
        (inspection.inspector?.email && inspection.inspector.email.toLowerCase().includes(query)) ||
        (inspection.notes && inspection.notes.toLowerCase().includes(query))
      );
    }
    
    // Apply inspector filter
    if (filterByInspector) {
      filtered = filtered.filter(inspection => 
        inspection.inspector && inspection.inspector.id === filterByInspector
      );
    }
    
    // Apply date range filter
    if (filterByDateRange.start || filterByDateRange.end) {
      filtered = filtered.filter(inspection => {
        const inspectionDate = new Date(inspection.date);
        const startDate = filterByDateRange.start ? new Date(filterByDateRange.start) : new Date(0);
        const endDate = filterByDateRange.end ? new Date(filterByDateRange.end) : new Date(8640000000000000); // Max date
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        return inspectionDate >= startDate && inspectionDate <= endDate;
      });
    }
    
    setFilteredInspections(filtered);
  }, [inspections, searchQuery, filterByInspector, filterByDateRange]);

  // Function to fetch inspection details when an inspection is selected
  const handleSelectInspection = async (id: string) => {
    // On mobile, navigate to the detail page
    if (isMobile) {
      navigate(`/inspection/${id}`)
      return
    }
    
    // On desktop, show in split view
    setLoadingDetails(true)
    setDetailsError(null)
    setSelectedAsset(null)
    setSelectedInspectionId(id);
    setShowNewInspectionForm(false);
    
    try {
      const response = await fetch(`/api/inspections/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch inspection details')
      }
      
      const data = await response.json()
      if (data.success) {
        setSelectedInspection(data.data)
      } else {
        throw new Error(data.error || 'Failed to load inspection details')
      }
    } catch (err) {
      console.error('Error fetching inspection details:', err)
      setDetailsError('Failed to load inspection details. Please try again later.')
      setSelectedInspection(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  // Function when details are updated from child component
  const handleDetailsChange = (updatedInspection: Inspection) => {
    setSelectedInspection(updatedInspection);
    
    // Also update the inspection in the list view
    setInspections(prev => 
      prev.map(insp => 
        insp.id === updatedInspection.id ? updatedInspection : insp
      )
    );
  }

  // Handle successful creation of a new inspection
  const handleInspectionCreated = (newInspectionId: string) => {
    // Refresh the inspections list
    loadInspections();
    
    // Select the newly created inspection
    setShowNewInspectionForm(false);
    handleSelectInspection(newInspectionId);
  }

  // Toggle between split view and full view
  const toggleFullView = () => {
    setIsFullView(!isFullView)
    setSelectedAsset(null) // Clear selected asset when toggling view
  }

  // Function to fetch asset details
  const handleSelectAsset = async (asset: Asset) => {
    setSelectedAsset(asset)
  }

  // Render the inspections list
  const renderInspectionsList = () => {
    if (loading) {
      return <div className="p-4">Loading...</div>;
    }
    
    if (error) {
      return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
    }
    
    if (inspections.length === 0) {
      return <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">No inspection records found.</div>;
    }
    
    if (filteredInspections.length === 0) {
      return <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">No inspections match the current filters.</div>;
    }
    
    return (
      <motion.div
        className="grid gap-4 overflow-y-auto pb-20"
        style={{ maxHeight: isMobile ? 'none' : 'calc(100vh - 180px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredInspections.map((inspection) => {
          const inspectorName = inspection.inspector?.name || 'Unknown'
          const itemCount = inspection.items.length
          const isSelected = selectedInspection?.id === inspection.id
          
          return (
            <div
              key={inspection.id}
              className={`p-4 border rounded-xl bg-white shadow hover:shadow-lg transition cursor-pointer ${
                isSelected && !isMobile ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleSelectInspection(inspection.id)}
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-medium">
                    Inspection on {new Date(inspection.date).toLocaleDateString()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Inspector: {inspectorName}
                  </p>
                  <p className="text-sm mt-1">
                    Assets inspected: {itemCount}
                  </p>
                </div>
                <button
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md self-start hover:bg-blue-200 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent div's onClick
                    handleSelectInspection(inspection.id);
                  }}
                >
                  View
                </button>
              </div>
              
              {inspection.notes && (
                <p className="text-sm mt-2 text-gray-700">
                  Notes: {inspection.notes}
                </p>
              )}
            </div>
          )
        })}
      </motion.div>
    );
  };

  // Render asset details panel
  const renderAssetDetails = () => {
    if (!selectedAsset) {
      return (
        <div className="flex items-center justify-center h-60 text-gray-500">
          <p>Select an asset to view details</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{selectedAsset.assetName}</h3>
          <button 
            onClick={() => setSelectedAsset(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Asset Number</p>
              <p>{selectedAsset.assetNo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Condition</p>
              <p>{selectedAsset.condition}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Version</p>
              <p>{selectedAsset.version}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p>{selectedAsset.locationDesc?.description || 'Not specified'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Detail Location</p>
            <p>{selectedAsset.detailsLocation?.description || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Remarks</p>
            <p className="whitespace-pre-wrap">{selectedAsset.remark || 'No remarks'}</p>
          </div>
          
          <div className="pt-4 border-t">
            <Link
              href={`/asset/${selectedAsset.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              View Full Asset Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Render the "create new inspection" panel
  const renderNewInspectionForm = () => {
    return (
      <div className="bg-white rounded-xl shadow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create New Inspection</h2>
            <button
              onClick={() => setShowNewInspectionForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <InspectionForm 
            onBack={() => setShowNewInspectionForm(false)} 
            onSuccess={handleInspectionCreated}
          />
        </div>
      </div>
    );
  };

  // Render search and filters UI
  const renderSearchAndFilters = () => {
    return (
      <div className="mb-4 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-2">
          {/* Search input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inspections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('');
                    e.currentTarget.blur();
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
          >
            <span>Filters</span>
            <span>{showFilters ? '▲' : '▼'}</span>
          </button>
        </div>
        
        {/* Collapsible filter panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t">
            {/* Inspector filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Inspector
              </label>
              <select
                value={filterByInspector}
                onChange={(e) => setFilterByInspector(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Inspectors</option>
                {inspectors.map((inspector) => (
                  <option key={inspector.id} value={inspector.id}>
                    {inspector.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  placeholder="Start date"
                  value={filterByDateRange.start}
                  onChange={(e) => setFilterByDateRange({...filterByDateRange, start: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  placeholder="End date"
                  value={filterByDateRange.end}
                  onChange={(e) => setFilterByDateRange({...filterByDateRange, end: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Clear filters button */}
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterByInspector('');
                  setFilterByDateRange({start: '', end: ''});
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Results count */}
        <div className="mt-3 text-sm text-gray-500">
          {filteredInspections.length} {filteredInspections.length === 1 ? 'inspection' : 'inspections'} found
          {filteredInspections.length !== inspections.length && ` (filtered from ${inspections.length})`}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-100 z-10 py-3 -mx-6 px-6 shadow-sm">
        <h1 className="text-2xl font-bold">Asset Inspections</h1>
        {!isMobile && !showNewInspectionForm ? (
          <button
            onClick={() => {
              setShowNewInspectionForm(true);
              setSelectedInspectionId(null);
              setSelectedAsset(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + New Inspection
          </button>
        ) : (
          <Link
            href="/inspection/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + New Inspection
          </Link>
        )}
      </div>

      {/* Desktop view: enhanced layout with full view option */}
      {!isMobile ? (
        isFullView ? (
          <div className="grid grid-cols-5 gap-6">
            {/* Left side: Inspections list - smaller when in full view */}
            <div className="col-span-1 overflow-hidden">
              {renderSearchAndFilters()}
              {renderInspectionsList()}
            </div>

            {/* Right side: Full inspection details using component */}
            <div className="col-span-4 bg-white rounded-xl shadow overflow-hidden max-h-[calc(100vh-180px)]">
              {showNewInspectionForm ? (
                renderNewInspectionForm()
              ) : selectedInspectionId ? (
                <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={toggleFullView}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition"
                    >
                      Split View
                    </button>
                  </div>
                  <InspectionDetail 
                    inspectionId={selectedInspectionId} 
                    onBack={() => setSelectedInspectionId(null)}
                    onInspectionChange={() => loadInspections()}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-60 text-gray-500">
                  <p>Select an inspection to view details or create a new one</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid ${selectedAsset ? 'grid-cols-3' : 'grid-cols-2'} gap-6`}>
            {/* Left side: Inspections list */}
            <div className={selectedAsset ? 'col-span-1' : 'col-span-1'}>
              {renderSearchAndFilters()}
              {renderInspectionsList()}
            </div>

            {/* Middle: Inspection details or New Form */}
            <div className={`bg-white rounded-xl shadow overflow-hidden ${selectedAsset ? 'col-span-1' : 'col-span-1'}`}>
              {showNewInspectionForm ? (
                renderNewInspectionForm()
              ) : selectedInspectionId ? (
                <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={toggleFullView}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition mr-2"
                    >
                      Full View
                    </button>
                    <Link
                      href={`/inspection/${selectedInspectionId}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      Go to Page
                    </Link>
                  </div>
                  <InspectionDetail 
                    inspectionId={selectedInspectionId} 
                    onBack={() => setSelectedInspectionId(null)}
                    onInspectionChange={() => loadInspections()}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-60 text-gray-500">
                  <p>Select an inspection to view details or create a new one</p>
                </div>
              )}
            </div>
            
            {/* Right side: Asset details (when an asset is selected) */}
            {selectedAsset && (
              <div className="col-span-1 bg-white rounded-xl shadow p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {renderAssetDetails()}
              </div>
            )}
          </div>
        )
      ) : (
        /* Mobile view: just the list */
        <div className="pt-2">
          {renderSearchAndFilters()}
          {renderInspectionsList()}
        </div>
      )}
    </div>
  )
} 
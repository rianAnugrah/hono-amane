import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/renderer/Link";
import { navigate } from "vike/client/router";
import InspectionDetail from "@/components/inspection/InspectionDetail";
import InspectionForm from "@/components/inspection/InspectionForm";
import type {
  Inspection as BaseInspection,
  InspectionItem,
  Asset,
} from "@/components/inspection/InspectionDetail";
import { Expand, Fullscreen } from "lucide-react";
import InputText from "@/components/ui/input-text";

// Extend the Inspection type to include status
type Inspection = BaseInspection & {
  status?: 'pending' | 'completed' | string;
};

export default function InspectionListPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);
  const [selectedInspectionId, setSelectedInspectionId] = useState<
    string | null
  >(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isFullView, setIsFullView] = useState(false);
  const [showNewInspectionForm, setShowNewInspectionForm] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByInspector, setFilterByInspector] = useState("");
  const [filterByDateRange, setFilterByDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });
  const [inspectors, setInspectors] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [showFilters, setShowFilters] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const loadInspections = () => {
    setLoading(true);
    fetch("/api/inspections")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch inspection data");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setInspections(data.data);
          setFilteredInspections(data.data);

          // Extract unique inspectors for filter dropdown
          const uniqueInspectors = Array.from(
            new Set(
              data.data
                .filter(
                  (inspection: Inspection) =>
                    inspection.inspector && inspection.inspector.id
                )
                .map((inspection: Inspection) =>
                  JSON.stringify({
                    id: inspection.inspector.id,
                    name:
                      inspection.inspector.name ||
                      inspection.inspector.email ||
                      "Unknown",
                  })
                )
            )
          ).map((str) => JSON.parse(str as string));

          setInspectors(uniqueInspectors);
        } else {
          throw new Error(data.error || "Failed to load inspection data");
        }
      })
      .catch((err) => {
        console.error("Error fetching inspection data:", err);
        setError("Failed to load inspection data. Please try again later.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInspections();
  }, []);

  // Apply filters to inspections
  useEffect(() => {
    if (!inspections.length) return;

    let filtered = [...inspections];

    // Apply search filter (on date and inspector name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (inspection) =>
          (inspection.date &&
            new Date(inspection.date)
              .toLocaleDateString()
              .toLowerCase()
              .includes(query)) ||
          (inspection.inspector?.name &&
            inspection.inspector.name.toLowerCase().includes(query)) ||
          (inspection.inspector?.email &&
            inspection.inspector.email.toLowerCase().includes(query)) ||
          (inspection.notes && inspection.notes.toLowerCase().includes(query))
      );
    }

    // Apply inspector filter
    if (filterByInspector) {
      filtered = filtered.filter(
        (inspection) =>
          inspection.inspector && inspection.inspector.id === filterByInspector
      );
    }

    // Apply date range filter
    if (filterByDateRange.start || filterByDateRange.end) {
      filtered = filtered.filter((inspection) => {
        const inspectionDate = new Date(inspection.date);
        const startDate = filterByDateRange.start
          ? new Date(filterByDateRange.start)
          : new Date(0);
        const endDate = filterByDateRange.end
          ? new Date(filterByDateRange.end)
          : new Date(8640000000000000); // Max date

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
      navigate(`/inspection/${id}`);
      return;
    }

    // On desktop, show in split view
    setLoadingDetails(true);
    setDetailsError(null);
    setSelectedAsset(null);
    setSelectedInspectionId(id);
    setShowNewInspectionForm(false);

    try {
      const response = await fetch(`/api/inspections/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch inspection details");
      }

      const data = await response.json();
      if (data.success) {
        setSelectedInspection(data.data);
      } else {
        throw new Error(data.error || "Failed to load inspection details");
      }
    } catch (err) {
      console.error("Error fetching inspection details:", err);
      setDetailsError(
        "Failed to load inspection details. Please try again later."
      );
      setSelectedInspection(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Function when details are updated from child component
  const handleDetailsChange = (updatedInspection: Inspection) => {
    setSelectedInspection(updatedInspection);

    // Also update the inspection in the list view
    setInspections((prev) =>
      prev.map((insp) =>
        insp.id === updatedInspection.id ? updatedInspection : insp
      )
    );
  };

  // Handle successful creation of a new inspection
  const handleInspectionCreated = (newInspectionId: string) => {
    // Refresh the inspections list
    loadInspections();

    // Select the newly created inspection
    setShowNewInspectionForm(false);
    handleSelectInspection(newInspectionId);
  };

  // Toggle between split view and full view
  const toggleFullView = () => {
    setIsFullView(!isFullView);
    setSelectedAsset(null); // Clear selected asset when toggling view
  };

  // Function to fetch asset details
  const handleSelectAsset = async (asset: Asset) => {
    setSelectedAsset(asset);
  };

  // Render the inspections list
  const renderInspectionsList = () => {
    if (loading) {
      return <div className="p-4">Loading...</div>;
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      );
    }

    if (inspections.length === 0) {
      return (
        <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">
          No inspection records found.
        </div>
      );
    }

    if (filteredInspections.length === 0) {
      return (
        <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">
          No inspections match the current filters.
        </div>
      );
    }

    return (
      <motion.div
        className="flex flex-col h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1  gap-4 p-4 bg-white border-b border-gray-200">
          <motion.div 
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 overflow-hidden relative hover:shadow-md transition-all"
            whileHover={{ y: -2 }}
          >
            <span className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 bg-blue-100 rounded-full opacity-30"></span>
            <h3 className="text-sm font-medium text-gray-500">Total Inspections</h3>
            <p className="text-3xl font-bold mt-2">{inspections.length}</p>
            <p className="text-xs text-gray-400 mt-1">All recorded inspections</p>
          </motion.div>
          {/* <motion.div 
            className="bg-white p-5 rounded-xl shadow-sm border border-amber-200 overflow-hidden relative hover:shadow-md transition-all"
            whileHover={{ y: -2 }}
          >
            <span className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 bg-amber-100 rounded-full opacity-30"></span>
            <h3 className="text-sm font-medium text-amber-600">Pending</h3>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              {inspections.filter(i => i.status === 'pending').length || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">Require attention</p>
          </motion.div>
          <motion.div 
            className="bg-white p-5 rounded-xl shadow-sm border border-green-200 overflow-hidden relative hover:shadow-md transition-all"
            whileHover={{ y: -2 }}
          >
            <span className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 bg-green-100 rounded-full opacity-30"></span>
            <h3 className="text-sm font-medium text-green-600">Completed</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {inspections.filter(i => i.status === 'completed').length || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">Successfully finalized</p>
          </motion.div> */}
        </div>
        
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          {renderToolbar()}
        </div>
        
        {/* Inspections List */}
        <div 
          className="overflow-y-auto flex-grow p-4 space-y-3"
          style={{ maxHeight: isMobile ? "none" : "calc(100vh - 180px)" }}
        >
          {filteredInspections.map((inspection) => {
            const inspectorName = inspection.inspector?.name || "Unknown";
            const itemCount = inspection.items.length;
            const isSelected = selectedInspection?.id === inspection.id;
            const status = inspection.status || "pending";

            return (
              <motion.div
                key={inspection.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer ${
                  isSelected && !isMobile ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectInspection(inspection.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-medium">
                        Inspection on{" "}
                        {new Date(inspection.date).toLocaleDateString()}
                      </h2>
                      <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status === 'completed' ? 'bg-green-100 text-green-800' :
                        status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Inspector: {inspectorName}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Assets inspected: {itemCount}
                      </span>
                    </p>
                  </div>
                  <motion.button
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent div's onClick
                      handleSelectInspection(inspection.id);
                    }}
                  >
                    View
                  </motion.button>
                </div>

                {inspection.notes && (
                  <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                    <p className="font-medium text-xs text-gray-500 mb-1">Notes:</p>
                    <p className="line-clamp-2">{inspection.notes}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
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
              <p>
                {selectedAsset.locationDesc?.description || "Not specified"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Detail Location</p>
            <p>
              {selectedAsset.detailsLocation?.description || "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Remarks</p>
            <p className="whitespace-pre-wrap">
              {selectedAsset.remark || "No remarks"}
            </p>
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
      <div
        className="bg-white rounded-xl shadow overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
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

  const renderToolbar = () => {
    return (
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 ">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 px-4 gap-3">
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <InputText
                type="text"
                placeholder="Search inspections..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3.5 py-2.5 ${showFilters ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-700'} rounded-lg flex items-center gap-2 transition-colors`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013.0 6V3z" clipRule="evenodd" />
              </svg>
              <span>Filters</span>
              <span className="text-xs">{showFilters ? "▲" : "▼"}</span>
            </motion.button>

            {!isMobile && !showNewInspectionForm ? (
              <motion.button
                onClick={() => {
                  setShowNewInspectionForm(true);
                  setSelectedInspectionId(null);
                  setSelectedAsset(null);
                }}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap shadow-sm flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>New Inspection</span>
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/inspection/new"
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap shadow-sm flex items-center gap-2"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>New Inspection</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Collapsible filter panel */}
        {showFilters && (
          <motion.div 
            className="bg-gray-50 border-t border-gray-200 px-6 py-4 shadow-inner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Inspector filter */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Inspector
                </label>
                <select
                  value={filterByInspector}
                  onChange={(e) => setFilterByInspector(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    placeholder="Start date"
                    value={filterByDateRange.start}
                    onChange={(e) =>
                      setFilterByDateRange({
                        ...filterByDateRange,
                        start: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    placeholder="End date"
                    value={filterByDateRange.end}
                    onChange={(e) =>
                      setFilterByDateRange({
                        ...filterByDateRange,
                        end: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border-gray-300 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Clear filters button */}
              <div className="sm:col-span-2 flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{filteredInspections.length}</span>{" "}
                  {filteredInspections.length === 1
                    ? "inspection"
                    : "inspections"}{" "}
                  found
                  {filteredInspections.length !== inspections.length &&
                    ` (filtered from ${inspections.length})`}
                </div>
                <motion.button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterByInspector("");
                    setFilterByDateRange({ start: "", end: "" });
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="p-0 h-screen overflow-y-hidden ">
      {/* Desktop view: enhanced layout with full view option */}
      {!isMobile ? (
        isFullView ? (
          <div className="grid grid-cols-5 gap-6 ">
            {/* Left side: Inspections list - smaller when in full view */}
            <div className="col-span-1 overflow-hidden bg-gray-50 h-screen">
              {renderInspectionsList()}
            </div>

            {/* Right side: Full inspection details using component */}
            <div className="col-span-4 bg-white rounded-xl shadow overflow-hidden max-h-[calc(100vh-2rem)] m-4">
              {showNewInspectionForm ? (
                renderNewInspectionForm()
              ) : selectedInspectionId ? (
                <div className="p-4 overflow-y-auto h-full">
                  <div className="flex justify-end mb-4">
                    <motion.button
                      onClick={toggleFullView}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition flex items-center gap-1.5"
                      whileHover={{ scale: 1.05 }}
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      <span>Split View</span>
                    </motion.button>
                  </div>
                  <InspectionDetail
                    inspectionId={selectedInspectionId}
                    onBack={() => setSelectedInspectionId(null)}
                    onInspectionChange={() => loadInspections()}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-60 text-gray-500">
                  <p>
                    Select an inspection to view details or create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-0 h-screen">
            {/* Left side: Inspections list */}
            <div className="col-span-4 h-screen overflow-hidden bg-gray-50 border-r border-gray-200">
              {renderInspectionsList()}
            </div>

            {/* Middle: Inspection details or New Form */}
            <div className="col-span-8 bg-white overflow-hidden h-screen">
              {showNewInspectionForm ? (
                renderNewInspectionForm()
              ) : selectedInspectionId ? (
                <div className="overflow-y-auto h-full">
                  <div className="flex justify-between items-center py-4 px-10 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Inspection Details</h2>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={toggleFullView}
                        className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition"
                        whileHover={{ scale: 1.05 }}
                        title="Full View"
                      >
                        <Fullscreen className="h-4 w-4" />
                      </motion.button>
                      <Link
                        href={`/inspection/${selectedInspectionId}`}
                        className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        <Expand className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <InspectionDetail
                      inspectionId={selectedInspectionId}
                      onBack={() => setSelectedInspectionId(null)}
                      onInspectionChange={() => loadInspections()}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500 p-8">
                  <svg className="h-12 w-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No inspection selected</p>
                  <p className="text-center max-w-md mb-6">
                    Select an inspection from the list or create a new one to view details
                  </p>
                  <motion.button
                    onClick={() => {
                      setShowNewInspectionForm(true);
                      setSelectedInspectionId(null);
                    }}
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>New Inspection</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        /* Mobile view: just the list */
        <div className="pt-2 h-full overflow-y-auto">{renderInspectionsList()}</div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/renderer/Link";
import { navigate } from "vike/client/router";
// import InspectionForm from "@/components/inspection/InspectionForm";
import type {
  Inspection as BaseInspection,
} from "@/components/inspection/InspectionDetail";
import InputText from "@/components/ui/input-text";
import InputSelect from "@/components/ui/input-select";

// Extend the Inspection type to include status and user_id fields
type Inspection = BaseInspection & {
  status?: "pending" | "in_progress" | "waiting_for_approval" | "completed" | "cancelled" | string;
  lead_user_id?: string | null;
  head_user_id?: string | null;
};

export default function InspectionListPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByInspector, setFilterByInspector] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
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

;

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

    // Apply status filter
    if (filterByStatus) {
      filtered = filtered.filter(
        (inspection) => (inspection.status || "pending") === filterByStatus
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
  }, [
    inspections,
    searchQuery,
    filterByInspector,
    filterByStatus,
    filterByDateRange,
  ]);

  // Function to navigate to inspection details (same for desktop and mobile)
  const handleSelectInspection = (id: string) => {
    navigate(`/inspection/${id}`);
  };

  // Render the inspections list
  const renderInspectionsList = () => {
    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      );
    }

    if (inspections.length === 0) {
      return (
        <div className="p-8 flex flex-col items-center justify-center text-gray-600 rounded-lg text-center w-full h-full">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Inspections Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Get started by creating your first inspection record to track and manage your assets.
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/inspection/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2 font-medium"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Create First Inspection</span>
            </Link>
          </motion.div>
        </div>
      );
    }

    if (filteredInspections.length === 0) {
      return (
        <div className="p-4 text-gray-600 rounded-lg">
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
        {/* <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border-b border-gray-200">
          <motion.div
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 overflow-hidden relative hover:shadow-md transition-all"
            whileHover={{ y: -2 }}
          >
            <span className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 bg-blue-100 rounded-full opacity-30"></span>
            <h3 className="text-sm font-medium text-gray-500">
              Total Inspections
            </h3>
            <p className="text-3xl font-bold mt-2">{inspections.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              All recorded inspections
            </p>
          </motion.div>
          <motion.div
            className="bg-white p-5 rounded-xl shadow-sm border border-amber-200 overflow-hidden relative hover:shadow-md transition-all"
            whileHover={{ y: -2 }}
          >
            <span className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 bg-amber-100 rounded-full opacity-30"></span>
            <h3 className="text-sm font-medium text-amber-600">Pending</h3>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              {
                inspections.filter((i) => i.status === "pending" || !i.status)
                  .length
              }
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
              {inspections.filter((i) => i.status === "completed").length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Successfully finalized</p>
          </motion.div>
        </div> */}

        {/* Toolbar */}
        <div className="sticky top-0 z-10 border-b border-gray-200">
          {renderToolbar()}
        </div>

        {/* Status Filter Pills - Always Visible */}
        <div className="sticky top-0 z-10  px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "" },
              { label: "In Progress", value: "in_progress" },
              { label: "Waiting for Approval", value: "waiting_for_approval" },
              { label: "Completed", value: "completed" },
            ].map((status) => (
              <motion.button
                key={status.value}
                onClick={() => setFilterByStatus(status.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterByStatus === status.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Inspections List */}
        <div
          className="overflow-y-scroll flex-grow px-3 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {filteredInspections.map((inspection) => {
            const inspectorName = inspection.inspector?.name || "Unknown";
            const itemCount = inspection.items.length;
            const status = inspection.status || "pending";

            return (
              <motion.div
                key={inspection.id}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden relative"
                whileHover={{ y: -2, scale: 1.005 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectInspection(inspection.id)}
              >
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      {/* Date Icon - Hidden on very small screens */}
                      <div className="hidden xs:flex flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl items-center justify-center shadow-sm">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      
                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {new Date(inspection.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 sm:px-3 rounded-full text-xs font-semibold flex-shrink-0 ${
                              status === "completed"
                                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                : status === "waiting_for_approval"
                                ? "bg-purple-100 text-purple-700 ring-1 ring-purple-200"
                                : status === "in_progress"
                                ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                                : status === "cancelled"
                                ? "bg-red-100 text-red-700 ring-1 ring-red-200"
                                : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                status === "completed"
                                  ? "bg-emerald-500"
                                  : status === "waiting_for_approval"
                                  ? "bg-purple-500"
                                  : status === "in_progress"
                                  ? "bg-blue-500"
                                  : status === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            <span className="hidden sm:inline">
                              {status === "in_progress"
                                ? "In Progress"
                                : status === "waiting_for_approval"
                                ? "Waiting for Approval"
                                : status === "not_applicable"
                                ? "N/A"
                                : status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <span className="sm:hidden">
                              {status === "in_progress"
                                ? "In Progress"
                                : status === "waiting_for_approval"
                                ? "Pending"
                                : status === "not_applicable"
                                ? "N/A"
                                : status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </span>
                        </div>
                        
                        {/* Inspector and Assets Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                          {/* Inspector Info */}
                          <div className="flex items-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <span className="font-medium truncate">{inspectorName}</span>
                          </div>
                          
                          {/* Assets Count */}
                          <div className="flex items-center bg-gray-50 rounded-lg px-2.5 py-1 sm:px-3 sm:py-1.5">
                            <svg
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 mr-1.5 sm:mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                              />
                            </svg>
                            <span className="font-medium text-xs sm:text-sm">{itemCount}</span>
                            <span className="ml-1 text-gray-500 text-xs sm:text-sm hidden sm:inline">
                              {itemCount === 1 ? 'asset' : 'assets'}
                            </span>
                            <span className="ml-1 text-gray-500 text-xs sm:hidden">
                              asset{itemCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 ml-3 sm:ml-4">
                      <div className="w-8 h-8 bg-gray-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center transition-colors duration-200">
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {inspection.notes && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                              Notes
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                              {inspection.notes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderToolbar = () => {
    return (
      <div className="sticky top-0  z-10 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 px-4 gap-3">
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <InputText
                type="text"
                placeholder="Search inspections..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3.5 py-2.5 ${
                showFilters
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gray-100 text-gray-700"
              } rounded-lg flex items-center gap-2 transition-colors`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013.0 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Filters</span>
              <span className="text-xs">{showFilters ? "▲" : "▼"}</span>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/inspection/new"
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap shadow-sm flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>New Inspection</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Collapsible filter panel */}
        {showFilters && (
          <motion.div
            className=" border-t border-gray-200 px-6 py-4 "
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Inspector filter */}
              <div className="space-y-1.5">
                <InputSelect
                  label="Inspector"
                  placeholder="All Inspectors"
                  value={filterByInspector}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement> | string) => {
                    const value = typeof e === 'string' ? e : e.target.value;
                    setFilterByInspector(value);
                  }}
                  options={[
                    { label: "All Inspectors", value: "" },
                    ...inspectors.map((inspector) => ({
                      label: inspector.name,
                      value: inspector.id,
                    })),
                  ]}
                />
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
                  <span className="font-medium">
                    {filteredInspections.length}
                  </span>{" "}
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
                    setFilterByStatus("");
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

  return loading ? (
    "Loading..."
  ) : (
    <div className="p-0 h-screen overflow-y-hidden">
      <div className="pt-2 h-full overflow-y-auto">
        {renderInspectionsList()}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/renderer/Link'
import { navigate } from 'vike/client/router'

type InspectionItem = {
  id: string
  asset: {
    id: string
    assetNo: string
    assetName: string
    condition: string
    version: number
  }
  assetVersion: number
}

type Inspection = {
  id: string
  date: string
  notes: string | null
  inspector: {
    id: string
    name: string | null
    email: string
  }
  items: InspectionItem[]
}

export default function InspectionListPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(() => {
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
        } else {
          throw new Error(data.error || 'Failed to load inspection data')
        }
      })
      .catch((err) => {
        console.error('Error fetching inspection data:', err)
        setError('Failed to load inspection data. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [])

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

  // Handle removing asset from inspection
  const handleRemoveAsset = async (itemId: string) => {
    if (!selectedInspection) return;

    try {
      const response = await fetch(`/api/inspections/items/${itemId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Update selected inspection state to remove the item
        setSelectedInspection((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            items: prev.items.filter((item) => item.id !== itemId),
          };
        });
      } else {
        throw new Error(data.error || "Failed to remove asset from inspection");
      }
    } catch (error) {
      console.error("Error removing asset from inspection:", error);
      setDetailsError("Failed to remove asset. Please try again.");
    }
  };

  // Update inspection notes
  const handleUpdateNotes = async (newNotes: string) => {
    if (!selectedInspection) return;

    try {
      const response = await fetch(`/api/inspections/${selectedInspection.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: newNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedInspection((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            notes: data.data.notes,
          };
        });
      } else {
        throw new Error(data.error || "Failed to update inspection notes");
      }
    } catch (error) {
      console.error("Error updating inspection notes:", error);
      setDetailsError("Failed to update notes. Please try again.");
    }
  };

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
    
    return (
      <motion.div
        className="grid gap-4 overflow-y-auto pb-20"
        style={{ maxHeight: isMobile ? 'none' : 'calc(100vh - 150px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {inspections.map((inspection) => {
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

  // Render the inspection details panel
  const renderInspectionDetails = () => {
    if (loadingDetails) {
      return (
        <div className="flex items-center justify-center h-60">
          <p>Loading inspection details...</p>
        </div>
      );
    }
    
    if (detailsError) {
      return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{detailsError}</div>;
    }
    
    if (!selectedInspection) {
      return (
        <div className="flex items-center justify-center h-60 text-gray-500">
          <p>Select an inspection to view details</p>
        </div>
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">Inspection Details</h2>
            <p className="text-gray-600">
              {new Date(selectedInspection.date).toLocaleDateString()} | Inspector:{" "}
              {selectedInspection.inspector.name || selectedInspection.inspector.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/inspection/${selectedInspection.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Full View
            </Link>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-md font-medium mb-2">Notes</h3>
          <textarea
            value={selectedInspection.notes || ""}
            onChange={(e) =>
              setSelectedInspection((prev) =>
                prev ? { ...prev, notes: e.target.value } : prev
              )
            }
            onBlur={(e) => handleUpdateNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add inspection notes..."
            rows={2}
          />
        </div>

        {/* Inspected Assets */}
        <div>
          <h3 className="text-md font-medium mb-2">Inspected Assets</h3>
          
          {selectedInspection.items.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No assets have been added to this inspection yet.
            </p>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedInspection.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{item.asset.assetNo}</td>
                      <td className="px-4 py-2">{item.asset.assetName}</td>
                      <td className="px-4 py-2">{item.asset.condition}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveAsset(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Asset Inspections</h1>
        <Link
          href="/inspection/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + New Inspection
        </Link>
      </div>

      {/* Desktop view: split layout */}
      {!isMobile ? (
        <div className="flex gap-6">
          {/* Left side: Inspections list */}
          <div className="w-1/2">
            {renderInspectionsList()}
          </div>

          {/* Right side: Inspection details */}
          <div className="w-1/2 bg-white rounded-xl shadow p-4">
            {renderInspectionDetails()}
          </div>
        </div>
      ) : (
        /* Mobile view: just the list */
        renderInspectionsList()
      )}
    </div>
  )
} 
// Empty file to start with
import { useState, useEffect } from 'react';
import { navigate } from 'vike/client/router';
import { Link } from '@/renderer/Link';
import InspectionQrScanner from '@/components/blocks/qrscan/InspectionQrScanner';
import { useAssetForm } from '@/hooks/useAssetForm';
import AssetFormModal from '@/components/asset/AssetFormModal';

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

interface InspectionDetailProps {
  inspectionId: string;
  onBack?: () => void; // Optional callback for back button
  isStandalone?: boolean; // Whether this is a standalone page or embedded
  onInspectionChange?: () => void; // Optional callback for when inspection data changes
}

const InspectionDetail = ({ inspectionId, onBack, isStandalone = false, onInspectionChange }: InspectionDetailProps) => {
  // Use the asset form hook for handling form state and operations
  const {
    form,
    editingId,
    showForm,
    handleChange,
    handleSubmit: originalHandleSubmit,
    startEdit,
    startCreate,
    handleCancel: originalHandleCancel,
    setShowForm,
  } = useAssetForm({ 
    onSuccess: (updatedAsset) => {
      console.log("Asset form successfully saved asset:", updatedAsset);
      if (updatedAsset && assetToEdit) {
        console.log("Adding updated asset to inspection from callback");
        handleAddAsset(updatedAsset);
      } else {
        // Regular asset management, just refresh the list
        handleFetchAssets();
      }
    } 
  });

  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Asset search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // QR scanner state
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scannedAssetNo, setScannedAssetNo] = useState("");

  // Asset edit state
  const [showAssetEditForm, setShowAssetEditForm] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [assetCondition, setAssetCondition] = useState("Good");
  const [assetRemarks, setAssetRemarks] = useState("");

  // Fetch inspection data
  useEffect(() => {
    if (!inspectionId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/inspections/${inspectionId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch inspection data");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setInspection(data.data);
          
          // Notify parent component that we've refreshed the data
          if (onInspectionChange) {
            onInspectionChange();
          }
        } else {
          throw new Error(data.error || "Failed to load inspection data");
        }
      })
      .catch((err) => {
        console.error("Error fetching inspection:", err);
        setError("Failed to load inspection. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [inspectionId]);

  // Fetch asset by asset number (from QR scan)
  useEffect(() => {
    if (!scannedAssetNo) return;

    setSearching(true);

    handleFetchAssets();
  }, [scannedAssetNo]);

  async function handleFetchAssets() {
    try {
      console.log("Fetching asset by asset number:", scannedAssetNo);
      const res = await fetch(`/api/assets/by-asset-number/${scannedAssetNo}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error fetching asset (${res.status}): ${errorText}`);
        throw new Error(`Failed to fetch asset: ${res.statusText}`);
      }
      
      let data;
      try {
        data = await res.json();
        console.log("Fetched asset data:", data);
      } catch (e) {
        console.error("Error parsing asset data JSON:", e);
        throw new Error("Invalid response format from asset API");
      }

      if (data && data.id) {
        // Successfully found the asset
        console.log("Asset found, setting up edit form with:", data);
        setAssetToEdit(data);
        setShowAssetEditForm(true);
        setShowQrScanner(false); // Hide scanner after successful scan
        
        // If we're scanning to edit an asset, also set the condition and remarks
        setAssetCondition(data.condition || "Good");
        setAssetRemarks(data.remark || "");
      } else {
        console.error("Asset API returned success but with invalid data:", data);
        setError(`Asset with number ${scannedAssetNo} not found or has invalid format`);
      }
    } catch (err) {
      console.error("Error fetching asset by asset number:", err);
      setError(`Failed to fetch asset details: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSearching(false);
      setScannedAssetNo("");
    }
  }

  // Add asset to inspection
  const handleAddAsset = async (asset = selectedAsset) => {
    if (!asset || !inspectionId) {
      console.error("Cannot add asset to inspection: Missing asset or inspectionId", {
        assetProvided: !!asset,
        inspectionIdProvided: !!inspectionId,
        asset: asset
      });
      return;
    }

    // Ensure asset has a version field
    if (asset.version === undefined) {
      console.error("Asset missing version field:", asset);
      setError("Cannot add asset to inspection: Missing version information");
      return;
    }

    try {
      console.log("Adding asset to inspection:", {
        inspectionId,
        assetId: asset.id,
        assetVersion: asset.version,
        assetDetails: { ...asset }
      });
      
      const requestBody = {
        inspectionId,
        assetId: asset.id,
        assetVersion: asset.version
      };
      
      console.log("Request body for adding asset:", requestBody);
      
      const response = await fetch("/api/inspections/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Add asset response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to add asset to inspection (${response.status}): ${errorText}`);
        throw new Error(`Failed to add asset: ${response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
        console.log("Add asset response:", data);
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        throw new Error("Invalid response format when adding asset");
      }

      // Check if the response is successful
      if (data && (data.success !== false)) {
        console.log("Successfully added asset to inspection");
        
        // The API might return the data directly or in a data property
        const itemData = data.data || data;
        
        console.log("Item data to add to inspection:", itemData);
        
        if (!itemData || !itemData.id) {
          console.error("Response has invalid structure:", data);
          throw new Error("Invalid response data structure");
        }
        
        // Update inspection state to include the new item
        if (inspection) {
          // Use a copy of the previous inspection data
          const updatedInspection = { ...inspection };
          
          // Create the new item if we have all necessary data
          if (asset) {
            const newItem = {
              id: itemData.id,
              asset: asset,
              assetVersion: asset.version,
            };
            
            // Add the new item to the items array
            updatedInspection.items = [...updatedInspection.items, newItem];
            
            // Update the state
            setInspection(updatedInspection);
            
            // Clear selected asset and search results
            setSelectedAsset(null);
            setSearchResults([]);
            setSearchQuery("");
            setAssetToEdit(null);
            setShowAssetEditForm(false);
            
            // Notify parent component of change if callback provided
            if (onInspectionChange) {
              onInspectionChange();
            }
            
            console.log("Updated inspection with new asset:", updatedInspection);
          } else {
            console.error("Cannot add asset to inspection: Asset data is missing");
          }
        } else {
          console.error("Cannot add asset to inspection: Inspection data is missing");
        }
      } else {
        console.error("API returned error when adding asset:", data);
        throw new Error(data.error || "Failed to add asset to inspection");
      }
    } catch (error) {
      console.error("Error adding asset to inspection:", error);
      setError(`Failed to add asset to inspection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Simple function to save asset edit without the full form
  const handleSaveAssetEdit = async () => {
    if (!assetToEdit) return;

    try {
      // Prepare the update data
      const updateData = {
        id: assetToEdit.id,
        condition: assetCondition,
        remark: assetRemarks || null,
      };

      console.log("Updating asset with data:", updateData);

      // Send the update request
      const response = await fetch(`/api/assets/${assetToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update asset: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.id) {
        throw new Error("Invalid response data from asset update");
      }

      console.log("Asset updated successfully:", data);

      // Add the updated asset to the inspection
      await handleAddAsset({
        ...assetToEdit,
        condition: assetCondition,
        remark: assetRemarks || null,
        version: data.version || assetToEdit.version
      });

      // Close the form
      setShowAssetEditForm(false);
      setAssetToEdit(null);
      
      // Notify parent component of change if callback provided
      if (onInspectionChange) {
        onInspectionChange();
      }
    } catch (err) {
      console.error("Error updating asset:", err);
      setError(`Failed to update asset: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  // Search for assets
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);

    try {
      const response = await fetch(
        `/api/assets?search=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data || []);
      } else {
        throw new Error(data.error || "Failed to search assets");
      }
    } catch (error) {
      console.error("Error searching assets:", error);
      // Show error but don't set the main error state
    } finally {
      setSearching(false);
    }
  };

  // Wrap original submit to handle the inspection-specific logic
  const handleSubmit = async () => {
    await originalHandleSubmit();
    // The onSuccess callback will handle adding the asset to inspection
    // No need to refetch or add asset here anymore
    
    // Reset state after submission is complete
    setShowAssetEditForm(false);
    setAssetToEdit(null);
  };

  // Wrap original cancel to handle inspection-specific state
  const handleCancel = () => {
    originalHandleCancel();
    // Don't hide the asset edit form if we're in edit mode
    if (!showAssetEditForm) {
      setShowForm(false);
    }
  };

  // Remove asset from inspection
  const handleRemoveAsset = async (itemId: string) => {
    if (!inspectionId || !itemId) return;

    try {
      const response = await fetch(`/api/inspections/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to remove asset: ${response.statusText}`);
      }

      // Update the state by removing the item with the matching ID
      if (inspection) {
        const updatedInspection = { ...inspection };
        updatedInspection.items = updatedInspection.items.filter(
          (item) => item.id !== itemId
        );
        setInspection(updatedInspection);
        
        // Notify parent component of change if callback provided
        if (onInspectionChange) {
          onInspectionChange();
        }
      }
    } catch (err) {
      console.error("Error removing asset from inspection:", err);
      setError("Failed to remove asset from inspection. Please try again.");
    }
  };

  // Update inspection notes
  const handleUpdateNotes = async (newNotes: string) => {
    if (!inspectionId) return;

    try {
      const response = await fetch(`/api/inspections/${inspectionId}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: newNotes.trim() || null }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update notes: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && inspection) {
        const updatedInspection = { ...inspection, notes: newNotes.trim() || null };
        setInspection(updatedInspection);
        
        // Notify parent component of change if callback provided
        if (onInspectionChange) {
          onInspectionChange();
        }
      } else {
        throw new Error(data.error || "Failed to update notes");
      }
    } catch (err) {
      console.error("Error updating inspection notes:", err);
      setError("Failed to update inspection notes. Please try again.");
    }
  };

  // Handle QR scan result
  const handleQrScanResult = (assetNo: string) => {
    if (assetNo.trim()) {
      setScannedAssetNo(assetNo);
    }
  };

  // Delete inspection
  const handleDeleteInspection = async () => {
    if (!inspectionId || !window.confirm("Are you sure you want to delete this inspection? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/inspections/${inspectionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete inspection: ${response.statusText}`);
      }

      // Show success message and navigate back
      alert("Inspection deleted successfully");
      
      // Notify parent component of change if callback provided
      if (onInspectionChange) {
        onInspectionChange();
      }
      
      // Navigate back or call the onBack function
      if (onBack) {
        onBack();
      } else if (isStandalone) {
        navigate("/inspection");
      }
    } catch (err) {
      console.error("Error deleting inspection:", err);
      setError("Failed to delete inspection. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading inspection data...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => isStandalone ? navigate("/inspection") : onBack?.()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Back to Inspections
        </button>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          Inspection not found
        </div>
        <button
          onClick={() => isStandalone ? navigate("/inspection") : onBack?.()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Back to Inspections
        </button>
      </div>
    );
  }

  // Render QR Scanner if active
  if (showQrScanner) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Scan Asset QR Code</h1>
        <div className="mb-4">
          <button
            onClick={() => setShowQrScanner(false)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Back to Inspection
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <InspectionQrScanner onScan={handleQrScanResult} />
        </div>
      </div>
    );
  }

  // Render Asset Edit Form if active
  if (showAssetEditForm && assetToEdit) {
    return (
      <div className="p-6">
        {/* Asset Form Modal should always be included */}
        <AssetFormModal
          showForm={showForm}
          editingId={editingId}
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={() => {
            handleCancel();
            // Go back to the asset edit view
            setShowForm(false);
          }}
        />

        <h1 className="text-2xl font-bold mb-2">Edit Asset for Inspection</h1>
        <p className="text-gray-600 mb-4">
          Update asset details before adding to inspection
        </p>

        <div className="mb-4">
          <button
            onClick={() => {
              setShowAssetEditForm(false);
              setAssetToEdit(null);
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Back to Inspection
          </button>

          <button
            onClick={async () => {
              try {
                // First, get the latest asset version by asset number
                console.log("Getting latest asset data for edit button:", assetToEdit.assetNo);
                const latestAssetResponse = await fetch(`/api/assets/by-asset-number/${assetToEdit.assetNo}`);
                if (!latestAssetResponse.ok) {
                  const errorText = await latestAssetResponse.text();
                  console.error(`Error fetching latest asset (${latestAssetResponse.status}): ${errorText}`);
                  throw new Error(`Failed to fetch latest asset data: ${latestAssetResponse.statusText}`);
                }
                
                const latestAsset = await latestAssetResponse.json();
                console.log("Latest asset data for edit:", latestAsset);
                
                if (!latestAsset || !latestAsset.id) {
                  throw new Error("Could not find the latest version of this asset");
                }
                
                // Show the full asset form modal
                console.log("Setting up full asset form for editing");
                
                // First make sure we close the simple edit form
                setShowAssetEditForm(false);
                
                // Then show the modal form with the asset data
                console.log("Starting edit with asset:", latestAsset);
                setShowForm(true);
                startEdit(latestAsset);
              } catch (error) {
                console.error("Error preparing asset for edit:", error);
                setError(`Failed to prepare asset for editing: ${error instanceof Error ? error.message : 'Unknown error'}`);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ml-2"
          >
            Edit Asset Details
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{assetToEdit.assetName}</h2>
            <p className="text-sm text-gray-600">
              Asset No: {assetToEdit.assetNo}
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Condition
            </label>
            <select
              id="condition"
              value={assetCondition}
              onChange={(e) => setAssetCondition(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Broken">Broken</option>
              <option value="Missing">Missing</option>
              <option value="X">X</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              value={assetRemarks}
              onChange={(e) => setAssetRemarks(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Add any notes about this asset..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAssetEdit}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Save and Add to Inspection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Asset Form Modal */}
      <AssetFormModal
        showForm={showForm}
        editingId={editingId}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">Inspection Details</h1>
          <p className="text-gray-600">
            {new Date(inspection.date).toLocaleDateString()} | Inspector:{" "}
            {inspection.inspector.name || inspection.inspector.email}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isStandalone ? navigate("/inspection") : onBack?.()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Back
          </button>
          <button
            onClick={handleDeleteInspection}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-2">Notes</h2>
        <textarea
          value={inspection.notes || ""}
          onChange={(e) =>
            setInspection((prev) =>
              prev ? { ...prev, notes: e.target.value } : prev
            )
          }
          onBlur={(e) => handleUpdateNotes(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add inspection notes..."
          rows={3}
        />
      </div>

      {/* QR Scanner Button */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Find Assets</h2>
          <button
            onClick={() => setShowQrScanner(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
          >
            Scan QR Code
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Search for assets or use the QR scanner to find and add assets to this
          inspection.
        </p>

        {/* Asset Search Section */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by asset number or name..."
            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="border rounded-md mb-4 max-h-60 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset No
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const isAlreadyAdded = inspection.items.some(
                    (item) => item.asset.id === asset.id
                  );

                  return (
                    <tr
                      key={asset.id}
                      className={isSelected ? "bg-blue-50" : ""}
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        {asset.assetNo}
                      </td>
                      <td className="px-4 py-2">{asset.assetName}</td>
                      <td className="px-4 py-2">{asset.condition}</td>
                      <td className="px-4 py-2">
                        {isAlreadyAdded ? (
                          <span className="text-gray-500 text-sm">
                            Already added
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  // Fetch the latest asset version by asset number
                                  const latestAssetResponse = await fetch(`/api/assets/by-asset-number/${asset.assetNo}`);
                                  if (!latestAssetResponse.ok) {
                                    throw new Error(`Failed to fetch latest asset data: ${latestAssetResponse.statusText}`);
                                  }
                                  
                                  const latestAsset = await latestAssetResponse.json();
                                  if (!latestAsset || !latestAsset.id) {
                                    throw new Error("Could not find the latest version of this asset");
                                  }
                                  
                                  // Set the asset for editing with complete data
                                  setAssetToEdit(latestAsset);
                                  setAssetCondition(latestAsset.condition || "Good");
                                  setAssetRemarks(latestAsset.remark || "");
                                  setShowAssetEditForm(true);
                                } catch (error) {
                                  console.error("Error fetching asset details:", error);
                                  setError(`Failed to load asset details: ${error instanceof Error ? error.message : 'Unknown error'}`);
                                  
                                  // Fallback to using the data we already have
                                  setAssetToEdit(asset);
                                  setAssetCondition(asset.condition);
                                  setAssetRemarks(asset.remark || "");
                                  setShowAssetEditForm(true);
                                }
                              }}
                              className="px-3 py-1 rounded-md bg-green-100 text-green-800 hover:bg-green-200"
                            >
                              Edit & Add
                            </button>
                            <button
                              onClick={() =>
                                setSelectedAsset(isSelected ? null : asset)
                              }
                              className={`px-3 py-1 rounded-md ${
                                isSelected
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedAsset && (
          <div className="flex justify-end">
            <button
              onClick={() => handleAddAsset()}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Add to Inspection
            </button>
          </div>
        )}
      </div>

      {/* Inspected Assets Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-medium mb-2">Inspected Assets</h2>

        {inspection.items.length === 0 ? (
          <p className="text-gray-500">
            No assets have been added to this inspection yet.
          </p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset No
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                 
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspection.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.asset.assetNo}
                    </td>
                    <td className="px-4 py-2">{item.asset.assetName}</td>
                    <td className="px-4 py-2">{item.asset.condition}</td>
                   
                    <td className="px-4 py-2">{item.assetVersion}</td>
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

export default InspectionDetail;
export type { Asset, Inspection, InspectionItem, Inspector }; 
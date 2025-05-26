// Empty file to start with
import { useState, useEffect } from 'react';
import { navigate } from 'vike/client/router';
import { Link } from '@/renderer/Link';
import { motion } from 'framer-motion';
import InspectionQrScanner from '@/components/blocks/qrscan/InspectionQrScanner';
import { useAssetForm } from '@/hooks/useAssetForm';
import AssetFormModal from '@/components/asset/AssetFormModal';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Logo URL
const LOGO_URL = "https://www.hcml.co.id/wp-content/uploads/2020/08/SKK-HCML-Warna.png";

// PDF styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 20, color: '#666' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 120, fontWeight: 'bold' },
  value: { flex: 1 },
  table: { width: '100%', marginTop: 10 },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#f0f0f0', 
    padding: 5, 
    fontWeight: 'bold',
    fontSize: 10 
  },
  tableRow: { flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderBottomColor: '#eee', fontSize: 9 },
  col1: { width: '20%' },
  col2: { width: '40%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  notes: { marginBottom: 10, padding: 10, backgroundColor: '#f9f9f9' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10
  },
  logo: { 
    width: 120, 
    marginBottom: 10
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
});

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
  const [imageReady, setImageReady] = useState(true); // Start as true for simplicity

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

  // PDF Document component defined within the main component
  const InspectionPDFDocument = () => {
    if (!inspection) return null;
    
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image 
              src={`/img/skk-migas-logo.png`}
              style={styles.logo} 
              cache={true}
            />
             <Image 
              src={`/img/hcml-logo.png`}
              style={styles.logo} 
              cache={true}
            />
            <View style={styles.headerRight}>
              <Text style={styles.subtitle}>Inspection Report</Text>
              <Text style={{ fontSize: 10, color: '#666' }}>Generated on {new Date().toLocaleDateString()}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inspection Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{new Date(inspection.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Inspector:</Text>
              <Text style={styles.value}>{inspection.inspector.name || inspection.inspector.email}</Text>
            </View>
          </View>
          
          {inspection.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notes}>
                <Text>{inspection.notes}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inspected Assets ({inspection.items.length})</Text>
            
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>Asset No</Text>
                <Text style={styles.col2}>Name</Text>
                <Text style={styles.col3}>Condition</Text>
                <Text style={styles.col4}>Version</Text>
              </View>
              
              {inspection.items.map((item: InspectionItem) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.col1}>{item.asset.assetNo}</Text>
                  <Text style={styles.col2}>{item.asset.assetName}</Text>
                  <Text style={styles.col3}>{item.asset.condition}</Text>
                  <Text style={styles.col4}>{item.assetVersion}</Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );
  };

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
      // Prepare the update data with only the fields we're changing
      // Convert values to appropriate types
      const updateData = {
        id: assetToEdit.id,
        condition: assetCondition,
        remark: assetRemarks || null
      };

      console.log("Updating asset with data:", updateData);

      // Use axios like useAssetForm does instead of fetch
      const response = await axios.put(`/api/assets/${assetToEdit.id}`, updateData);
      console.log("Update response:", response.data);
      
      const data = response.data;

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
      if (axios.isAxiosError(err) && err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
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
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading inspection data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
        <motion.button
          onClick={() => isStandalone ? navigate("/inspection") : onBack?.()}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Inspections
        </motion.button>
      </motion.div>
    );
  }

  if (!inspection) {
    return (
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4 shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Inspection not found</span>
          </div>
        </div>
        <motion.button
          onClick={() => isStandalone ? navigate("/inspection") : onBack?.()}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Inspections
        </motion.button>
      </motion.div>
    );
  }

  // Render QR Scanner if active
  if (showQrScanner) {
    return (
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-2">Scan Asset QR Code</h1>
        <p className="text-gray-600 mb-4">Position the QR code within the scanner frame</p>
        
        <div className="mb-4">
          <motion.button
            onClick={() => setShowQrScanner(false)}
            className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition flex items-center shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Inspection
          </motion.button>
        </div>

        <motion.div 
          className="bg-white shadow-lg rounded-xl p-4 border border-gray-100"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <InspectionQrScanner onScan={handleQrScanResult} />
        </motion.div>
      </motion.div>
    );
  }

  // Render Asset Edit Form if active
  if (showAssetEditForm && assetToEdit) {
    return (
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
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

        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Edit Asset for Inspection</h1>
            <p className="text-gray-600">
              Update asset details before adding to inspection
            </p>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              onClick={() => {
                setShowAssetEditForm(false);
                setAssetToEdit(null);
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition flex items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </motion.button>

            <motion.button
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
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Full Details
            </motion.button>
          </div>
        </div>

        <motion.div 
          className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="mb-5 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">{assetToEdit.assetName}</h2>
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Asset No: {assetToEdit.assetNo}
            </p>
          </div>

          <div className="mb-5">
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Condition
            </label>
            <div className="relative">
              <select
                id="condition"
                value={assetCondition}
                onChange={(e) => setAssetCondition(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pl-4 pr-10 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors bg-white"
              >
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Broken">Broken</option>
                <option value="Missing">Missing</option>
                <option value="X">X</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
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
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] transition-colors"
              placeholder="Add any notes about this asset..."
            />
          </div>

          <div className="flex justify-end">
            <motion.button
              onClick={handleSaveAssetEdit}
              className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition flex items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Save and Add to Inspection
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Asset Form Modal */}
      <AssetFormModal
        showForm={showForm}
        editingId={editingId}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Inspection Details</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {new Date(inspection.date).toLocaleDateString()}
            </span>
            <span className="text-gray-400">|</span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {inspection.inspector.name || inspection.inspector.email}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => isStandalone ? navigate("/inspection") : onBack?.()}
            className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition flex items-center shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </motion.button>
          
          {inspection && (
            <PDFDownloadLink 
              document={<InspectionPDFDocument />} 
              fileName={`inspection-${inspectionId}-${new Date().toISOString().split('T')[0]}.pdf`}
              className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition flex items-center shadow-sm"
              style={{
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              {({ blob, url, loading, error }) => (
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {loading ? "Generating PDF..." : "Download PDF"}
                </motion.div>
              )}
            </PDFDownloadLink>
          )}
          
          <motion.button
            onClick={handleDeleteInspection}
            className="bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition flex items-center shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Delete
          </motion.button>
        </div>
      </div>

      {/* Notes Section */}
      <motion.div 
        className="bg-white shadow-lg rounded-xl p-5 mb-6 border border-gray-100"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Notes
        </h2>
        <textarea
          value={inspection.notes || ""}
          onChange={(e) =>
            setInspection((prev) =>
              prev ? { ...prev, notes: e.target.value } : prev
            )
          }
          onBlur={(e) => handleUpdateNotes(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Add inspection notes..."
          rows={3}
        />
      </motion.div>

      {/* QR Scanner Button */}
      <motion.div 
        className="bg-white shadow-lg rounded-xl p-5 mb-6 border border-gray-100"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
            </svg>
            Add Asset with QR Code
          </h2>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 mb-4 flex items-start">
          <svg className="w-5 h-5 mr-3 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-800">
            Scan the QR code on an asset to quickly add it to this inspection. The scanner uses your device's camera to read the asset QR code.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center w-full sm:w-auto">
            <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
            </svg>
            <p className="text-sm text-gray-600 mb-3 text-center">
              Scan the QR code to add an asset to this inspection
            </p>
            <motion.button
              onClick={() => setShowQrScanner(true)}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Open QR Scanner
            </motion.button>
          </div>


        </div>
      </motion.div>

      {/* Inspected Assets Section */}
      <motion.div 
        className="bg-white shadow-lg rounded-xl p-5 border border-gray-100"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="text-lg font-medium mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Inspected Assets
          <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {inspection.items.length}
          </span>
        </h2>

        {inspection.items.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p className="text-gray-500 mb-3">
              No assets have been added to this inspection yet.
            </p>
            <motion.button
              onClick={() => setShowQrScanner(true)}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition inline-flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
              Scan QR Code to Add Asset
            </motion.button>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset No
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspection.items.map((item) => (
                  <motion.tr 
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap text-sm">
                      {item.asset.assetNo}
                    </td>
                    <td className="px-4 py-2.5 text-sm">{item.asset.assetName}</td>
                    <td className="px-4 py-2.5 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                        item.asset.condition === 'Good' ? 'bg-green-100 text-green-800' :
                        item.asset.condition === 'Fair' ? 'bg-blue-100 text-blue-800' :
                        item.asset.condition === 'Poor' ? 'bg-yellow-100 text-yellow-800' :
                        item.asset.condition === 'Broken' ? 'bg-red-100 text-red-800' :
                        item.asset.condition === 'Missing' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.asset.condition}
                      </span>
                    </td>
                   
                    <td className="px-4 py-2.5 text-sm">{item.assetVersion}</td>
                    <td className="px-4 py-2.5 text-sm">
                      <motion.button
                        onClick={() => handleRemoveAsset(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InspectionDetail;
export type { Asset, Inspection, InspectionItem, Inspector }; 
import { useState, useEffect } from 'react'
import { usePageContext } from '@/renderer/usePageContext'
import { navigate } from 'vike/client/router'
import InspectionQrScanner from '@/components/blocks/qrscan/InspectionQrScanner'

type Inspector = {
  id: string
  name: string | null
  email: string
}

type Asset = {
  id: string
  assetNo: string
  assetName: string
  condition: string
  version: number
  remark?: string | null
  locationDesc?: {
    id: number
    description: string
  } | null
  detailsLocation?: {
    id: number
    description: string
  } | null
}

type InspectionItem = {
  id: string
  asset: Asset
  assetVersion: number
}

type Inspection = {
  id: string
  date: string
  notes: string | null
  inspector: Inspector
  items: InspectionItem[]
}

export default function InspectionDetailPage() {
  const pageContext = usePageContext()
  const inspectionId = pageContext.routeParams?.id
  
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Asset search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Asset[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  
  // QR scanner state
  const [showQrScanner, setShowQrScanner] = useState(false)
  const [scannedAssetNo, setScannedAssetNo] = useState('')
  
  // Asset edit state
  const [showAssetEditForm, setShowAssetEditForm] = useState(false)
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null)
  const [assetCondition, setAssetCondition] = useState('Good')
  const [assetRemarks, setAssetRemarks] = useState('')
  
  // Fetch inspection data
  useEffect(() => {
    if (!inspectionId) return
    
    fetch(`/api/inspections/${inspectionId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch inspection data')
        }
        return res.json()
      })
      .then((data) => {
        if (data.success) {
          setInspection(data.data)
        } else {
          throw new Error(data.error || 'Failed to load inspection data')
        }
      })
      .catch((err) => {
        console.error('Error fetching inspection:', err)
        setError('Failed to load inspection. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [inspectionId])
  
  // Fetch asset by asset number (from QR scan)
  useEffect(() => {
    if (!scannedAssetNo) return
    
    setSearching(true)
    
    fetch(`/api/assets/by-asset-number/${scannedAssetNo}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setAssetToEdit(data)
          setShowAssetEditForm(true)
          setShowQrScanner(false) // Hide scanner after successful scan
        } else {
          setError(`Asset with number ${scannedAssetNo} not found`)
        }
      })
      .catch(err => {
        console.error('Error fetching asset by asset number:', err)
        setError('Failed to fetch asset details')
      })
      .finally(() => {
        setSearching(false)
        setScannedAssetNo('')
      })
  }, [scannedAssetNo])
  
  // Search for assets
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setSearching(true)
    setSearchResults([])
    
    try {
      const response = await fetch(`/api/assets?search=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data || [])
      } else {
        throw new Error(data.error || 'Failed to search assets')
      }
    } catch (error) {
      console.error('Error searching assets:', error)
      // Show error but don't set the main error state
    } finally {
      setSearching(false)
    }
  }
  
  // Add asset to inspection
  const handleAddAsset = async (asset = selectedAsset) => {
    if (!asset || !inspectionId) return
    
    try {
      const response = await fetch('/api/inspections/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspectionId,
          assetId: asset.id,
          assetVersion: asset.version
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update inspection state to include the new item
        setInspection(prev => {
          if (!prev) return prev
          
          return {
            ...prev,
            items: [...prev.items, data.data]
          }
        })
        
        // Reset selection
        setSelectedAsset(null)
        setSearchResults([])
        setSearchQuery('')
        
        // Reset asset edit form
        setShowAssetEditForm(false)
        setAssetToEdit(null)
        setAssetCondition('Good')
        setAssetRemarks('')
      } else {
        throw new Error(data.error || 'Failed to add asset to inspection')
      }
    } catch (error) {
      console.error('Error adding asset to inspection:', error)
      setError('Failed to add asset to inspection. Please try again.')
    }
  }
  
  // Save asset edit and add to inspection
  const handleSaveAssetEdit = async () => {
    if (!assetToEdit || !inspectionId) return
    
    try {
      // First update the asset condition
      const updateResponse = await fetch(`/api/assets/${assetToEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          condition: assetCondition,
          remark: assetRemarks
        }),
      })
      
      const updateData = await updateResponse.json()
      
      if (updateData.success) {
        // Now add the updated asset to the inspection
        await handleAddAsset(updateData.data)
      } else {
        throw new Error(updateData.error || 'Failed to update asset')
      }
    } catch (error) {
      console.error('Error updating asset:', error)
      setError('Failed to update asset. Please try again.')
    }
  }
  
  // Remove asset from inspection
  const handleRemoveAsset = async (itemId: string) => {
    if (!inspectionId) return
    
    try {
      const response = await fetch(`/api/inspections/items/${itemId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update inspection state to remove the item
        setInspection(prev => {
          if (!prev) return prev
          
          return {
            ...prev,
            items: prev.items.filter(item => item.id !== itemId)
          }
        })
      } else {
        throw new Error(data.error || 'Failed to remove asset from inspection')
      }
    } catch (error) {
      console.error('Error removing asset from inspection:', error)
      setError('Failed to remove asset. Please try again.')
    }
  }
  
  // Update inspection notes
  const handleUpdateNotes = async (newNotes: string) => {
    if (!inspectionId) return
    
    try {
      const response = await fetch(`/api/inspections/${inspectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: newNotes
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setInspection(prev => {
          if (!prev) return prev
          
          return {
            ...prev,
            notes: data.data.notes
          }
        })
      } else {
        throw new Error(data.error || 'Failed to update inspection notes')
      }
    } catch (error) {
      console.error('Error updating inspection notes:', error)
      setError('Failed to update notes. Please try again.')
    }
  }
  
  // Handle QR scan result
  const handleQrScanResult = (assetNo: string) => {
    if (assetNo.trim()) {
      setScannedAssetNo(assetNo)
    }
  }
  
  // Delete inspection
  const handleDeleteInspection = async () => {
    if (!inspectionId || !confirm('Are you sure you want to delete this inspection?')) return
    
    try {
      const response = await fetch(`/api/inspections/${inspectionId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        navigate('/inspection')
      } else {
        throw new Error(data.error || 'Failed to delete inspection')
      }
    } catch (error) {
      console.error('Error deleting inspection:', error)
      setError('Failed to delete inspection. Please try again.')
    }
  }
  
  if (loading) {
    return <div className="p-6">Loading inspection data...</div>
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/inspection')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Back to Inspections
        </button>
      </div>
    )
  }
  
  if (!inspection) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          Inspection not found
        </div>
        <button
          onClick={() => navigate('/inspection')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Back to Inspections
        </button>
      </div>
    )
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
    )
  }
  
  // Render Asset Edit Form if active
  if (showAssetEditForm && assetToEdit) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Edit Asset for Inspection</h1>
        <p className="text-gray-600 mb-4">
          Update asset details before adding to inspection
        </p>
        
        <div className="mb-4">
          <button
            onClick={() => {
              setShowAssetEditForm(false)
              setAssetToEdit(null)
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Back to Inspection
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{assetToEdit.assetName}</h2>
            <p className="text-sm text-gray-600">Asset No: {assetToEdit.assetNo}</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
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
    )
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">Inspection Details</h1>
          <p className="text-gray-600">
            {new Date(inspection.date).toLocaleDateString()} | 
            Inspector: {inspection.inspector.name || inspection.inspector.email}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/inspection')}
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
          value={inspection.notes || ''}
          onChange={(e) => setInspection(prev => prev ? {...prev, notes: e.target.value} : prev)}
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
          Search for assets or use the QR scanner to find and add assets to this inspection.
        </p>
        
        {/* Asset Search Section */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by asset number or name..."
            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="border rounded-md mb-4 max-h-60 overflow-y-auto">
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
                {searchResults.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  const isAlreadyAdded = inspection.items.some(item => item.asset.id === asset.id);
                  
                  return (
                    <tr key={asset.id} className={isSelected ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-2 whitespace-nowrap">{asset.assetNo}</td>
                      <td className="px-4 py-2">{asset.assetName}</td>
                      <td className="px-4 py-2">{asset.condition}</td>
                      <td className="px-4 py-2">
                        {isAlreadyAdded ? (
                          <span className="text-gray-500 text-sm">Already added</span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setAssetToEdit(asset)
                                setAssetCondition(asset.condition)
                                setAssetRemarks(asset.remark || '')
                                setShowAssetEditForm(true)
                              }}
                              className="px-3 py-1 rounded-md bg-green-100 text-green-800 hover:bg-green-200"
                            >
                              Edit & Add
                            </button>
                            <button
                              onClick={() => setSelectedAsset(isSelected ? null : asset)}
                              className={`px-3 py-1 rounded-md ${
                                isSelected 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
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
          <p className="text-gray-500">No assets have been added to this inspection yet.</p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspection.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{item.asset.assetNo}</td>
                    <td className="px-4 py-2">{item.asset.assetName}</td>
                    <td className="px-4 py-2">{item.asset.condition}</td>
                    <td className="px-4 py-2">
                      {item.asset.locationDesc?.description || 'N/A'}
                      {item.asset.detailsLocation && (
                        <span className="text-xs text-gray-500 block">
                          {item.asset.detailsLocation.description}
                        </span>
                      )}
                    </td>
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
  )
} 
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/renderer/Link'

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

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      ) : inspections.length === 0 ? (
        <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">No inspection records found.</div>
      ) : (
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {inspections.map((inspection) => {
            const inspectorName = inspection.inspector?.name || 'Unknown'
            const itemCount = inspection.items.length
            
            return (
              <div
                key={inspection.id}
                className="p-4 border rounded-xl bg-white shadow hover:shadow-lg transition"
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
                  <Link
                    href={`/inspection/${inspection.id}`}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md self-start hover:bg-blue-200 transition"
                  >
                    View Details
                  </Link>
                </div>
                
                {inspection.notes && (
                  <p className="text-sm mt-2 text-gray-700">
                    Notes: {inspection.notes}
                  </p>
                )}
                
                {itemCount > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Inspected Assets:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {inspection.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="text-xs p-2 bg-gray-50 rounded border">
                          {item.asset.assetName} ({item.asset.assetNo})
                        </div>
                      ))}
                      {itemCount > 4 && (
                        <div className="text-xs p-2 bg-gray-50 rounded border text-center">
                          +{itemCount - 4} more assets
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
} 
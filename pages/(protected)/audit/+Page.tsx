// pages/asset-audits/+Page.tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/renderer/Link'

type AssetAudit = {
  id: string
  asset: { assetNo: string; assetName: string }
  auditUsers: Array<{
    user: {
      id: string
      name: string | null
    }
  }>
  status: string
  checkDate: string
  locationId: number | null
  location: { id: number; name: string } | null
  remarks: string | null
}

export default function AssetAuditListPage() {
  const [audits, setAudits] = useState<AssetAudit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/asset-audit')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch audit data')
        }
        return res.json()
      })
      .then(setAudits)
      .catch((err) => {
        console.error('Error fetching audit data:', err)
        setError('Failed to load audit data. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Asset Audit Logs</h1>
        <Link
          href="/audit/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + New Audit
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      ) : audits.length === 0 ? (
        <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">No audit records found.</div>
      ) : (
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {audits.map((audit) => {
            // Get the first user from auditUsers array or use a fallback
            const userName = audit.auditUsers?.[0]?.user?.name || 'Unknown'
            
            return (
              <div
                key={audit.id}
                className="p-4 border rounded-xl bg-white shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-medium">
                  {audit.asset.assetName} ({audit.asset.assetNo})
                </h2>
                <p className="text-sm text-gray-500">
                  Checked by: {userName} on{' '}
                  {new Date(audit.checkDate).toLocaleDateString()}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Status:</span>{' '}
                  <span className="uppercase">{audit.status}</span>
                </p>
                {audit.location && (
                  <p className="text-sm text-gray-600">
                    Location: {audit.location.name}
                  </p>
                )}
                {audit.remarks && (
                  <p className="text-sm mt-2 text-gray-700">
                    Remarks: {audit.remarks}
                  </p>
                )}
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

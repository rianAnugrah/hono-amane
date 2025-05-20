import { useEffect } from 'react'
import { navigate } from "vike/client/router"

export default function InspectionListPage() {
  useEffect(() => {
    // Redirect to the master-detail layout automatically
    // This assumes we've renamed our @id/+Page.tsx file to master.tsx
    navigate('/inspection/master');
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Inspections</h1>
      <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
        Redirecting to inspection management...
      </div>
    </div>
  )
} 
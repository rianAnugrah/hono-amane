import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Hash, Loader2 } from "lucide-react";

// Inspection log data interface
export interface InspectionLog {
  id: string;
  date: string;
  inspector: string;
  status: 'good' | 'broken' | 'pending' | 'x' | 'poor';
  notes: string;
  assetId?: string;
  images?: string[];
}

// Inspection Log Table component
const InspectionLogTable = ({ logs, loading }: { logs: InspectionLog[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="py-10 text-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500">Loading inspection logs...</p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {logs.length > 0 ? (
          logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Date(log.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.inspector}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.status === 'good' 
                      ? 'bg-green-100 text-green-800' 
                      : log.status === 'broken'
                      ? 'bg-red-100 text-red-800'
                      : log.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : log.status === 'x'
                      ? 'bg-gray-100 text-gray-800'
                      : log.status === 'poor'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {log.status === 'good' && <CheckCircle size={12} className="mr-1" />}
                  {log.status === 'broken' && <XCircle size={12} className="mr-1" />}
                  {log.status === 'pending' && <AlertTriangle size={12} className="mr-1" />}
                  {log.status === 'x' && <Hash size={12} className="mr-1" />}
                  {log.status === 'poor' && <AlertTriangle size={12} className="mr-1" />}
                  {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{log.notes}</td>
              <td className="px-6 py-4">
                {log.images && log.images.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {log.images.map((img, index) => (
                      <a 
                        key={index} 
                        href={img} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-10 h-10 rounded overflow-hidden border"
                      >
                        <img 
                          src={img} 
                          alt={`Inspection image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
              No inspection logs found for this asset.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InspectionLogTable; 
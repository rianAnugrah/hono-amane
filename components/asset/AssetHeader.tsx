import React from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "@/renderer/Link";

// Header component with back button and actions
const AssetHeader = () => (
  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
    <div className="flex items-center gap-3">
      <Link href="/asset" className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
        <ArrowLeft size={20} />
      </Link>
      <h1 className="text-lg font-semibold text-gray-900">Asset Details</h1>
    </div>
    <div className="flex items-center gap-2">
      <button
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
      >
        <Download size={16} />
        Export PDF
      </button>
    </div>
  </div>
);

export default AssetHeader; 
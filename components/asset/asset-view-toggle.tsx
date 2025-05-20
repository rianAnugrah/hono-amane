import React from "react";
import { LayoutGrid, LayoutList, TableProperties, Grid3x3 } from "lucide-react";

type ViewMode = "table" | "card" | "compact";

interface ViewToggleProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
  showCompactOption?: boolean;
}

const AssetViewToggle = ({ 
  currentView, 
  onChange, 
  showCompactOption = false 
}: ViewToggleProps) => {
  return (
    <div className="hidden md:flex items-center gap-3 p-2 ">
      <span className="text-sm  text-gray-700 font-bold">View:</span>
      
      <div className="flex items-center rounded-md overflow-hidden border border-gray-200">
        {/* Table View Button */}
        <button
          onClick={() => onChange("table")}
          className={`btn btn-sm relative btn-ghost rounded-none ${
            currentView === "table"
               ? " bg-blue-300 "
                : " text-gray-500"
          }`}
          title="Taable View"
        >
          <TableProperties size={18} />
          {currentView === "table" && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
          )}
        </button>
        
        {/* Card View Button */}
        <button
          onClick={() => onChange("card")}
          className={`btn btn-sm relative btn-ghost rounded-none ${
            currentView === "card"
              ? " bg-blue-300 "
                : " text-gray-500"
          }`}
          title="Card View"
        >
          <Grid3x3 size={18} />
          {currentView === "card" && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
          )}
        </button>
        
        {/* Compact View Button (Optional) */}
        {showCompactOption && (
          <button
            onClick={() => onChange("compact")}
            className={`relative flex items-center justify-center w-8 h-8 transition-all ${
              currentView === "compact"
                ? "btn-soft btn btn-neutral"
                : "btn-soft btn btn-primary"
            }`}
            title="Compact View"
          >
            <LayoutList size={18} />
            {currentView === "compact" && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssetViewToggle;
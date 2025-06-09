import React, { useState, useEffect } from "react";
import axios from "axios";
import InputSelect from "@/components/ui/input-select";
import InputText from "@/components/ui/input-text";
import { Search } from "lucide-react";

// Define the Location type
interface Location {
  id: string | number;
  description: string;
}

interface LocationSelectorProps {
  value: string | number | null;
  onChange: (value: string | number) => void;
  label?: string;
  placeholder?: string;
}

export function LocationSelector({
  value,
  onChange,
  label = "",
  placeholder = "",
}: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");

  const fetchLocations = async () => {
    try {
      const res = await axios.get("/api/locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [search]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Reset search input
  const resetSearch = () => {
    setSearch("");
  };

  // Create the search input component for the dropdown
  const searchInput = (
    <div className="flex items-center gap-2">
      <InputText
        value={search}
        icon={<Search />}
        onChange={handleSearchChange}
        placeholder="Search locations..."
      />
      <button
        type="button"
        onClick={resetSearch}
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Reset
      </button>
    </div>
  );

  return (
    <div className="">
      {/* Location select with integrated search */}
      {locations.length > 0 && (
        <InputSelect
          label={label}
          placeholder={placeholder}
          options={[
            { label: "All Locations", value: "" },
            ...locations.map((loc) => ({
              label: loc.description,
              value: String(loc.id),
            })),
          ]}
          value={value ? String(value) : ""}
          searchInput={searchInput}
          onChange={(e) => {
            // Handle different types of events/values
            if (typeof e === "string" || typeof e === "number") {
              onChange(e);
            } else if (e && typeof e === "object" && "target" in e) {
              const target = e.target as HTMLSelectElement;
              const value = target.value;
              // Convert to number if it's a numeric string, otherwise keep as string
              const parsedValue = isNaN(Number(value)) ? value : Number(value);
              onChange(parsedValue);
            } else if (e && typeof e === "object" && "value" in e) {
              const objectEvent = e as { value: string | number };
              onChange(objectEvent.value);
            }
          }}
        />
      )}
    </div>
  );
}

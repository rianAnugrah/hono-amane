import { useState, useEffect } from "react";
import axios from "axios";
import InputSelect from "@/components/ui/input-select";
import InputText from "@/components/ui/input-text";
import { Search } from "lucide-react";
import { SelectField } from "@/components/forms/AssetForm/components/SelectField";

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
  label = "Location",
  placeholder = "Select location",
}: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/locations", {
        params: { search, sort: sortOrder },
      });
      setLocations(res.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [search, sortOrder]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Reset search input
  const resetSearch = () => {
    setSearch("");
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="">
      {/* Location select */}
      {locations.length > 0 && (
        <SelectField
          options={[
            { label: "All", value: "" },
            ...locations.map((loc) => ({
              label: loc.description,
              value: loc.id,
            })),
          ]}
          value={value}
          onChange={(e) => {
            if (typeof e === "string" || typeof e === "number") {
              onChange(e);
            } else if (e?.target?.value !== undefined) {
              onChange(e.target.value);
            } else if (e?.value !== undefined) {
              onChange(e.value);
            }
          }}
          label={label}
          placeholder={placeholder}
          isLoading={isLoading}
          searchable
          searchInput={
            <div className="flex items-center gap-2 p-4">
              <InputText
                value={search}
                icon={<Search />}
                onChange={handleSearchChange}
                placeholder="Search locations..."
               
              />
              <button
                type="button"
                onClick={resetSearch}
                className="btn btn-error"
              >
                Reset
              </button>
              {/* <button
                type="button"
                onClick={toggleSortOrder}
                className="btn btn-neutral"
              >
                Sort {sortOrder === "asc" ? "↑" : "↓"}
              </button> */}
            </div>
          }
        />
      )}
    </div>
  );
}

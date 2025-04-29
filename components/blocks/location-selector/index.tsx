import { useState, useEffect } from "react";
import axios from "axios";
import InputSelect from "@/components/ui/input-select";

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
  const handleSearchChange = (searchValue: string) => {
    setSearch(searchValue);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <>
      {locations.length > 0 && (
        <InputSelect
          options={locations.map((loc) => ({
            label: loc.description,
            value: loc.id,
          }))}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          label={label}
          placeholder={placeholder}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
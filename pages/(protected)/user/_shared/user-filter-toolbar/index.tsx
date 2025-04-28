import InputSelect from "@/components/ui/input-select";
import InputText from "@/components/ui/input-text";
import axios from "axios";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { ReactNode } from "react";

type Props = {
  defaultValues?: {
    q?: string;
    role?: string;
    placement?: string;
    locationId?: any;
    sort?: string;
    order?: string;
  };
  onChange: (filters: Record<string, string>) => void;
  children?: ReactNode;
};

export function UserFilterToolbar({
  defaultValues = {},
  onChange,
  children,
}: Props) {
  const [q, setQ] = useState(defaultValues.q || "");
  const [role, setRole] = useState(defaultValues.role || "");
  const [locationId, setlocationId] = useState(defaultValues.locationId || 1);
  const [sort, setSort] = useState(defaultValues.sort || "createdAt");
  const [order, setOrder] = useState(defaultValues.order || "desc");

  // Trigger onChange whenever any filter state changes
  useEffect(() => {
    onChange({ q, role, locationId, sort, order });
  }, [q, role, locationId, sort, order, onChange]);

  const handleReset = () => {
    setQ("");
    setRole("");
    setlocationId("");
    setSort("createdAt");
    setOrder("desc");
    onChange({});
  };

  const [locations, setLocations] = useState<Location[]>([]);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchLocations = async () => {
    const res = await axios.get("/api/locations", {
      params: { search, sort: sortOrder },
    });
    setLocations(res.data);
  };

  useEffect(() => {
    fetchLocations();
  }, [search, sortOrder]);

  return (
    <div className=" w-full  grid grid-cols-1  gap-4 p-4 bg-white backdrop-blur border border-gray-200/50 rounded-2xl shadow-sm">
      <InputText
        placeholder="Name or email"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        icon={<Search />}
      />
      {/* Sort Controls */}
      <div className="grid grid-cols-1 gap-4">
        {locations.length > 0 && (
          <InputSelect
            options={locations.map((loc) => ({
              label: loc.description,
              value: loc.id,
            }))}
            value={locationId || null}
            onChange={(e) => setlocationId(e.target.value)}
          />
        )}

        <InputSelect
          value={sort}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: "admin", label: "Admin" },
            { value: "employee", label: "Employee" },
          ]}
          label="Filer by"
        />
      </div>
      {/* Sort Controls */}
      <div className="grid grid-cols-1 gap-4">
        <InputSelect
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          options={[
            { value: "createdAt", label: "Created Date" },
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
          ]}
          label="Sort by"
        />

        <InputSelect
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          options={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
          label="Order by"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full">
        <button
          onClick={handleReset}
          className="px-4 py-1.5 bg-gray-200/80 backdrop-blur text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300/80 active:bg-gray-400/80 transition-colors"
        >
          Reset
        </button>
        <div className="flex w-full justify-end">{children}</div>
      </div>
    </div>
  );
}

import { LocationSelector } from "@/components/blocks/location-selector";
import InputSelect from "@/components/ui/input-select";
import InputText from "@/components/ui/input-text";
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
  const [locationId, setLocationId] = useState(defaultValues.locationId || 1);
  const [sort, setSort] = useState(defaultValues.sort || "createdAt");
  const [order, setOrder] = useState(defaultValues.order || "desc");

  // Trigger onChange whenever any filter state changes
  useEffect(() => {
    onChange({ q, role, locationId, sort, order });
  }, [q, role, locationId, sort, order, onChange]);

  const handleReset = () => {
    setQ("");
    setRole("");
    setLocationId("");
    setSort("createdAt");
    setOrder("desc");
    onChange({});
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-4 items-center mb-4 py-4 bg-white sticky top-0 px-4 rounded-xl shadow-xs">
      <div className="col-span-2">
        <InputText
          placeholder="Name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          icon={<Search />}
        />
      </div>
      {/* Replaced with the LocationSelector component */}
      {/* <div className="border"> */}

      {/* <LocationSelector
        value={locationId}
        onChange={(value: string | number) => setLocationId(value)}
        />
        </div> */}

      <InputSelect
        value={role}
        onChange={(e) => setRole(e.target.value)}
        options={[
          { value: "admin", label: "Admin" },
          { value: "pic", label: "PIC" },
          { value: "read_only", label: "Read only" },
        ]}
        label="Filter by"
      />

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
      {/* Action Buttons */}

      <button onClick={handleReset} className="btn w-full btn-ghost">
        Reset
      </button>
    </div>
  );
}

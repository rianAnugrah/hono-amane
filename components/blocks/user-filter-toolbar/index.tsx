import { useState } from "react";
import { ReactNode } from "react";

type Props = {
  defaultValues?: {
    q?: string;
    role?: string;
    placement?: string;
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
  const [placement, setPlacement] = useState(defaultValues.placement || "");
  const [sort, setSort] = useState(defaultValues.sort || "createdAt");
  const [order, setOrder] = useState(defaultValues.order || "desc");

  const handleApply = () => {
    onChange({ q, role, placement, sort, order });
  };

  const handleReset = () => {
    setQ("");
    setRole("");
    setPlacement("");
    setSort("createdAt");
    setOrder("desc");
    onChange({});
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-100/80 backdrop-blur border border-gray-200/50 rounded-lg shadow-sm">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-white/80 backdrop-blur rounded-md text-sm border border-gray-200/50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Role & Placement */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-32 px-3 py-1.5 bg-white/80 backdrop-blur rounded-md text-sm border border-gray-200/50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />

        <input
          type="text"
          placeholder="Placement"
          value={placement}
          onChange={(e) => setPlacement(e.target.value)}
          className="w-32 px-3 py-1.5 bg-white/80 backdrop-blur rounded-md text-sm border border-gray-200/50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-36 px-3 py-1.5 bg-white/80 backdrop-blur rounded-md text-sm border border-gray-200/50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="createdAt">Sort by Created</option>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="w-32 px-3 py-1.5 bg-white/80 backdrop-blur rounded-md text-sm border border-gray-200/50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full">
        <button
          onClick={handleApply}
          className="px-4 py-1.5 bg-blue-500/90 backdrop-blur text-white text-sm font-medium rounded-md hover:bg-blue-600 active:bg-blue-700 transition-colors"
        >
          Apply
        </button>

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

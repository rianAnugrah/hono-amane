// pages/locations/+Page.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import InputText from "@/components/ui/input-text";
import { Search } from "lucide-react";
import InputSelect from "@/components/ui/input-select";

type Location = {
  id: number;
  description: string;
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
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

  const handleCreate = async () => {
    if (!newLocation.trim()) return;
    await axios.post("/api/locations", { description: newLocation });
    setNewLocation("");
    fetchLocations();
  };

  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return;
    await axios.put(`/api/locations/${id}`, { description: editValue });
    setEditId(null);
    setEditValue("");
    fetchLocations();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/locations/${id}`);
    fetchLocations();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Locations</h1>

      {/* New Location Form */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="New location"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Locations List */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Search and Sort Controls */}
        <div className="flex items-center gap-4 mb-6 bg-gray-50 px-6 py-4 text-gray-500">
          <InputText
            icon={<Search />}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputSelect
          
            options={[
              {
                value : "asc",
                label : "Sort A-Z"
              },
              {
                value : "desc",
                label : "Sort Z-A"
              }
            ]}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          />
          
        </div>
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-6 py-4 hover:bg-gray-50 transition-all duration-200 gap-y-2 md:gap-y-0"
          >
            {editId === loc.id ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="border px-2 py-1 rounded mr-2 w-full"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleUpdate(loc.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditValue("");
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-lg">{loc.description}</span>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setEditId(loc.id);
                      setEditValue(loc.description);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

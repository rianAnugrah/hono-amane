// pages/locations/+Page.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Location = {
  id: number;
  description: string;
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchLocations = async () => {
    const res = await axios.get('/api/locations', {
      params: { search, sort: sortOrder },
    });
    setLocations(res.data);
  };

  useEffect(() => {
    fetchLocations();
  }, [search, sortOrder]);

  const handleCreate = async () => {
    if (!newLocation.trim()) return;
    await axios.post('/api/locations', { description: newLocation });
    setNewLocation('');
    fetchLocations();
  };

  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return;
    await axios.put(`/api/locations/${id}`, { description: editValue });
    setEditId(null);
    setEditValue('');
    fetchLocations();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/locations/${id}`);
    fetchLocations();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Locations</h1>

      {/* Search and Sort Controls */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="border px-3 py-2 rounded"
        >
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
      </div>

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
      <div className="space-y-4">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="border rounded p-4 flex items-center justify-between"
          >
            {editId === loc.id ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="border px-2 py-1 rounded mr-2 w-full"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(loc.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditValue('');
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
                <div className="flex gap-2">
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

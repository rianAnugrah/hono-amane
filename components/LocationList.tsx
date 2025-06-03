import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Location = {
  id: number;
  description: string;
};

interface LocationListProps {
  refresh: boolean;
  onRefreshComplete: () => void;
}

export default function LocationList({ refresh, onRefreshComplete }: LocationListProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/locations', {
        params: { search, sort: sortOrder },
      });
      setLocations(res.data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setIsLoading(false);
      if (refresh) {
        onRefreshComplete();
      }
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [search, sortOrder, refresh]);

  const handleUpdate = async (id: number) => {
    // Validation
    if (!editValue.trim()) {
      setEditError('Location description cannot be empty');
      return;
    }
    
    if (editValue.length > 255) {
      setEditError('Location description must be less than 255 characters');
      return;
    }
    
    try {
      await axios.put(`/api/locations/${id}`, { description: editValue });
      setEditId(null);
      setEditValue('');
      setEditError('');
      fetchLocations();
    } catch (err) {
      setEditError('Failed to update location');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this location?')) {
      try {
        await axios.delete(`/api/locations/${id}`);
        fetchLocations();
      } catch (err: unknown) {
        const errorMessage = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to delete location';
        alert(errorMessage);
        console.error('Failed to delete location:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:h-[calc(100vh-240px)] overflow-auto ">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Locations</h2>
      
      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search locations..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && locations.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No locations found
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {editId === loc.id ? (
              <div className="space-y-3">
                <input
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value);
                    setEditError('');
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editError && <p className="text-sm text-red-500">{editError}</p>}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleUpdate(loc.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditValue('');
                      setEditError('');
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">{loc.description}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(loc.id);
                      setEditValue(loc.description);
                      setEditError('');
                    }}
                    className="bg-gray-200 text-gray-800 px-3 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
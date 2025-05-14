import React, { useState } from 'react';
import axios from 'axios';

interface LocationFormProps {
  onLocationAdded: () => void;
}

export default function LocationForm({ onLocationAdded }: LocationFormProps) {
  const [newLocation, setNewLocation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    // Validation
    if (!newLocation.trim()) {
      setError('Location description cannot be empty');
      return;
    }
    
    if (newLocation.length > 255) {
      setError('Location description must be less than 255 characters');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      await axios.post('/api/locations', { description: newLocation });
      setNewLocation('');
      onLocationAdded();
    } catch (err) {
      setError('Failed to add location. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Add New Location</h2>
      <div className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            value={newLocation}
            onChange={(e) => {
              setNewLocation(e.target.value);
              setError('');
            }}
            placeholder="Enter location description"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <button
          onClick={handleCreate}
          disabled={isSubmitting}
          className="bg-blue-500 text-white font-medium px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Location'}
        </button>
      </div>
    </div>
  );
} 
import React, { useState } from 'react';
import axios from 'axios';
import Button from './ui/button';
import InputText from './ui/input-text';
import { MapPin } from 'lucide-react';

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
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-medium mb-4 text-gray-800">Add New Location</h2>
      <div className="flex flex-col gap-4">
        <InputText
          value={newLocation}
          onChange={(e) => {
            setNewLocation(e.target.value);
            setError('');
          }}
          placeholder="Location description"
          icon={<MapPin size={16} />}
          error={error}
          name="newLocation"
        />
        
        <Button
          onClick={handleCreate}
          disabled={isSubmitting}
          variant="primary"
          fullWidth
          size="lg"
        >
          {isSubmitting ? 'Adding...' : 'Add Location'}
        </Button>
      </div>
    </div>
  );
} 
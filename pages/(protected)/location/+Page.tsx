// pages/locations/+Page.tsx
import React, { useState } from 'react';
import LocationForm from '../../../components/LocationForm';
import LocationList from '../../../components/LocationList';

export default function LocationsPage() {
  const [refresh, setRefresh] = useState(false);

  const handleLocationAdded = () => {
    setRefresh(true);
  };

  const handleRefreshComplete = () => {
    setRefresh(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Locations</h1>
        <p className="text-gray-500">Manage your location descriptions</p>
      </div>
      
      <LocationForm onLocationAdded={handleLocationAdded} />
      <LocationList refresh={refresh} onRefreshComplete={handleRefreshComplete} />
    </div>
  );
}

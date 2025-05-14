import React, { useState } from 'react';
import ProjectCodeForm from '../../../components/ProjectCodeForm';
import ProjectCodeList from '../../../components/ProjectCodeList';

export default function ProjectCodesPage() {
  const [refresh, setRefresh] = useState(false);

  const handleCodeAdded = () => {
    setRefresh(true);
  };

  const handleRefreshComplete = () => {
    setRefresh(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Project Codes</h1>
        <p className="text-gray-500">Manage your project codes</p>
      </div>
      
      <ProjectCodeForm onCodeAdded={handleCodeAdded} />
      <ProjectCodeList refresh={refresh} onRefreshComplete={handleRefreshComplete} />
    </div>
  );
}

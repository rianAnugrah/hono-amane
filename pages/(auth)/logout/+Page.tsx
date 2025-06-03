import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function Page() {
  const { logout } = useAuth();

  useEffect(() => {
    // Use the centralized logout function
    logout();
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-gray-600 mb-4">Please wait while we securely log you out of the system.</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    </div>
  );
} 
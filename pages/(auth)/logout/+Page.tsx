import React, { useEffect } from 'react';
import { useUserStore } from '@/stores/store-user-login';

export function Page() {
  const { clearUser } = useUserStore();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call the logout API endpoint
        const response = await fetch('/api/auth/logout');
        
        if (response.ok) {
          // Clear user state from store and localStorage
          clearUser();
          
          // Also clear any other application storage if needed
          localStorage.removeItem('user-auth-storage');
          sessionStorage.clear();
        }
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } catch (error) {
        console.error('Logout failed');
        // Clear state anyway
        clearUser();
        // Redirect to login page
        window.location.href = '/login';
      }
    };

    performLogout();
  }, [clearUser]);

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
import React from 'react';

interface AuthLoaderProps {
  message?: string;
}

export const AuthLoader: React.FC<AuthLoaderProps> = ({ 
  message = "Verifying authentication..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <h1 className="text-xl font-semibold mb-2">Please wait</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}; 
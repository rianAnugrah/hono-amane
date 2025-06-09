import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

interface AuthContextType {
  isInitialized: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { initializeAuth } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        await initializeAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setIsInitialized(true); // Still mark as initialized to prevent blocking
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [initializeAuth]);

  const value: AuthContextType = {
    isInitialized,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
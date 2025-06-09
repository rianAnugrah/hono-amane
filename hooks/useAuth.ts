import { useCallback, useRef } from 'react';
import { useUserStore } from '@/stores/store-user-login';
import axios from 'axios';

export const useAuth = () => {
  const { email, name, isAuth, set_user, clearUser, role, id, location } = useUserStore();
  const sessionCheckedRef = useRef(false);
  const isCheckingRef = useRef(false);

  // Verify session with server
  const verifySession = useCallback(async (): Promise<boolean> => {
    if (isCheckingRef.current) {
      return false;
    }

    isCheckingRef.current = true;

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        
        if (userData && !userData.error) {
          const newUserData = {
            email: userData.email || '',
            name: userData.name || '',
            isAuth: true,
            role: userData.role || '',
            location: userData.location || [],
            id: userData.id || '',
          };
          set_user(newUserData);
          sessionCheckedRef.current = true;
          return true;
        }
      }
    } catch (error) {
      console.warn('Session verification failed:', error);
    } finally {
      isCheckingRef.current = false;
    }

    return false;
  }, [set_user]);

  // Check user profile in database and handle registration
  const checkUserProfile = useCallback(async (userEmail: string, userName?: string, retryCount = 0) => {
    if (!userEmail) return false;

    try {
      const { data } = await axios.get(`/api/users/by-email/${userEmail.toLowerCase()}`);

      if (data) {
        const authData = {
          email: data.email.toLowerCase(),
          name: data.name,
          isAuth: true,
          location: data.userLocations,
          role: data.role,
          id: data.id,
        };
        set_user(authData);
        return true;
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        
        if (status === 404) {
          // User not found - attempt auto-registration with default read_only role
          try {
            const response = await axios.post('/api/users/register-request', {
              email: userEmail.toLowerCase(),
              name: userName || '',
            });
            
            if (response.status === 201 && response.data.user) {
              const newUser = response.data.user;
              set_user({
                email: newUser.email.toLowerCase(),
                name: newUser.name,
                isAuth: true,
                location: newUser.userLocations,
                role: newUser.role,
                id: newUser.id,
              });
              return true;
            }
            
            // If auto-registration fails, provide fallback read-only access
            console.warn('Auto-registration failed, providing fallback access');
            set_user({
              email: userEmail.toLowerCase(),
              name: userName || userEmail.split('@')[0],
              isAuth: true,
              location: [],
              role: 'read_only',
              id: `fallback_${userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            });
            return true;
          } catch (registerError) {
            console.error('Auto-registration failed:', registerError);
            // Still provide fallback access rather than blocking user
            set_user({
              email: userEmail.toLowerCase(),
              name: userName || userEmail.split('@')[0],
              isAuth: true,
              location: [],
              role: 'read_only',
              id: `fallback_${userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            });
            return true;
          }
        } else if (status && status >= 500 && retryCount < 2) {
          // Retry for server errors
          setTimeout(() => {
            checkUserProfile(userEmail, userName, retryCount + 1);
          }, 1000 * (retryCount + 1));
          return false;
        }
        
        // For any other errors, provide fallback access
        console.warn('User profile check failed, providing fallback access');
        set_user({
          email: userEmail.toLowerCase(),
          name: userName || userEmail.split('@')[0],
          isAuth: true,
          location: [],
          role: 'read_only',
          id: `fallback_${userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        });
        return true;
      }
    }

    return false;
  }, [set_user]);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    // If already checking, don't start another check
    if (isCheckingRef.current) {
      return;
    }
    
    // Verify session with server - this will now return complete user data including role
    const sessionValid = await verifySession();
    
    // If session verification succeeded, we're done - the verify endpoint now handles everything
    if (sessionValid) {
      return;
    }
    
    // If session verification failed but we have local data, try to get fresh data from backend
    if (!sessionValid && isAuth && email) {
      await checkUserProfile(email, name);
    }
  }, [isAuth, email, name, verifySession, checkUserProfile]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      clearUser();
      localStorage.removeItem('user-auth-storage');
      sessionStorage.clear();
      window.location.href = '/login';
    }
  }, [clearUser]);

  // Check if current route is protected
  const isProtectedRoute = useCallback((pathname: string) => {
    const protectedPatterns = [
      '/asset',
      '/category', 
      '/dashboard',
      '/location',
      '/qr-scanner',
      '/report',
      '/user',
      '/audit',
      '/testapi',
      '/(protected)',
    ];

    return protectedPatterns.some(pattern => 
      pathname === pattern || 
      pathname.startsWith(`${pattern}/`) ||
      (pattern.includes('(') && pathname.includes(pattern))
    );
  }, []);

  // Check if current route is auth-related
  const isAuthRoute = useCallback((pathname: string) => {
    return pathname.includes('(auth)') || 
           pathname === '/login' || 
           pathname === '/logout';
  }, []);

  return {
    // State
    user: { email, name, isAuth, role, id, location },
    isAuthenticated: isAuth,
    isLoading: isCheckingRef.current,
    
    // Actions
    initializeAuth,
    logout,
    verifySession,
    
    // Utilities
    isProtectedRoute,
    isAuthRoute,
  };
}; 
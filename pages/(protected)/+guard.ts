import { redirect } from 'vike/abort';
import type { GuardAsync } from 'vike/types';

export const guard: GuardAsync = async (pageContext): Promise<void> => {
  // For server-side rendering, check if we have the session cookie
  if (pageContext.isClientSideNavigation === false) {
    // On server side, we can't easily verify the cookie without crypto utils
    // Let the client handle initial auth check
    return;
  }

  // Client-side guard logic
  if (typeof window !== 'undefined') {
    // First check if session cookie exists
    const cookies = document.cookie.split(";");
    const hcmlSessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("hcmlSession=")
    );
    
    if (hcmlSessionCookie) {
      // Cookie exists, verify with server
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
            // Session is valid, check localStorage to sync state
            const userStorage = localStorage.getItem('user-auth-storage');
            
            if (!userStorage) {
              // No localStorage data, create it from session data
              const authState = {
                state: {
                  email: userData.email || '',
                  name: userData.name || '',
                  isAuth: true,
                  role: userData.role || 'read_only',
                  location: userData.location || [],
                  id: userData.id || '',
                }
              };
              localStorage.setItem('user-auth-storage', JSON.stringify(authState));
            }
            
            // Session is valid, allow access
            return;
          }
        }
      } catch (error) {
        console.warn('Session verification failed:', error);
      }
    }
    
    // Also check localStorage for existing auth state
    const userStorage = localStorage.getItem('user-auth-storage');
    if (userStorage) {
      try {
        const userData = JSON.parse(userStorage);
        const state = userData.state || {};
        
        // If user is marked as authenticated, but cookie check failed, 
        // clear the localStorage and require re-authentication
        if (state.isAuth && state.email && !hcmlSessionCookie) {
          localStorage.removeItem('user-auth-storage');
        } else if (state.isAuth && state.email && hcmlSessionCookie) {
          // Both localStorage and cookie exist, allow access
          return;
        }
      } catch (error) {
        console.warn('Error parsing user storage:', error);
        localStorage.removeItem('user-auth-storage');
      }
    }
    
    // No valid authentication found, redirect to login
    throw redirect('/login');
  }
}; 
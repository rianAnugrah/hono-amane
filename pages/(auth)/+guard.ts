import { redirect } from 'vike/abort';
import type { GuardAsync } from 'vike/types';

export const guard: GuardAsync = async (pageContext): Promise<void> => {
  // Skip guard for logout page - users should always be able to access it
  if (pageContext.urlPathname === '/logout') {
    return;
  }

  // For server-side rendering, let client handle the auth check
  if (pageContext.isClientSideNavigation === false) {
    return;
  }

  // Client-side guard logic
  if (typeof window !== 'undefined') {
    // Check if session cookie exists
    const cookies = document.cookie.split(";");
    const hcmlSessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("hcmlSession=")
    );
    
    let sessionVerified = false;
    
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
            sessionVerified = true;
            // Session is valid, ensure localStorage is in sync
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
            
            // User is authenticated and session is valid, redirect to dashboard
            throw redirect('/dashboard');
          }
        }
      } catch (error) {
        if (error instanceof Error && 'url' in error) {
          // This is a redirect, let it propagate
          throw error;
        }
        console.warn('Session verification failed during auth guard:', error);
        // If verification fails, clear invalid data
        localStorage.removeItem('user-auth-storage');
      }
    }
    
    if (!sessionVerified) {
      // Check localStorage for existing auth state
      const userStorage = localStorage.getItem('user-auth-storage');
      if (userStorage) {
        try {
          const userData = JSON.parse(userStorage);
          const state = userData.state || {};
          
          // If user is authenticated in localStorage but no cookie, clear it
          if (state.isAuth && state.email && !hcmlSessionCookie) {
            localStorage.removeItem('user-auth-storage');
          } else if (state.isAuth && state.email && hcmlSessionCookie) {
            // Both exist, redirect to dashboard
            throw redirect('/dashboard');
          }
        } catch (error) {
          console.warn('Error parsing user storage in auth guard:', error);
          // Clear invalid data
          localStorage.removeItem('user-auth-storage');
        }
      }
    }
    
    // User is not authenticated or session is invalid, allow access to auth pages
    return;
  }
}; 
/**
 * Utility functions for authentication and cookie management
 */

// User location type
interface UserLocation {
  id: number;
  description: string;
}

// User data type for session verification
interface UserData {
  email: string;
  name: string;
  role: string;
  location: UserLocation[];
  id: string;
}

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

/**
 * Check if session cookie exists
 */
export const hasSessionCookie = (): boolean => {
  return getCookie('hcmlSession') !== null;
};

/**
 * Clear all authentication-related storage
 */
export const clearAuthStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  // Clear localStorage
  localStorage.removeItem('user-auth-storage');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Note: We cannot clear HTTP-only cookies from JavaScript
  // The logout API endpoint handles cookie clearing
};

/**
 * Check if a path is a protected route
 */
export const isProtectedPath = (pathname: string): boolean => {
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
};

/**
 * Check if a path is an authentication route
 */
export const isAuthPath = (pathname: string): boolean => {
  return pathname.includes('(auth)') || 
         pathname === '/login' || 
         pathname === '/logout';
};

/**
 * Verify session with server and automatically set user data
 */
export const verifySession = async (): Promise<{ valid: boolean; userData?: UserData }> => {
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
        return { valid: true, userData };
      }
    }
    
    return { valid: false };
  } catch (error) {
    console.warn('Session verification failed:', error);
    return { valid: false };
  }
};

/**
 * Get redirect URL for unauthenticated users
 */
export const getLoginRedirectUrl = (currentPath: string): string => {
  // If user was trying to access a protected route, redirect back after login
  if (isProtectedPath(currentPath) && currentPath !== '/') {
    return `/login?redirect=${encodeURIComponent(currentPath)}`;
  }
  return '/login';
};

/**
 * Get redirect URL after successful authentication
 */
export const getPostLoginRedirectUrl = (): string => {
  if (typeof window === 'undefined') return '/dashboard';
  
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect');
  
  // Validate redirect URL to prevent open redirect vulnerabilities
  if (redirectTo && isProtectedPath(redirectTo)) {
    return redirectTo;
  }
  
  return '/dashboard';
}; 
import React from 'react';
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from 'vike/client/router';
import { useAuth } from '@/hooks/useAuth';

export { Link };

function Link(props: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { href, className, children, ...rest } = props;
  const { isAuthenticated, isProtectedRoute } = useAuth();
  
  const isActive =
    href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  
  const classNames = [className, isActive && "is-active"]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e: React.MouseEvent) => {
    // Allow opening in new tab with Ctrl/Cmd+click or middle-click
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 || // Only handle left-clicks
      e.defaultPrevented
    ) {
      return;
    }

    // Check if trying to navigate to a protected route while not authenticated
    if (isProtectedRoute(href) && !isAuthenticated) {
      e.preventDefault();
      // Redirect to login instead
      navigate('/login');
      return;
    }

    // Prevent default browser navigation
    e.preventDefault();
    
    // Only navigate if it's a different URL
    if (href !== urlPathname) {
      // Use Vike's built-in navigate function
      navigate(href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      
      // Check authentication for protected routes
      if (isProtectedRoute(href) && !isAuthenticated) {
        navigate('/login');
        return;
      }
      
      // Only navigate if it's a different URL
      if (href !== urlPathname) {
        navigate(href);
      }
    }
  };

  return (
    <a 
      href={href} 
      className={classNames} 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={typeof children === 'string' ? children : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}

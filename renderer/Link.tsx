import React from 'react';
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from 'vike/client/router';

export { Link };

function Link(props: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { href, className, children, ...rest } = props;
  
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

    // Prevent default browser navigation
    e.preventDefault();
    
    // Only navigate if it's a different URL
    if (href !== urlPathname) {
      // Use Vike's built-in navigate function
      navigate(href);
    }
  };

  return (
    <a 
      href={href} 
      className={classNames} 
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}

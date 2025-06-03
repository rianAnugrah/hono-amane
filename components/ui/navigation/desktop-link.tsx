import { usePageContext } from "vike-react/usePageContext";
import React, { ReactElement } from "react";

export default function DesktopLink({
    href,
    icon,
    label,
    isCompact = false,
  }: {
    href: string;
    icon?: ReactElement;
    label?: string;
    isCompact?: boolean;
  }) {
    const pageContext = usePageContext();
    const { urlPathname } = pageContext;
  
    const isActive =
      href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  
    return (
      <a
        href={href}
        className={`
          text-xl flex  group items-center transition-all duration-300 py-2 px-0 rounded-lg w-full
          ${isCompact ? 'flex-col justify-center items-center w-full' : 'flex-row justify-start gap-2'}
          ${
            isActive
              ? 'bg-gray-100 text-gray-900' + (!isCompact ? ' font-bold' : '')
              : 'text-gray-400'
          }
          hover:bg-gray-100 hover:text-orange-600
        `}
      >
        {icon &&
          React.cloneElement(icon, {
            className: `
              transition-all duration-300 w-[1.5rem] h-[1.5rem]
              ${icon.props.className || ""}
              ${isCompact ? 'group-hover:scale-[1.1]' : 'group-hover:scale-[1]'}
            `,
          })}
        {label && (
          <span className={`
            ${isCompact ? 'text-xs text-center w-full mt-1' : 'text-sm'}
          `}>
            {label}
          </span>
        )}
      </a>
    );
  }
import { usePageContext } from "vike-react/usePageContext";
import React, { ReactElement } from "react";

export default function MobileLink({
    href,
    icon,
    label,
  }: {
    href: string;
    icon?: ReactElement;
    label?: string;
  }) {
    const pageContext = usePageContext();
    const { urlPathname } = pageContext;
  
    const isActive =
      href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  
    return (
      <a
        href={href}
        className={`text-xl flex flex-col items-center gap-1  active:scale-95 transition-all group w-[3rem] h-[3rem] justify-center rounded ${
          isActive ? " text-orange-500" : "bg-transparent  text-white"
        }  `}
      >
        {icon &&
          React.cloneElement(icon, {
            className: `group-hover:scale-[1.2] transition-all duration-300 w-[1rem] h-[1rem]  ${
              icon.props.className || ""
            }`,
          })}
        <span className="text-xs">{label}</span>
      </a>
    );
  }
  
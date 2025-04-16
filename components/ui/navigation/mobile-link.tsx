import { Link } from "@/renderer/Link";
import { usePageContext } from "@/renderer/usePageContext";
import React from "react";

export default function MobileLink({
    href,
    icon,
    label,
  }: {
    href: string;
    icon?: React.ReactNode;
    label?: string;
  }) {
    const pageContext = usePageContext();
    const { urlPathname } = pageContext;
  
    const isActive =
      href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  
    return (
      <Link
        href={href}
        className={`text-xl flex flex-col items-center gap-1  active:scale-95 transition-all group w-[3rem] h-[3rem] justify-center rounded ${
          isActive ? "bg-gray-200 text-orange-500" : "bg-transparent  text-white"
        }  `}
      >
        {icon &&
          React.cloneElement(icon, {
            className: `group-hover:scale-[1.2] transition-all duration-300 w-[1rem] h-[1rem]  ${
              icon.props.className || ""
            }`,
          })}
        <span className="text-xs">{label}</span>
      </Link>
    );
  }
  
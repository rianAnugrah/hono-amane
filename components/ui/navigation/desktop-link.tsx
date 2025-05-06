import { Link } from "@/renderer/Link";
import { usePageContext } from "@/renderer/usePageContext";
import React from "react";

export default function DesktopLink({
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
        className={`text-xl flex  flex-row group items-center gap-1 transition-all duration-500 ${
          isActive
            ? "bg-gray-100 text-orange-600 w-[12rem]"
            : "text-gray-300 w-[9rem]"
        } hover:bg-gray-100 hover:text-orange-600   justify-start py-2 px-4 rounded-lg `}
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
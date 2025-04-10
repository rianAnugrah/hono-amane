"use client";

import React, { useState } from "react";

import {
  Archive,
  BookCopy,
  CircleCheckBig,
  Cog,
  CogIcon,
  FileCheck2,
  HomeIcon,
  LogOut,
  MapPin,
  MenuIcon,
  Pin,
  Scan,
  Settings,
  User2,
} from "lucide-react";
import { Link } from "@/renderer/Link";
import { usePageContext } from "@/renderer/usePageContext";
import Logo from "@/components/svg/logo";

export default function Navbar() {
  return (
    <>
      <MobileNavbar />
      <DesktopNav />
    </>
  );
}

function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#476f80] md:hidden border-t w-full bottom-0 fixed z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex justify-between items-center w-full">
            <Link
              href="/"
              className="text-xl flex flex-col items-center gap-1  text-white"
            >
              <HomeIcon />
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/asset"
              className="text-xl flex flex-col items-center gap-1  text-white"
            >
              <Archive />
              <span className="text-xs">Asset</span>
            </Link>
            <Link
              href="/qr-scanner"
              className="text-xl bg-orange-600 shadow relative -top-5 p-3 rounded-lg flex flex-col items-center gap-1  text-white"
            >
              <Scan className="w-10 h-10" />
              {/* <span className="text-xs">Scan</span> */}
            </Link>

            <Link
              href="/qr-scanner"
              className="text-xl flex flex-col items-center gap-1  text-white"
            >
              <Settings />
              <span className="text-xs">Setting</span>
            </Link>
            <div className="">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-xl flex flex-col items-center gap-1  text-white focus:outline-none"
                aria-label="Open menu"
              >
                <MenuIcon />
                <span className="text-xs">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Drawer Overlay with Animation */}
      <div>
        {menuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <div
              className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-lg p-6 flex flex-col space-y-4 z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end text-gray-600 hover:text-red-500 text-xl"
                aria-label="Close menu"
              >
                ✕
              </button>
              <Link
                href="/"
                className="text-gray-800 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-800 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-800 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="text-gray-800 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Logout
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden  md:flex flex-col  h-[100svh] gap-1 w-[5rem] pl-4 pb-4">
      <div className="h-[4rem] flex items-center justify-center">
        {/* <div className="w-[2rem] h-[2rem]">
          <Logo />
        </div> */}
      </div>
      <DesktopLink href="/" icon={<HomeIcon />} label="Home" />
      <DesktopLink href="/asset" icon={<Archive />} label="Asset" />
      <DesktopLink href="/category" icon={<BookCopy />} label="Category" />
      <DesktopLink href="/location" icon={<MapPin />} label="Location" />
      <DesktopLink
        href="/condition"
        icon={<CircleCheckBig />}
        label="Condition"
      />
      <DesktopLink href="/report" icon={<FileCheck2 />} label="Report" />
      <DesktopLink href="/user" icon={<User2 />} label="User" />
      <DesktopLink href="/setting" icon={<Settings />} label="Setting" />
      <div className="flex flex-grow"></div>
      <DesktopLink href="/login" icon={<LogOut />} label="Logout" />
    </nav>
  );
}

function DesktopLink({
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
      className={`text-xl flex flex-col group items-center gap-1 ${
        isActive ? "bg-white text-orange-600" : "text-gray-300"
      } hover:bg-orange-200 hover:text-orange-600  w-full justify-center py-2 rounded-lg`}
    >
      {icon &&
        React.cloneElement(icon, {
          className: `group-hover:scale-110 transition-all duration-300 ${
            icon.props.className || ""
          }`,
        })}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

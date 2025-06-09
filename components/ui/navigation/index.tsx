"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  Archive,
  BookCopy,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Cog,
  CogIcon,
  Database,
  FileCheck2,
  HomeIcon,
  LogOut,
  MapPin,
  MenuIcon,
  Pin,
  Scan,
  ScanQrCode,
  SearchCheck,
  Settings,
  User2,
} from "lucide-react";
import { Link } from "@/renderer/Link";
import { usePageContext } from "vike-react/usePageContext";
import DesktopLink from "./desktop-link";
import MobileLink from "./mobile-link";
import { AnimatePresence, motion } from "framer-motion";
import { useAssetSelectionStore } from "@/stores/store-asset-selection";
import { useUserStore } from "@/stores/store-user-login";
import Logo from "@/components/svg/logo";
import LocationDisplay from "../location-display";
import UserDropDown from "../user-dropdown";

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
  const { role } = useUserStore();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="bg-gradient-to-br from-cyan-950 to-blue-950 md:hidden border-t w-full bottom-0 fixed z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex justify-between items-center w-full">
              <MobileLink href="/dashboard" icon={<HomeIcon />} label="Home" />
              <MobileLink href="/asset" icon={<Archive />} label="Asset" />
              <a
                href="/qr-scanner"
                className="text-xl bg-orange-600 p-1 shadow rounded flex flex-col items-center gap-1 text-white active:scale-95 transition-all duration-100"
              >
                <ScanQrCode className="w-10 h-10" />
              </a>

              {role !== "admin" ? (
                <div>&nbsp;</div>
              ) : (
                <>
                  <MobileLink
                    href="/inspection"
                    icon={<SearchCheck />}
                    label="Inspection"
                  />
                </>
              )}
              <button
                onClick={() => setMenuOpen(true)}
                className="text-xl flex flex-col items-center gap-1 text-white active:scale-95 transition-all group"
                aria-label="Open menu"
              >
                <MenuIcon className="group-hover:scale-[1.2] transition-all duration-300 w-6 h-6" />
                <span className="text-xs">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer Portal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <div
                className="drawer-container"
                style={{ position: "relative", zIndex: 10000 }}
              >
                {/* Overlay */}
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMenuOpen(false)}
                />

                {/* Mobile Drawer Sidebar */}
                <motion.div
                  className="fixed left-0 top-0 bottom-0 w-64 bg-gray-100 shadow-lg z-[9999] flex flex-col overflow-hidden"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  style={{ maxHeight: "100vh" }}
                >
                  <div className="p-4 border-b border-blue-800 flex items-center justify-between">
                    <div className="w-10 h-10">
                      <Logo />
                    </div>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="text-white hover:text-red-400"
                      aria-label="Close menu"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  </div>

                  <div className="py-2">
                    <UserDropDown isCompact={false} />
                  </div>

                  <div className="flex flex-col p-2 gap-1 overflow-y-auto">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                    >
                      <HomeIcon className="w-5 h-5" />
                      <span>Home</span>
                    </Link>

                    <Link
                      href="/asset"
                      className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                    >
                      <Archive className="w-5 h-5" />
                      <span>Asset</span>
                    </Link>

                    {role === "pic" && (
                      <Link
                        href="/inspection"
                        className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                      >
                        <SearchCheck className="w-5 h-5" />
                        <span>Inspect</span>
                      </Link>
                    )}

                    {role === "admin" && (
                      <>
                        <Link
                          href="/inspection"
                          className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                        >
                          <SearchCheck className="w-5 h-5" />
                          <span>Inspect</span>
                        </Link>

                        <Link
                          href="/category"
                          className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                        >
                          <BookCopy className="w-5 h-5" />
                          <span>Code</span>
                        </Link>

                        <Link
                          href="/location"
                          className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                        >
                          <MapPin className="w-5 h-5" />
                          <span>Zone</span>
                        </Link>

                        <Link
                          href="/user"
                          className="flex items-center gap-3 text-gray-500 hover:text-orange-600 p-3 rounded-md transition-all"
                        >
                          <User2 className="w-5 h-5" />
                          <span>User</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="p-3 mt-3">
                    <Link
                      href="/qr-scanner"
                      className="bg-orange-600 hover:bg-orange-500 w-full py-3 px-4 flex items-center justify-center gap-2 rounded-md text-white font-medium"
                    >
                      <ScanQrCode className="w-5 h-5" />
                      <span>Scan QR Code</span>
                    </Link>
                  </div>

                  <div className="mt-4 px-3">
                    <LocationDisplay size={9} orientation="vertical" />
                  </div>

                  <div className="flex-grow"></div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function DesktopNav() {
  const { role } = useUserStore();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    // Load preference from localStorage on mount
    const savedCompactState = localStorage.getItem("sidebarCompact");
    if (savedCompactState !== null) {
      setIsCompact(savedCompactState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCompact;
    setIsCompact(newState);
    // Save preference to localStorage
    localStorage.setItem("sidebarCompact", String(newState));
  };

  return (
    <nav
      className={`hidden md:flex flex-col h-[100svh] gap-1 ${
        isCompact ? "w-[4.5rem]" : "w-[15rem]"
      } transition-all duration-300 ${
        isCompact ? "pl-3 pr-3" : "pl-12 pr-7"
      } pb-4 relative`}
    >
      <div className="h-[12.75rem] flex items-center justify-center">
        <UserDropDown isCompact={isCompact} />
      </div>

      {/* <button 
        onClick={toggleSidebar}
        className="absolute -right-[-1.5rem] top-[10.75rem] bg-blue-950 text-gray-500 hover:text-orange-600 p-1 rounded-full shadow-md z-10"
        aria-label={isCompact ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button> */}

      <DesktopLink
        href="/dashboard"
        icon={<HomeIcon />}
        label="Home"
        isCompact={isCompact}
      />
      <DesktopLink
        href="/asset"
        icon={<Archive />}
        label="Asset"
        isCompact={isCompact}
      />
      {role === "pic" && (
        <DesktopLink
          href="/inspection"
          icon={<SearchCheck />}
          label="Inspect"
          isCompact={isCompact}
        />
      )}

      {role === "admin" && (
        <>
          <DesktopLink
            href="/inspection"
            icon={<SearchCheck />}
            label="Inspect"
            isCompact={isCompact}
          />
          <DesktopLink
            href="/category"
            icon={<BookCopy />}
            label="Code"
            isCompact={isCompact}
          />
          <DesktopLink
            href="/location"
            icon={<MapPin />}
            label="Zone"
            isCompact={isCompact}
          />
          <DesktopLink
            href="/user"
            icon={<User2 />}
            label="User"
            isCompact={isCompact}
          />
        </>
      )}

      <div className="flex w-full items-center justify-center py-4">
        <Link
          href="/qr-scanner"
          className={`bg-orange-600 group hover:bg-orange-200 hover:text-orange-600 py-2 ${
            isCompact ? "px-2" : "px-4"
          } transition-all duration-300 flex flex-row items-center ${
            isCompact ? "justify-center" : "justify-start"
          } gap-1 rounded shadow relative w-full text-white`}
        >
          <ScanQrCode className="w-[1.5rem] h-[1.5rem] group-hover:scale-[1.2] transition-all duration-300" />
          {!isCompact && <span className="text-xs font-bold">Scan QR</span>}
        </Link>
      </div>

      <div className="flex flex-grow flex-col"></div>
      <LocationDisplay size={99} orientation="vertical" />
    </nav>
  );
}

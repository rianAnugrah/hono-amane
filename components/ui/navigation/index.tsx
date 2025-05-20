"use client";

import React, { useState, useEffect } from "react";

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
import { usePageContext } from "@/renderer/usePageContext";
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

  return (
    <nav className="bg-gradient-to-br  from-cyan-950 to-blue-950 hidden border-t w-full bottom-0 fixed z-10">
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
              {/* <span className="text-xs">Scan</span> */}
            </a>

            {role !== "admin" ? (
              <div>&nbsp;</div>
            ) : (
              <>
                <MobileLink
                  href="/location"
                  icon={<MapPin />}
                  label="Location"
                />
                <MobileLink
                  href="/inspection"
                  icon={<SearchCheck />}
                  label="Inspection"
                />
              </>
            )}
            {/* <button
              onClick={() => setMenuOpen(true)}
              className={`text-xl flex flex-col items-center gap-1  text-white active:scale-95 transition-all group`}
            >
              <MenuIcon className="group-hover:scale-[1.2] transition-all duration-300 w-[1rem] h-[1rem]" />
              <span className="text-xs">Menu</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Side Drawer Overlay with Animation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
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
              <Link href="/" className="text-gray-800 hover:text-blue-600">
                Home
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-blue-600">
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-800 hover:text-blue-600"
              >
                Contact
              </Link>
              <a
                href="/logout"
                className="text-gray-800 hover:text-blue-600 text-left"
              >
                Logout
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

function DesktopNav() {
  const { role } = useUserStore();
  const [isCompact, setIsCompact] = useState(false);
  
  useEffect(() => {
    // Load preference from localStorage on mount
    const savedCompactState = localStorage.getItem('sidebarCompact');
    if (savedCompactState !== null) {
      setIsCompact(savedCompactState === 'true');
    }
  }, []);
  
  const toggleSidebar = () => {
    const newState = !isCompact;
    setIsCompact(newState);
    // Save preference to localStorage
    localStorage.setItem('sidebarCompact', String(newState));
  };

  return (
    <nav className={`flex flex-col h-[100svh] gap-1 ${isCompact ? 'w-[4.5rem]' : 'w-[15rem]'} transition-all duration-300 ${isCompact ? 'pl-3 pr-3' : 'pl-12 pr-7'} pb-4 relative`}>
      <div className="h-[12.75rem] flex items-center justify-center">
       <UserDropDown isCompact={isCompact} />
      </div>
      
      <button 
        onClick={toggleSidebar}
        className="absolute -right-[-1.5rem] top-[10.75rem] bg-blue-950 text-white hover:bg-blue-800 p-1 rounded-full shadow-md z-10"
        aria-label={isCompact ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      <DesktopLink href="/dashboard" icon={<HomeIcon />} label="Home" isCompact={isCompact} />
      <DesktopLink href="/asset" icon={<Archive />} label="Asset" isCompact={isCompact} />
      {role === "pic" && (
        <DesktopLink href="/inspection" icon={<SearchCheck />} label="Inspect" isCompact={isCompact} />
      )}

      {role === "admin" && (
        <>
          <DesktopLink
            href="/inspection"
            icon={<SearchCheck />}
            label="Inspect"
            isCompact={isCompact}
          />
          <DesktopLink href="/category" icon={<BookCopy />} label="Code" isCompact={isCompact} />
          <DesktopLink href="/location" icon={<MapPin />} label="Zone" isCompact={isCompact} />
          <DesktopLink href="/user" icon={<User2 />} label="User" isCompact={isCompact} />
        </>
      )}
      
      <div className="flex w-full items-center justify-center py-4">
        <Link
          href="/qr-scanner"
          className={`bg-orange-600 group hover:bg-orange-200 hover:text-orange-600 py-2 ${isCompact ? 'px-2' : 'px-4'} transition-all duration-300 flex flex-row items-center ${isCompact ? 'justify-center' : 'justify-start'} gap-1 rounded shadow relative w-full text-white`}
        >
          <ScanQrCode className="w-[1.5rem] h-[1.5rem] group-hover:scale-[1.2] transition-all duration-300" />
          {!isCompact && <span className="text-xs font-bold">Scan QR</span>}
        </Link>
      </div>

      <LocationDisplay size={ isCompact ? 0 : 3} orientation="vertical" />
      
      <div className="flex flex-grow flex-col"></div>
      
     
    </nav>
  );
}

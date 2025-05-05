"use client";

import React, { useState } from "react";

import {
  Archive,
  BookCopy,
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
    <nav className="bg-[#476f80] md:hidden border-t w-full bottom-0 fixed z-50">
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
              <MobileLink href="/location" icon={<MapPin />} label="Location" />
            )}
            <button
              onClick={() => setMenuOpen(true)}
              className={`text-xl flex flex-col items-center gap-1  text-white active:scale-95 transition-all group`}
            >
              <MenuIcon className="group-hover:scale-[1.2] transition-all duration-300 w-[1rem] h-[1rem]" />
              <span className="text-xs">Menu</span>
            </button>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

function DesktopNav() {
  const { role } = useUserStore();
  return (
    <nav className="hidden  md:flex flex-col  h-[100svh] gap-1 w-[10rem] pl-4 pb-4">
      <div className="h-[4.75rem] flex items-center justify-center">
        <div className="h-[3rem] w-[3rem]">
          <Logo />
        </div>
      </div>
      <DesktopLink href="/dashboard" icon={<HomeIcon />} label="Home" />
      <DesktopLink href="/asset" icon={<Archive />} label="Asset" />
      {role === "admin" && (
        <>
          <DesktopLink href="/category" icon={<BookCopy />} label="Category" />
          <DesktopLink href="/location" icon={<MapPin />} label="Location" />
          <DesktopLink href="/user" icon={<User2 />} label="User" />
        </>
      )}
      {/* <DesktopLink href="/setting" icon={<Settings />} label="Setting" /> */}
      <div className="flex w-full items-center justify-center py-4">
        <Link
          href="/qr-scanner"
          className=" bg-orange-600 group hover:bg-orange-200 hover:text-orange-600 py-2 px-4 transition-all duration-300 flex flex-row items-center justify-start gap-1 rounded shadow relative w-full   text-white"
        >
          <ScanQrCode className="w-[1rem] h-[1rem] group-hover:scale-[1.2] transition-all duration-300" />
          <span className="text-xs font-bold">Scan QR</span>
        </Link>
      </div>
      <div className="flex flex-grow flex-col"></div>
      <DesktopLink href="/login" icon={<LogOut />} label="Logout" />
    </nav>
  );
}

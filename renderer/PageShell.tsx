export { PageShell };

import React, { useEffect, useRef } from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider } from "./usePageContext";
import { Link } from "./Link";
import type { PageContext } from "vike/types";
import "./css/index.css";
import "./PageShell.css";
import Navbar from "@/components/ui/navigation";
import TopBar from "@/components/ui/top-bar";
import autoAnimate from "@formkit/auto-animate";
import { crypto } from "@/server/utils/crypto";

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);

    // Check for 'hcmlSession' cookie and log its value
    const cookies = document.cookie.split(";");
    const hcmlSessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("hcmlSession=")
    );
    const hcmlSessionValue = hcmlSessionCookie
      ? hcmlSessionCookie.split("=")[1]
      : null;
    console.log("hcmlSession cookie value:", hcmlSessionValue);
    checkCredential(hcmlSessionValue);
  }, [parent]);

  const checkCredential = (token: string) => {
    const test = crypto.decrypt(token);
    console.log("DECRYPTED", test);
  };

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Navbar />
          <div className=" w-full md:w-[calc(100%_-_10rem)]  flex flex-col h-full">
            <TopBar />
            <div className="flex w-full h-[calc(100svh_-_4rem)] overflow-y-auto   md:px-4 md:pb-4">
              <div
                ref={parent}
                className="w-full pb-[5rem] bg-gray-100 rounded-2xl overflow-y-auto  border-gray-300 p-0"
              >
                {children}
              </div>
            </div>
          </div>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-[100svh] relative flex bg-gradient-to-br  from-[#476f80] to-[#647c89]">
      {children}
    </div>
  );
}

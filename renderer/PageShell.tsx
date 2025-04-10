export { PageShell };

import React from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider } from "./usePageContext";
import { Link } from "./Link";
import type { PageContext } from "vike/types";
import "./css/index.css";
import "./PageShell.css";
import Navbar from "@/components/ui/navigation";
import TopBar from "@/components/ui/top-bar";

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Navbar />
          <div className=" w-full md:w-[calc(100%_-_5rem)]  flex flex-col h-full">
            <TopBar />
            <div className="flex w-full h-[calc(100svh_-_4rem)] overflow-y-auto   md:px-4 md:pb-4">
              <div className="w-full pb-[5rem] bg-gray-100 rounded-2xl overflow-y-auto border border-gray-300 p-0">

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
  return <div className="w-full h-[100svh] relative flex bg-gradient-to-br  from-[#476f80] to-[#647c89]">{children}</div>;
}

// function Sidebar({ children }: { children: React.ReactNode }) {
//   return (
//     <div
//       id="sidebar"
//       style={{
//         padding: 20,
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         lineHeight: '1.8em',
//         borderRight: '2px solid #eee'
//       }}
//     >
//       {children}
//     </div>
//   )
// }

// function Content({ children }: { children: React.ReactNode }) {
//   return (
//     <div id="page-container">
//       <div
//         id="page-content"
//         style={{
//           padding: 20,
//           paddingBottom: 50,
//           minHeight: '100vh'
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   )
// }

// function Logo() {
//   return (
//     <div
//       style={{
//         marginTop: 20,
//         marginBottom: 10
//       }}
//     >
//       <a href="/">
//         <img src={logoUrl} height={64} width={64} alt="logo" />
//       </a>
//     </div>
//   )
// }

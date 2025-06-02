import React from "react";
import "../../renderer/PageShell.css";

export { Layout };

// children includes <Page/>
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-gradient-to-b  from-[#476f80] to-[#647c89] flex items-center justify-center">
      <div>{children}</div>
    </div>
  );
}

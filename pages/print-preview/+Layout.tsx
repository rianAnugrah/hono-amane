export { Layout };
import React from 'react';
import "../../renderer/PageShell.css";

// children includes <Page/>
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div>{children}</div>
    </div>
  );
}

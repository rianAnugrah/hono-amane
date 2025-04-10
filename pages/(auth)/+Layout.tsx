export { Layout };
import "../../renderer/PageShell.css";

// children includes <Page/>
function Layout({ children }) {
  return (
    <div className="h-screen w-full bg-gradient-to-b  from-[#476f80] to-[#647c89] flex items-center justify-center">
      <div>{children}</div>
    </div>
  );
}

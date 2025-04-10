export { Layout };
import "../../renderer/PageShell.css";

// children includes <Page/>
function Layout({ children }) {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#26140E] to-[#8C4A34] flex items-center justify-center">
      <div>{children}</div>
    </div>
  );
}

export { Layout };
import "../../renderer/PageShell.css";

// children includes <Page/>
function Layout({ children }) {
  return (
    <div className="">
      <div>{children}</div>
    </div>
  );
}

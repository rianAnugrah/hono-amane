export { Layout }
import '../../renderer/PageShell.css'
 
// children includes <Page/>
function Layout({ children }) {
  return <div className='w-full h-[100svh] bg-red-500'>
   <p>Login LAYOUT</p>
    <div>{children}</div>
  </div>
}
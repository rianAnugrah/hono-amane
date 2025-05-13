// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM from 'react-dom/client'
import { PageShell } from './PageShell'
import { getPageTitle } from './getPageTitle'
import type { OnRenderClientAsync } from 'vike/types'

// Maintain a single root across navigations
let root: ReactDOM.Root

const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page, isHydration } = pageContext

  // This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
  // to support SPA
  if (!Page) throw new Error('My onRenderClient() hook expects pageContext.Page to be defined')

  const container = document.getElementById('react-root')
  if (!container) throw new Error('DOM element #react-root not found')

  const page = (
    <PageShell pageContext={pageContext}>
      <Page />
    </PageShell>
  )

  // For the initial page load: hydrate the page
  if (isHydration) {
    root = ReactDOM.hydrateRoot(container, page)
    
    // Set up navigation event listener only once
    window.addEventListener('vike:navigate', async (event: Event) => {
      // Apply transition class
      document.body.classList.add('page-transition');
      
      // Reset scroll position
      window.scrollTo(0, 0);
      
      try {
        // Force a page reload for now to ensure proper navigation
        window.location.reload();
        
        // Once the navigation system is more stable, we could try this instead:
        // const customEvent = event as CustomEvent;
        // const url = customEvent.detail.url;
        // // This would need a proper implementation to get the new page content
        // // For now, we'll just reload the page
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        document.body.classList.remove('page-transition');
      }
    });
  } else {
    // For subsequent navigations: render to the same root
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    
    root.render(page)
  }

  // Update page title
  document.title = getPageTitle(pageContext)
}

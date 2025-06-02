// https://vike.dev/onRenderClient
export { onRenderClient }

import React from 'react'
import ReactDOM from 'react-dom/client'
import { PageShell } from './PageShell'
import { getPageTitle } from './getPageTitle'
import type { OnRenderClientAsync } from 'vike/types'

// Maintain a single root across navigations
let root: ReactDOM.Root | null = null

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
    // Only create root if it doesn't already exist
    if (!root) {
      root = ReactDOM.hydrateRoot(container, page)
    }
  } else {
    // For subsequent navigations: render to the existing root
    if (!root) {
      // Create root if it doesn't exist (fallback)
      root = ReactDOM.createRoot(container)
    }
    
    // Render the new page content
    root.render(page)
  }

  // Update page title
  document.title = getPageTitle(pageContext)
}

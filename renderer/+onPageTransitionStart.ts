// https://vike.dev/onPageTransitionStart
export { onPageTransitionStart }

import type { OnPageTransitionStartAsync } from 'vike/types'

/**
 * This function is called when a page transition starts.
 * It's useful for showing a loading indicator when navigating between pages.
 */
const onPageTransitionStart: OnPageTransitionStartAsync = async () => {
  document.querySelector('body')?.classList.add('page-is-transitioning')
}

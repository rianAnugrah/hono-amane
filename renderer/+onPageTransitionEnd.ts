// https://vike.dev/onPageTransitionEnd
export { onPageTransitionEnd }

import type { OnPageTransitionEndAsync } from 'vike/types'

/**
 * This function is called when a page transition completes.
 * We use it to remove the loading indicator and cleanup.
 */
const onPageTransitionEnd: OnPageTransitionEndAsync = async () => {
  document.querySelector('body')?.classList.remove('page-is-transitioning')
}

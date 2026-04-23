"use client";
import { useEffect } from "react";

/**
 * Force the page to load at the top on a bare URL.
 *
 * The default browser behavior restores the previous scroll position when a
 * user revisits a tab (or navigates back to a previously visited page), which
 * made the proposal site sometimes open partway down the page on return
 * visits. For a single-page proposal we always want a returning visitor to
 * start at the hero.
 *
 * When the URL carries a hash like `#coordination` (e.g. someone clicked a
 * nav link or shared a deep link), we respect the hash and let the browser's
 * anchor scrolling take over.
 */
export function ScrollRestoration() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}

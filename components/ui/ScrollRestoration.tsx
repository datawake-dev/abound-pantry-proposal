"use client";
import { useEffect } from "react";

/**
 * Force the page to load at the top on a bare URL.
 *
 * The primary scroll-reset runs as an inline <head> script in app/layout.tsx
 * so it fires before first paint. This component handles the secondary
 * cases that the inline script cannot:
 *
 * - bfcache restores (the pageshow event's persisted flag), where the
 *   browser reuses the rendered DOM and the inline <head> script does not
 *   re-execute
 * - post-hydration re-asserts of scrollRestoration=manual in case any
 *   library or framework flips it back
 *
 * When the URL carries a hash (a shared deep link or a nav click), we
 * respect the hash and let the browser's anchor scrolling take over.
 */
export function ScrollRestoration() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    function resetIfNoHash() {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }

    // bfcache restore: pageshow fires with event.persisted === true when the
    // browser reuses a page from the back-forward cache. The inline <head>
    // script does not re-execute on a bfcache restore, so we re-assert here.
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        resetIfNoHash();
      }
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}

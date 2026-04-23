import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ScrollRestoration } from "@/components/ui/ScrollRestoration";

// Literal script body for the pre-hydration scroll reset. Declared as a
// constant so the static analyzer can see it is not user-derived content
// (no interpolation, no external inputs) before it reaches the inline
// <script> tag below.
//
// The scrollIntoView no-op shim neutralizes libraries (notably cmdk, which
// auto-selects its first item on mount and calls scrollIntoView on it) that
// would otherwise scroll the document past the hero during hydration. Hash
// navigation uses the browser's native anchor scroll, which does not go
// through Element.prototype.scrollIntoView, so deep links still work.
const SCROLL_RESET_SCRIPT =
  "try{" +
    "if('scrollRestoration' in history){history.scrollRestoration='manual'}" +
    "if(!location.hash){window.scrollTo(0,0)}" +
    "var _siv=Element.prototype.scrollIntoView;" +
    "Element.prototype.scrollIntoView=function(){};" +
    "setTimeout(function(){Element.prototype.scrollIntoView=_siv},900);" +
  "}catch(e){}";

// DESIGN.md §2.1 — font trinity:
// Geist (display), DM Sans (body), Geist Mono (metadata/labels)
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OC Pantry Coordination Network: Proposal",
  description:
    "A coordination data layer for Orange County food distribution. Open pantry directory, weekly distribution schedule, public read APIs. Owned by Abound Food Care, built and maintained by Datawake, in collaboration with A Million Dreams Consulting.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "OC Pantry Coordination Network: Proposal",
    description:
      "A coordination data layer for Orange County food distribution. Owned by Abound Food Care, built by Datawake in collaboration with A Million Dreams Consulting.",
    type: "website",
  },
};

// Next.js 16 requires themeColor in viewport export (not metadata)
export const viewport: Viewport = {
  themeColor: "#0C7C8A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to the OpenFreeMap tile CDN — the map loads post-LCP
            but warming the TCP + TLS handshake early shaves a few hundred ms
            off the tile request once MapLibre hydrates. */}
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tiles.openfreemap.org" />
        {/* Scroll-to-top before first paint. Must be a raw inline <script>
            tag in <head>, not a next/script component: next/script with
            strategy=beforeInteractive in App Router queues the body on
            self.__next_s and runs it after the main chunk loads, which is
            too late — the browser has already painted at the restored
            scroll offset by then. The static content comes from a literal
            constant above. */}
        <script
          dangerouslySetInnerHTML={{ __html: SCROLL_RESET_SCRIPT }}
        />
      </head>
      <body className="bg-surface-paper text-ink min-h-full flex flex-col">
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}

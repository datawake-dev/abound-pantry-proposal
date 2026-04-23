import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ScrollRestoration } from "@/components/ui/ScrollRestoration";

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
      </head>
      <body className="bg-surface-paper text-ink min-h-full flex flex-col">
        {/* Scroll-to-top before hydration. Runs synchronously before the
            React tree mounts so the browser does not paint at the
            previously restored offset and then snap to top afterwards. */}
        <Script id="scroll-restoration-init" strategy="beforeInteractive">
          {`try{if('scrollRestoration' in history){history.scrollRestoration='manual'}if(!location.hash){window.scrollTo(0,0)}}catch(e){}`}
        </Script>
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}

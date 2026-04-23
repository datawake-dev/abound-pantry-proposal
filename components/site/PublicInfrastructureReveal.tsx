"use client";
import { LazyMotion, domAnimation, m } from "motion/react";
import type { ReactNode } from "react";

/**
 * Isolated client wrapper for Phase 5 preamble scroll-reveal. Keeps
 * PublicInfrastructure itself a Server Component (Shiki runs at build, never
 * ships to the client).
 */
export default function PublicInfrastructureReveal({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

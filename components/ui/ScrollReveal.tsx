"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * CSS-only scroll reveal, triggered by a single IntersectionObserver.
 *
 * Replaces Motion's `whileInView` (+ LazyMotion + <m.div>) for below-fold
 * sections. The Motion version mounts ~9 observers and a Motion tree per
 * section which inflates the LCP-adjacent JS budget; this version ships one
 * tiny hook + a single class transition per element.
 *
 * Semantics match DESIGN.md §5.7 intent: `opacity 0 → 1`, `translateY 24 → 0`,
 * `blur 4 → 0`, 700ms `cubic-bezier(0.32, 0.72, 0, 1)`, fires once at
 * `rootMargin: "-80px"`. `prefers-reduced-motion` short-circuits to the final
 * state with no transition (the global rule in globals.css sets
 * `transition-duration: 0.001ms` under reduced-motion, which resolves the
 * element to its final state immediately).
 */
export interface ScrollRevealProps {
  children: ReactNode;
  /** Stagger delay in ms (default 0). */
  delayMs?: number;
  /** Optional className passed through to the wrapper. */
  className?: string;
  /** Optional inline style passed through to the wrapper, merged with the
   *  internal transitionDelay if delayMs is set. */
  style?: React.CSSProperties;
  /** Override rootMargin. Defaults to "-80px 0px" matching the Motion config. */
  rootMargin?: string;
  /** `as` element for the wrapper. Defaults to `div`. */
  as?: "div" | "section" | "article" | "header" | "figure" | "li";
}

export function ScrollReveal({
  children,
  delayMs = 0,
  className,
  style,
  rootMargin = "-80px 0px",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    // If IntersectionObserver is unavailable (jsdom without the polyfill
    // installed, very old browser), reveal immediately so content is never
    // stuck in the hidden state. setState in effect is intentional here —
    // we need SSR to start hidden, then flip once we know IO is missing.
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed, rootMargin]);

  const base =
    "transition-[opacity,transform,filter] duration-[700ms] ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[opacity,transform,filter]";
  const hidden = "opacity-0 translate-y-6 blur-[4px]";
  const shown = "opacity-100 translate-y-0 blur-0";

  // Using React.createElement keeps the `as` prop polymorphic without a
  // heavy generic forwardRef. This component accepts a controlled subset of
  // HTML tags; style and className are the only extra props we forward.
  const Wrapper = Tag as unknown as React.ElementType;
  const mergedStyle: React.CSSProperties | undefined =
    delayMs > 0 || style
      ? { transitionDelay: delayMs > 0 ? `${delayMs}ms` : undefined, ...style }
      : undefined;

  return (
    <Wrapper
      ref={ref}
      data-slot="scroll-reveal"
      data-revealed={revealed ? "true" : "false"}
      className={[base, revealed ? shown : hidden, className ?? ""].join(" ")}
      style={mergedStyle}
    >
      {children}
    </Wrapper>
  );
}

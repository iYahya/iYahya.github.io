"use client";

import { type ReactNode } from "react";

import { useInViewOnce } from "@/hooks/useInViewOnce";

export function SectionAnimate({ className = "", children }: { className?: string; children: ReactNode }) {
  const { ref, visible } = useInViewOnce();
  return (
    <div ref={ref} className={`${className} section-animate${visible ? " is-visible" : ""}`.trim()}>
      {children}
    </div>
  );
}

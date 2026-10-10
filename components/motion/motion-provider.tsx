"use client";

import { MotionConfig } from "motion/react";

/** Motion defaults for the whole site: honour the visitor's reduced-motion setting. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

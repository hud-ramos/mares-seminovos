"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string; atraso?: number; como?: "div" | "li" };

export default function Revelar({ children, className, atraso = 0, como = "div" }: Props) {
  const reduzir = useReducedMotion();
  const Tag = como === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={reduzir ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

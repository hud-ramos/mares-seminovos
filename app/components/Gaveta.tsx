"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { IconeX } from "./icones";

type Props = {
  aberta: boolean;
  aoFechar: () => void;
  titulo: ReactNode;
  children: ReactNode;
  rodape?: ReactNode;
  /** "lateral" vira painel à direita a partir de 768px; "centro" vira modal. No celular, sempre sobe da base. */
  modo?: "centro" | "lateral";
};

export default function Gaveta({ aberta, aoFechar, titulo, children, rodape, modo = "centro" }: Props) {
  const fechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberta) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    document.addEventListener("keydown", tecla);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => fechar.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = overflow;
      clearTimeout(t);
    };
  }, [aberta, aoFechar]);

  const lateral = modo === "lateral";

  return (
    <AnimatePresence>
      {aberta && (
        <div
          className={`fixed inset-0 z-50 flex items-end ${lateral ? "md:items-stretch md:justify-end" : "md:items-center md:justify-center"}`}
          role="dialog"
          aria-modal="true"
        >
          <motion.button
            aria-label="Fechar"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-tinta/55"
            onClick={aoFechar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`relative flex max-h-[92dvh] w-full flex-col rounded-t-[20px] bg-branco shadow-2xl ${
              lateral ? "md:max-h-none md:w-[520px] md:rounded-none" : "md:w-[480px] md:rounded-[20px]"
            }`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-linha py-4 pr-4 pl-5 md:pl-8">
              <div className="text-[22px] font-medium">{titulo}</div>
              <button
                ref={fechar}
                onClick={aoFechar}
                aria-label="Fechar"
                className="grid size-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-nevoa"
              >
                <IconeX />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 md:px-8">{children}</div>
            {rodape && <div className="border-t border-linha px-5 pt-3.5 pb-6 md:px-8">{rodape}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

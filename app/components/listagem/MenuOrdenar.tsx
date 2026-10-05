"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ORDENS, type Ordem } from "@/lib/filtros";
import { IconeCheck, IconeChevron } from "../icones";

/** Ordenar com largura fixa da opção mais longa, para o texto não "sambar". */
export default function MenuOrdenar({ ordem, mudar }: { ordem: Ordem; mudar: (o: Ordem) => void }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const atual = ORDENS.find((o) => o.id === ordem)!;

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false);
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        onClick={() => setAberto(!aberto)}
        className="flex w-[245px] items-center justify-between gap-2 py-1.5 text-base font-medium"
      >
        <span className="truncate">Ordenar: {atual.label}</span>
        <IconeChevron className={`shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {aberto && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-30 mt-2 w-[260px] overflow-hidden rounded-2xl border border-linha bg-branco py-2 shadow-xl"
          >
            {ORDENS.map((o) => (
              <li key={o.id}>
                <OpcaoOrdem
                  label={o.label}
                  selecionada={o.id === ordem}
                  aoEscolher={() => {
                    mudar(o.id);
                    setAberto(false);
                  }}
                />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function OpcaoOrdem({ label, selecionada, aoEscolher }: { label: string; selecionada: boolean; aoEscolher: () => void }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selecionada}
      onClick={aoEscolher}
      className={`flex w-full items-center justify-between px-[18px] py-[11px] text-left text-[15px] transition-colors hover:bg-nevoa ${
        selecionada ? "bg-nevoa font-bold" : ""
      }`}
    >
      {label}
      {selecionada && <IconeCheck className="text-azul" />}
    </button>
  );
}

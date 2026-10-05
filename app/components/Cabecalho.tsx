"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Marca";
import { IconeBusca, IconeCoracao, IconeWhatsApp, IconeX } from "./icones";
import { useFavoritos } from "@/lib/favoritos";
import { linkWhatsApp } from "@/lib/site";
import FaixaConfianca from "./FaixaConfianca";

const NAV = [
  { label: "Seminovos", href: "/", ativo: true },
  { label: "Venda seu carro", href: "/#troca" },
  { label: "Financiamento", href: "/carros/ms0014#simular" },
  { label: "Lojas", href: "#lojas" },
];

export default function Cabecalho() {
  const { lista } = useFavoritos();
  const [menu, setMenu] = useState(false);

  return (
    <header>
      <div className="margem flex h-[60px] items-center justify-between bg-azul md:h-[89px]">
        <Link href="/" aria-label="Marés Seminovos, ir para a listagem" className="shrink-0">
          <Logo altura={32} className="h-8 w-auto md:h-10" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className={n.ativo ? "font-bold text-amarelo" : "font-medium text-creme transition-colors hover:text-amarelo"}
              aria-current={n.ativo ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-creme">
          <Link href="/?busca=1" aria-label="Buscar carros" className="transition-colors hover:text-amarelo">
            <IconeBusca />
          </Link>
          <Link href="/?favoritos=1" aria-label={`Favoritos (${lista.length})`} className="relative transition-colors hover:text-amarelo">
            <IconeCoracao />
            {lista.length > 0 && (
              <span className="absolute -top-2 -right-2.5 grid min-w-[18px] place-items-center rounded-full bg-amarelo px-1 text-[11px] font-bold text-tinta">
                {lista.length}
              </span>
            )}
          </Link>
          <a
            href={linkWhatsApp("Olá! Vim pelo site da Marés Seminovos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-amarelo px-7 py-4 font-bold text-tinta transition-colors hover:bg-amarelo-hover md:inline-flex"
          >
            <IconeWhatsApp />
            WhatsApp
          </a>
          <button aria-label="Abrir menu" aria-expanded={menu} onClick={() => setMenu(true)} className="flex flex-col gap-[5px] lg:hidden">
            <span className="h-0.5 w-5 rounded bg-current" />
            <span className="h-0.5 w-5 rounded bg-current" />
            <span className="h-0.5 w-5 rounded bg-current" />
          </button>
        </div>
      </div>
      <FaixaConfianca />

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-azul text-creme lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="margem flex h-[60px] items-center justify-between">
              <Logo altura={32} className="h-8 w-auto" />
              <button aria-label="Fechar menu" onClick={() => setMenu(false)}>
                <IconeX size={22} />
              </button>
            </div>
            <nav aria-label="Menu" className="margem flex flex-col gap-6 pt-10 text-2xl font-medium">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} onClick={() => setMenu(false)} className={n.ativo ? "text-amarelo" : ""}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

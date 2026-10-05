"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Carro, FAIXAS_KM, FAIXAS_PRECO, TIPOS } from "@/lib/carros";
import { contar, type Estado, type Faceta, FAIXAS_ANO } from "@/lib/filtros";
import { IconeCheck, IconeChevron } from "../icones";

type Opcao = { id: string; label: string };

function Grupo({ titulo, aberto: inicial, children }: { titulo: string; aberto?: boolean; children: ReactNode }) {
  const [aberto, setAberto] = useState(!!inicial);
  return (
    <div className="border-b border-linha">
      <button type="button" aria-expanded={aberto} onClick={() => setAberto(!aberto)} className="flex w-full items-center justify-between py-4 text-left text-base font-medium">
        {titulo}
        <IconeChevron className={`transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-col gap-3 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CaixaMarcar({ marcado, label, extra, aoMudar }: { marcado: boolean; label: string; extra?: ReactNode; aoMudar: () => void }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 text-[15px]">
      <input type="checkbox" className="peer sr-only" checked={marcado} onChange={aoMudar} />
      <span
        className={`grid size-[22px] shrink-0 place-items-center rounded-md border-[1.5px] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-azul ${
          marcado ? "border-azul bg-azul text-white" : "border-tinta bg-branco group-hover:border-azul group-hover:bg-nevoa"
        }`}
      >
        {marcado && <IconeCheck size={14} />}
      </span>
      <span>{label}</span>
      {extra}
    </label>
  );
}

export default function PainelFiltros({
  carros,
  estado,
  alternar,
}: {
  carros: Carro[];
  estado: Estado;
  alternar: (f: Faceta, v: string) => void;
}) {
  const [mais, setMais] = useState(false);
  const unicos = (k: "marca" | "cambio" | "combustivel" | "loja") =>
    [...new Set(carros.map((c) => c[k]))].sort().map((v) => ({ id: v, label: v }));

  const lista = (f: Faceta, opcoes: Opcao[]) =>
    opcoes.map((o) => {
      const n = contar(carros, estado, f, o.id);
      const marcado = estado.facetas[f].includes(o.id);
      if (!n && !marcado) return null;
      return (
        <CaixaMarcar key={o.id} marcado={marcado} label={o.label} aoMudar={() => alternar(f, o.id)} extra={<span className="text-sm text-cinza">{n}</span>} />
      );
    });

  return (
    <div>
      <Grupo titulo="Preço" aberto>
        {lista("preco", FAIXAS_PRECO)}
      </Grupo>
      <Grupo titulo="Tipo de carro" aberto>
        {lista("tipo", TIPOS.map((t) => ({ id: t, label: t })))}
      </Grupo>
      <Grupo titulo="Marca">{lista("marca", unicos("marca"))}</Grupo>
      <Grupo titulo="Ano">{lista("ano", FAIXAS_ANO)}</Grupo>
      <Grupo titulo="Quilometragem">{lista("km", FAIXAS_KM)}</Grupo>
      {mais ? (
        <>
          <Grupo titulo="Câmbio">{lista("cambio", unicos("cambio"))}</Grupo>
          <Grupo titulo="Combustível">{lista("combustivel", unicos("combustivel"))}</Grupo>
          <Grupo titulo="Loja">{lista("loja", unicos("loja"))}</Grupo>
        </>
      ) : (
        <div className="pt-6">
          <button
            type="button"
            onClick={() => setMais(true)}
            className="w-full rounded-full border-[1.5px] border-tinta py-3.5 text-[15px] font-bold transition-colors hover:border-azul hover:bg-azul hover:text-white"
          >
            Todos os filtros
          </button>
          <p className="mt-2 text-center text-[13px] text-cinza">Câmbio, combustível e loja</p>
        </div>
      )}
    </div>
  );
}

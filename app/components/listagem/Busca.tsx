"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Carro, DESTAQUE_ID, foto, formatarPreco, nome, url } from "@/lib/carros";
import { casaBusca, type Estado, filtrar, normalizar } from "@/lib/filtros";
import { IconeBusca, IconeTendencia, IconeX } from "../icones";
import { SemFoto } from "../CardCarro";

export type Preset = { label: string; aplicar: (e: Estado) => Estado };

export const PRESETS: Preset[] = [
  { label: "SUV até R$ 90 mil", aplicar: (e) => ({ ...e, facetas: { ...e.facetas, tipo: ["SUV"], preco: ["ate60", "60a90"] } }) },
  { label: "Com garantia de fábrica", aplicar: (e) => ({ ...e, atalhos: ["garantiaFabrica"] }) },
  { label: "Automático até 60 mil km", aplicar: (e) => ({ ...e, facetas: { ...e.facetas, cambio: ["Automático"], km: ["ate30", "30a60"] } }) },
  { label: "Picape diesel", aplicar: (e) => ({ ...e, facetas: { ...e.facetas, tipo: ["Picape"], combustivel: ["Diesel"] } }) },
];

function Destacado({ texto, termo }: { texto: string; termo: string }) {
  const i = normalizar(texto).indexOf(normalizar(termo));
  if (!termo || i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <strong className="font-bold">{texto.slice(i, i + termo.length)}</strong>
      {texto.slice(i + termo.length)}
    </>
  );
}

type Props = {
  carros: Carro[];
  valor: string;
  aoMudar: (v: string) => void;
  aoAplicarPreset: (p: Preset) => void;
  base: Estado;
};

const Busca = forwardRef<HTMLInputElement, Props>(function Busca({ carros, valor, aoMudar, aoAplicarPreset, base }, ref) {
  const [foco, setFoco] = useState(false);
  const [texto, setTexto] = useState(valor);
  const termo = texto.trim();

  const sugestoes = useMemo(() => {
    if (termo.length < 2) return null;
    const vazio: Estado = { ...base, q: "", atalhos: [], facetas: { ...base.facetas, marca: [] } };
    const modelos = new Map<string, { label: string; n: number; carro: Carro }>();
    const marcas = new Map<string, number>();
    for (const c of carros) {
      const m = `${c.marca} ${c.modelo}`;
      if (normalizar(m).includes(normalizar(termo)) || casaBusca(c, termo)) {
        const atual = modelos.get(m);
        modelos.set(m, { label: m, n: (atual?.n ?? 0) + 1, carro: atual?.carro && foto(atual.carro) ? atual.carro : c });
      }
      if (normalizar(c.marca).includes(normalizar(termo))) marcas.set(c.marca, (marcas.get(c.marca) ?? 0) + 1);
    }
    const total = filtrar(carros, { ...vazio, q: termo }).length;
    return {
      modelos: [...modelos.values()].sort((a, b) => b.n - a.n).slice(0, 5),
      marcas: [...marcas.entries()],
      total,
    };
  }, [termo, carros, base]);

  const destaque = carros.find((c) => c.id === DESTAQUE_ID);

  const confirmar = (v: string) => {
    setTexto(v);
    aoMudar(v);
    setFoco(false);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <div className="relative w-full" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFoco(false)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          confirmar(texto);
        }}
        className={`flex h-[52px] items-center gap-3.5 rounded-full border-2 bg-creme px-4 transition-colors md:h-[60px] md:px-6 ${
          foco ? "border-azul bg-branco" : "border-transparent"
        }`}
      >
        <IconeBusca className="shrink-0" />
        <label htmlFor="busca" className="sr-only">
          Buscar por marca, modelo ou versão
        </label>
        <input
          ref={ref}
          id="busca"
          type="search"
          autoComplete="off"
          value={texto}
          onFocus={() => setFoco(true)}
          onChange={(e) => {
            setTexto(e.target.value);
            if (!e.target.value) aoMudar("");
          }}
          placeholder="Busque por marca, modelo ou versão. Ex.: Corolla Cross"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-cinza md:text-[17px] [&::-webkit-search-cancel-button]:hidden"
        />
        {texto && (
          <button
            type="button"
            aria-label="Limpar busca"
            onClick={() => {
              setTexto("");
              aoMudar("");
            }}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-areia hover:bg-linha"
          >
            <IconeX size={14} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {foco && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-full z-40 mt-3 overflow-hidden rounded-[20px] border border-linha bg-branco py-2 shadow-xl"
          >
            {!sugestoes ? (
              <>
                <Rotulo>Buscas populares</Rotulo>
                {PRESETS.map((p) => (
                  <Linha
                    key={p.label}
                    onClick={() => {
                      aoAplicarPreset(p);
                      setFoco(false);
                    }}
                    icone={<IconeTendencia className="text-cinza" />}
                    fim={`${filtrar(carros, p.aplicar({ ...base, q: "", atalhos: [] })).length} carros`}
                  >
                    {p.label}
                  </Linha>
                ))}
                {destaque && (
                  <>
                    <Rotulo>Destaque da semana</Rotulo>
                    <Link href={url(destaque)} className="flex items-center gap-4 px-5 py-2.5 hover:bg-nevoa md:px-6">
                      <Miniatura carro={destaque} />
                      <span className="flex-1">
                        {nome(destaque)} · {destaque.ano}
                      </span>
                      <span className="text-sm text-cinza">{formatarPreco(destaque.preco)}</span>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                {sugestoes.modelos.length > 0 && <Rotulo>Modelos</Rotulo>}
                {sugestoes.modelos.map((m) => (
                  <Linha key={m.label} onClick={() => confirmar(m.label)} icone={<Miniatura carro={m.carro} />} fim={`${m.n} ${m.n === 1 ? "carro" : "carros"}`}>
                    <Destacado texto={m.label} termo={termo} />
                  </Linha>
                ))}
                {sugestoes.marcas.length > 0 && <Rotulo>Marca</Rotulo>}
                {sugestoes.marcas.map(([marca, n]) => (
                  <Linha key={marca} onClick={() => confirmar(marca)} icone={<IconeBusca size={18} className="text-cinza" />} fim={`${n} carros`}>
                    {marca} · todos os modelos
                  </Linha>
                ))}
                <div className="mt-1 border-t border-linha px-5 pt-3 pb-1 md:px-6">
                  <button type="button" onClick={() => confirmar(texto)} className="font-bold text-azul hover:underline">
                    {sugestoes.total
                      ? `Ver todos os resultados para "${termo}" (${sugestoes.total})`
                      : `Nenhum carro para "${termo}". Buscar mesmo assim`}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
export default Busca;

function Rotulo({ children }: { children: ReactNode }) {
  return <p className="px-5 pt-3 pb-1.5 text-xs font-bold tracking-wider text-cinza uppercase md:px-6">{children}</p>;
}

function Linha({ children, icone, fim, onClick }: { children: ReactNode; icone: ReactNode; fim: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 px-5 py-2.5 text-left hover:bg-nevoa md:px-6">
      {icone}
      <span className="flex-1">{children}</span>
      <span className="text-sm text-cinza">{fim}</span>
    </button>
  );
}

function Miniatura({ carro }: { carro: Carro }) {
  const f = foto(carro);
  return (
    <span className="relative block h-10 w-14 shrink-0 overflow-hidden rounded-md bg-areia">
      {f ? <Image src={f} alt="" fill sizes="56px" quality={70} className="object-cover" /> : <SemFoto compacto />}
    </span>
  );
}

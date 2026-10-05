"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ATALHOS, type Carro, type ChaveAtalho, FAIXAS_KM, FAIXAS_PRECO } from "@/lib/carros";
import {
  ESTADO_INICIAL,
  type Estado,
  type Faceta,
  FAIXAS_ANO,
  filtrar,
  ORDENS,
  type Ordem,
  ordenar,
  totalFiltrosAtivos,
} from "@/lib/filtros";
import { useFavoritos } from "@/lib/favoritos";
import { linkConversa } from "@/lib/links";
import CardCarro, { CardCarregando } from "../CardCarro";
import BannerTroca from "../BannerTroca";
import Gaveta from "../Gaveta";
import { classeBotao } from "../Botao";
import { IconeBusca, IconeChevron, IconeFiltros, IconeX } from "../icones";
import Atalhos from "./Atalhos";
import Busca, { PRESETS } from "./Busca";
import MenuOrdenar, { OpcaoOrdem } from "./MenuOrdenar";
import PainelFiltros from "./PainelFiltros";

const POR_PAGINA = 12;
const POSICAO_BANNER = 6;

const ROTULO_FACETA: Record<Faceta, (v: string) => string> = {
  preco: (v) => FAIXAS_PRECO.find((f) => f.id === v)!.label,
  km: (v) => FAIXAS_KM.find((f) => f.id === v)!.label,
  ano: (v) => FAIXAS_ANO.find((f) => f.id === v)!.label,
  tipo: (v) => v,
  marca: (v) => v,
  cambio: (v) => v,
  combustivel: (v) => v,
  loja: (v) => v,
};

function estadoDaUrl(p: URLSearchParams): Estado {
  const atalho = p.get("atalho") as ChaveAtalho | null;
  const ordem = p.get("ordem") as Ordem | null;
  return {
    ...ESTADO_INICIAL,
    q: p.get("q") ?? "",
    atalhos: atalho && ATALHOS.some((a) => a.chave === atalho) ? [atalho] : [],
    ordem: ordem && ORDENS.some((o) => o.id === ordem) ? ordem : "relevantes",
  };
}

export default function Listagem({ carros }: { carros: Carro[] }) {
  const params = useSearchParams();
  const [estado, setEstado] = useState<Estado>(() => estadoDaUrl(params));
  const [visiveis, setVisiveis] = useState(POR_PAGINA);
  const [carregando, setCarregando] = useState(false);
  const [gaveta, setGaveta] = useState<"filtros" | "ordem" | null>(null);
  const { lista: favoritos } = useFavoritos();
  const soFavoritos = params.get("favoritos") === "1";
  const buscaRef = useRef<HTMLInputElement>(null);
  const primeira = useRef(true);

  // Troca de filtro: um instante de "carregando", como num site com servidor de verdade.
  const mudar = useCallback((fn: (e: Estado) => Estado) => {
    setCarregando(true);
    setEstado(fn);
    setVisiveis(POR_PAGINA);
  }, []);

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    const t = setTimeout(() => setCarregando(false), 320);
    // Mantém a URL compartilhável sem recarregar a página.
    const u = new URLSearchParams();
    if (soFavoritos) u.set("favoritos", "1");
    if (estado.q) u.set("q", estado.q);
    if (estado.atalhos.length === 1 && totalFiltrosAtivos(estado) === 1) u.set("atalho", estado.atalhos[0]);
    if (estado.ordem !== "relevantes") u.set("ordem", estado.ordem);
    window.history.replaceState(null, "", u.toString() ? `/?${u}` : "/");
    return () => clearTimeout(t);
  }, [estado, soFavoritos]);

  useEffect(() => {
    if (params.get("busca") === "1") buscaRef.current?.focus();
  }, [params]);

  const base = useMemo(() => (soFavoritos ? carros.filter((c) => favoritos.includes(c.id)) : carros), [carros, favoritos, soFavoritos]);
  const resultado = useMemo(() => ordenar(filtrar(base, estado), estado.ordem), [base, estado]);
  const contagensAtalhos = useMemo(() => {
    const semAtalhos = filtrar(base, estado, "atalhos");
    return Object.fromEntries(
      ATALHOS.map((a) => [a.chave, semAtalhos.filter((c) => c.diferenciais[a.chave] && estado.atalhos.every((x) => c.diferenciais[x])).length]),
    ) as Record<ChaveAtalho, number>;
  }, [base, estado]);

  const ativos = totalFiltrosAtivos(estado);
  const alternarAtalho = (c: ChaveAtalho) =>
    mudar((e) => ({ ...e, atalhos: e.atalhos.includes(c) ? e.atalhos.filter((x) => x !== c) : [...e.atalhos, c] }));
  const alternarFaceta = (f: Faceta, v: string) =>
    mudar((e) => {
      const atual = e.facetas[f];
      return { ...e, facetas: { ...e.facetas, [f]: atual.includes(v) ? atual.filter((x) => x !== v) : [...atual, v] } };
    });
  const limpar = () => mudar((e) => ({ ...ESTADO_INICIAL, ordem: e.ordem }));

  const ordemAtual = ORDENS.find((o) => o.id === estado.ordem)!;
  const mostrar = resultado.slice(0, visiveis);

  const chips = [
    ...estado.atalhos.map((a) => ({ k: `a-${a}`, label: ATALHOS.find((x) => x.chave === a)!.label, tirar: () => alternarAtalho(a) })),
    ...(Object.keys(estado.facetas) as Faceta[]).flatMap((f) =>
      estado.facetas[f].map((v) => ({ k: `${f}-${v}`, label: ROTULO_FACETA[f](v), tirar: () => alternarFaceta(f, v) })),
    ),
  ];

  const titulo = soFavoritos ? "Favoritos" : estado.q ? estado.q : "Seminovos";

  return (
    <main id="conteudo" className="flex-1">
      <div className="margem pt-5 pb-4 lg:pt-7">
        <nav aria-label="Você está em" className="mb-6 hidden text-sm text-cinza lg:block">
          <Link href="/" className="hover:text-tinta">
            Início
          </Link>{" "}
          / <span className="text-tinta">Seminovos</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
          <h1 className="shrink-0 text-[28px] font-bold lg:min-w-[276px] lg:text-[40px]">
            <span className="capitalize">{titulo}</span> <span className="text-cinza">({resultado.length})</span>
          </h1>
          <Busca
            ref={buscaRef}
            carros={carros}
            valor={estado.q}
            base={estado}
            aoMudar={(q) => mudar((e) => ({ ...e, q }))}
            aoAplicarPreset={(p) => mudar((e) => p.aplicar({ ...ESTADO_INICIAL, ordem: e.ordem }))}
          />
        </div>
        {soFavoritos && (
          <p className="mt-3 text-sm text-cinza">
            Os favoritos ficam salvos neste navegador.{" "}
            <Link href="/" className="font-bold text-azul hover:underline">
              Ver todos os seminovos
            </Link>
          </p>
        )}
      </div>

      {/* Atalhos + ordenação */}
      <div className="lg:margem flex items-center gap-4">
        <span className="hidden text-base font-medium lg:block">Filtros</span>
        <div className="sem-barra margem min-w-0 flex-1 overflow-x-auto py-1 lg:px-0">
          <Atalhos ativos={estado.atalhos} contagens={contagensAtalhos} alternar={alternarAtalho} />
        </div>
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <span aria-hidden className="h-6 w-px bg-linha" />
          <MenuOrdenar ordem={estado.ordem} mudar={(o) => mudar((e) => ({ ...e, ordem: o }))} />
        </div>
      </div>

      {/* Mobile: Filtros e Ordenar */}
      <div className="margem mt-4 grid grid-cols-2 gap-2.5 lg:hidden">
        <button onClick={() => setGaveta("filtros")} className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-tinta bg-branco py-3 font-medium">
          <IconeFiltros />
          Filtros
          {ativos > 0 && <span className="grid size-[22px] place-items-center rounded-full bg-azul text-[13px] font-bold text-white">{ativos}</span>}
        </button>
        <button onClick={() => setGaveta("ordem")} className="flex items-center justify-center gap-2 rounded-full border-[1.5px] border-tinta bg-branco py-3 font-medium">
          Ordenar
          <IconeChevron />
        </button>
      </div>
      {/* Com filtro, a contagem já aparece na linha dos chips logo abaixo. */}
      <p className={`margem mt-3 text-sm text-cinza lg:hidden ${chips.length > 0 ? "hidden" : ""}`}>
        {resultado.length} {resultado.length === 1 ? "carro" : "carros"} · {ordemAtual.label}
      </p>

      {chips.length > 0 && (
        <div className="margem mt-4 flex flex-wrap items-center gap-2.5">
          <span className="text-[15px] text-cinza">
            {resultado.length} {resultado.length === 1 ? "carro" : "carros"} com
          </span>
          {chips.map((c) => (
            <button key={c.k} onClick={c.tirar} className="flex items-center gap-2 rounded-full bg-nevoa py-1.5 pr-2.5 pl-3.5 text-sm hover:bg-claro/40" aria-label={`Remover filtro ${c.label}`}>
              {c.label}
              <IconeX size={14} />
            </button>
          ))}
          <button onClick={limpar} className="text-[15px] font-medium text-azul underline">
            Limpar filtros
          </button>
        </div>
      )}

      <div className="margem mt-6 flex gap-10 pb-14 lg:pb-20">
        <aside aria-label="Filtros" className="hidden w-[264px] shrink-0 lg:block">
          <PainelFiltros carros={base} estado={estado} alternar={alternarFaceta} />
        </aside>

        <section aria-label="Resultados" aria-live="polite" aria-busy={carregando} className="min-w-0 flex-1">
          {carregando ? (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardCarregando key={i} />
              ))}
            </div>
          ) : resultado.length === 0 ? (
            <SemResultado
              estado={estado}
              soFavoritos={soFavoritos}
              sugestoes={ordenar(carros, "relevantes").slice(0, 3)}
              aoLimpar={limpar}
              aoPreset={(i) => mudar((e) => PRESETS[i].aplicar({ ...ESTADO_INICIAL, ordem: e.ordem }))}
            />
          ) : (
            <>
              <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                {mostrar.map((c, i) => (
                  <Fragment key={c.id}>
                    {i === POSICAO_BANNER && !soFavoritos && <BannerTroca />}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(i % POR_PAGINA, 8) * 0.04 }}
                    >
                      <CardCarro carro={c} prioridade={i < 3} />
                    </motion.div>
                  </Fragment>
                ))}
              </div>
              <div className="mt-14 flex flex-col items-center gap-3.5">
                <p className="text-[15px] text-cinza">
                  Mostrando {mostrar.length} de {resultado.length} {resultado.length === 1 ? "carro" : "carros"}
                </p>
                <div className="h-[3px] w-60 overflow-hidden rounded-full bg-linha">
                  <div className="h-full bg-tinta transition-all" style={{ width: `${(mostrar.length / resultado.length) * 100}%` }} />
                </div>
                {visiveis < resultado.length && (
                  <button onClick={() => setVisiveis((v) => v + POR_PAGINA)} className={classeBotao("contorno", "mt-2 w-full md:w-auto")}>
                    Carregar mais {Math.min(POR_PAGINA, resultado.length - visiveis)}
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      <Gaveta
        aberta={gaveta === "filtros"}
        aoFechar={() => setGaveta(null)}
        titulo="Filtros"
        rodape={
          <div className="flex gap-3">
            <button onClick={limpar} className={classeBotao("contorno", "px-6")}>
              Limpar
            </button>
            <button onClick={() => setGaveta(null)} className={classeBotao("primario", "flex-1")}>
              Ver {resultado.length} {resultado.length === 1 ? "carro" : "carros"}
            </button>
          </div>
        }
      >
        <PainelFiltros carros={base} estado={estado} alternar={alternarFaceta} />
      </Gaveta>

      <Gaveta aberta={gaveta === "ordem"} aoFechar={() => setGaveta(null)} titulo="Ordenar por">
        <div className="-mx-5 md:-mx-8">
          {ORDENS.map((o) => (
            <OpcaoOrdem
              key={o.id}
              label={o.label}
              selecionada={o.id === estado.ordem}
              aoEscolher={() => {
                mudar((e) => ({ ...e, ordem: o.id }));
                setGaveta(null);
              }}
            />
          ))}
        </div>
      </Gaveta>
    </main>
  );
}

function SemResultado({
  estado,
  soFavoritos,
  sugestoes,
  aoLimpar,
  aoPreset,
}: {
  estado: Estado;
  soFavoritos: boolean;
  sugestoes: Carro[];
  aoLimpar: () => void;
  aoPreset: (i: number) => void;
}) {
  const oQue = estado.q ? estado.q : "um carro com esses filtros";
  return (
    <div>
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-nevoa px-6 py-12 text-center md:px-10 md:py-14">
        <span className="grid size-[72px] place-items-center rounded-full bg-white">
          <IconeBusca size={30} />
        </span>
        <h2 className="text-2xl font-bold md:text-[30px]">
          {soFavoritos ? "Você ainda não salvou nenhum carro" : `Não temos ${oQue} no estoque agora`}
        </h2>
        <p className="max-w-[560px] text-base text-cinza md:text-[17px]">
          {soFavoritos
            ? "Toque no coração de um card para guardar o carro aqui."
            : "O estoque muda toda semana. Deixe seu WhatsApp que a gente avisa quando chegar um carro parecido, ou ajuste a busca."}
        </p>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          {!soFavoritos && (
            <Link href={linkConversa({ assunto: "aviso", texto: estado.q })} className={classeBotao("primario")}>
              Me avise no WhatsApp
            </Link>
          )}
          {soFavoritos ? (
            <Link href="/" className={classeBotao("contorno")}>
              Ver todos os seminovos
            </Link>
          ) : (
            <button onClick={aoLimpar} className={classeBotao("contorno")}>
              Ver todos os seminovos
            </button>
          )}
        </div>
        {!soFavoritos && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[15px] text-cinza">Tente:</span>
            {PRESETS.slice(0, 3).map((p, i) => (
              <button key={p.label} onClick={() => aoPreset(i)} className="rounded-full border border-tinta bg-white px-3.5 py-1.5 text-sm hover:bg-creme">
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <h2 className="titulo-display mt-14 mb-6 text-[30px] md:text-4xl">Enquanto isso, veja estes</h2>
      <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        {sugestoes.map((c) => (
          <CardCarro key={c.id} carro={c} />
        ))}
      </div>
    </div>
  );
}

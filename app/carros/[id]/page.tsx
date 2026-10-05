import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cabecalho from "@/app/components/Cabecalho";
import Rodape from "@/app/components/Rodape";
import Selo from "@/app/components/Selo";
import Revelar from "@/app/components/Revelar";
import { Ondas } from "@/app/components/Marca";
import CardCarro from "@/app/components/CardCarro";
import Galeria from "@/app/components/veiculo/Galeria";
import Simulador from "@/app/components/veiculo/Simulador";
import BarraFixa from "@/app/components/veiculo/BarraFixa";
import { BotoesCompra, Compartilhar, FavoritoBorda } from "@/app/components/veiculo/AcoesCompra";
import {
  IconeCheck,
  IconeDocumento,
  IconeDono,
  IconeGarantia,
  IconeInfo,
  IconeKm,
  IconeLaudo,
  IconePin,
  IconeRelogio,
  IconeRevisao,
  IconeSeta,
  IconeSetaBaixo,
  IconeTroca,
  IconeX,
} from "@/app/components/icones";
import { CARROS, entradaMinima, foto, formatarPreco, galeria, nome, parcelaPadrao, parecidos, porId, url } from "@/lib/carros";
import { ficha, ITENS_SERIE, LOJAS, motivos, type Motivo, procedencia, type Status } from "@/lib/veiculo";
import { linkConversa } from "@/lib/links";

export function generateStaticParams() {
  return CARROS.map((c) => ({ id: c.id.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps<"/carros/[id]">): Promise<Metadata> {
  const { id } = await params;
  const c = porId(id);
  if (!c) return {};
  const titulo = `${nome(c)} ${c.ano}`;
  const f = foto(c);
  return {
    title: titulo,
    description: `${titulo}, ${c.km.toLocaleString("pt-BR")} km, ${formatarPreco(c.preco)}. Simule a parcela, veja a procedência e fale com a Marés pelo WhatsApp.`,
    alternates: { canonical: url(c) },
    openGraph: { title: titulo, images: f ? [{ url: f }] : undefined },
  };
}

const ICONE_MOTIVO: Record<Motivo["icone"], { I: typeof IconeLaudo; bg: string; cor: string }> = {
  laudo: { I: IconeLaudo, bg: "#E3EAFB", cor: "#2A55C0" },
  dono: { I: IconeDono, bg: "#EFE7FB", cor: "#6B3FB8" },
  revisao: { I: IconeRevisao, bg: "#DDF4F2", cor: "#0F766E" },
  fipe: { I: IconeSetaBaixo, bg: "#DCF0E3", cor: "#15803D" },
  ipva: { I: IconeDocumento, bg: "#FFF2D1", cor: "#9A5B00" },
  troca: { I: IconeTroca, bg: "#E2E7F2", cor: "#00266E" },
  garantia: { I: IconeGarantia, bg: "#E2E7F2", cor: "#00266E" },
  km: { I: IconeKm, bg: "#FFF2D1", cor: "#9A5B00" },
};

const STATUS: Record<Status, { bg: string; cor: string; I: typeof IconeCheck }> = {
  Comprovado: { bg: "#DCF0E3", cor: "#15803D", I: IconeCheck },
  Informado: { bg: "#FFF2D1", cor: "#9A5B00", I: IconeInfo },
  "Sem registro": { bg: "#ECEAE4", cor: "#6B6F76", I: IconeX },
};

const SELOS_PAGINA = [
  ["laudoAprovado", "Laudo aprovado"],
  ["unicoDono", "Único dono"],
  ["revisoesConcessionaria", "Revisado na concessionária"],
  ["garantiaFabrica", "Garantia de fábrica"],
  ["baixaKm", "Baixa quilometragem"],
] as const;

export default async function PaginaVeiculo({ params }: PageProps<"/carros/[id]">) {
  const { id } = await params;
  const c = porId(id);
  if (!c) notFound();

  const link = url(c);
  const itens = procedencia(c);
  const comprovados = itens.filter((i) => i.status === "Comprovado").length;
  const titulo = nome(c);
  const outros = parecidos(c);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${titulo} ${c.ano}`,
    brand: { "@type": "Brand", name: c.marca },
    model: c.modelo,
    vehicleModelDate: String(c.ano),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: c.km, unitCode: "KMT" },
    color: c.cor,
    fuelType: c.combustivel,
    vehicleTransmission: c.cambio,
    itemCondition: "https://schema.org/UsedCondition",
    image: foto(c) ?? undefined,
    offers: { "@type": "Offer", price: c.preco, priceCurrency: "BRL", availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Cabecalho />
      <main className="flex-1 pb-24 lg:pb-0">
        <div className="margem pt-4 lg:pt-7">
          <Link href="/" className="flex items-center gap-1 text-sm text-cinza hover:text-tinta lg:hidden">
            <IconeSeta size={16} /> Voltar para seminovos
          </Link>
          <nav aria-label="Você está em" className="hidden text-sm text-cinza lg:block">
            <Link href="/" className="hover:text-tinta">
              Início
            </Link>{" "}
            /{" "}
            <Link href="/" className="hover:text-tinta">
              Seminovos
            </Link>{" "}
            /{" "}
            <Link href={`/?q=${encodeURIComponent(c.tipo)}`} className="hover:text-tinta">
              {c.tipo}
            </Link>{" "}
            / <span className="text-tinta">{titulo}</span>
          </nav>
        </div>

        {/* Topo: galeria + painel de compra */}
        <section className="mt-4 flex flex-col gap-6 lg:margem lg:mt-6 lg:flex-row lg:gap-12">
          <div id="galeria" className="min-w-0 lg:flex-[860]">
            <Galeria fotos={galeria(c)} />
          </div>
          <div className="margem flex flex-col gap-5 lg:flex-[436] lg:px-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {SELOS_PAGINA.filter(([k]) => c.diferenciais[k]).map(([, l]) => (
                  <Selo key={l} label={l} />
                ))}
              </div>
              <div className="flex shrink-0 gap-2">
                <FavoritoBorda id={c.id} />
                <Compartilhar titulo={titulo} url={link} />
              </div>
            </div>
            <div>
              <h1 className="text-[28px] leading-tight font-bold lg:text-[34px]">{titulo}</h1>
              <p className="mt-1.5 text-[15px] text-cinza">
                {c.ano} · {c.km.toLocaleString("pt-BR")} km · {c.cambio} · {c.combustivel} · {c.cor}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl bg-creme p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[40px] leading-none font-bold">{formatarPreco(c.preco)}</span>
                {c.abaixoFipe && c.fipe > c.preco && (
                  <span className="rounded-md bg-verde px-2.5 py-1 text-[13px] font-bold text-white">{formatarPreco(c.fipe - c.preco)} abaixo da FIPE</span>
                )}
              </div>
              <p className="text-sm text-cinza">Tabela FIPE: {formatarPreco(c.fipe)}</p>
              <p className="mt-2 text-[17px]">
                a partir de 48x de {formatarPreco(parcelaPadrao(c))}
              </p>
              <p className="text-sm text-cinza">com entrada de {formatarPreco(entradaMinima(c))}</p>
            </div>
            <BotoesCompra carro={c} />
            <div className="flex gap-3 border-t border-linha pt-4">
              <IconePin className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">
                  {c.loja} · {LOJAS[c.loja]}
                </p>
                <p className="text-sm text-cinza">Seg a sáb, 9h às 19h · Agende uma visita ou test drive</p>
              </div>
            </div>
          </div>
        </section>

        {/* Por que este carro */}
        <section className="margem pt-16 lg:pt-20" aria-labelledby="porque">
          <Revelar>
            <h2 id="porque" className="titulo-display text-[34px] lg:text-[44px]">
              Por que este {c.modelo}
            </h2>
          </Revelar>
          <ul className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
            {motivos(c).map((m, k) => {
              const { I, bg, cor } = ICONE_MOTIVO[m.icone];
              return (
                <Revelar key={m.titulo} como="li" atraso={k * 0.05} className="flex h-full items-center gap-4 rounded-2xl border border-linha bg-white p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: bg, color: cor }}>
                    <I />
                  </span>
                  <span>
                    <strong className="block text-[17px] font-bold">{m.titulo}</strong>
                    <span className="text-sm text-cinza">{m.texto}</span>
                  </span>
                </Revelar>
              );
            })}
          </ul>
        </section>

        {/* Procedência e laudo */}
        <section className="margem pt-16 lg:pt-20" aria-labelledby="procedencia">
          <Revelar>
            <h2 id="procedencia" className="titulo-display text-[34px] lg:text-[44px]">
              O que sabemos sobre ele
            </h2>
            <p className="mt-3 text-[17px] text-cinza">Os mesmos 6 pontos para todo carro da Marés. O que não tem comprovação, a gente mostra também.</p>
          </Revelar>
          <div className="mt-6 flex flex-col gap-5 lg:flex-row">
            <Revelar className="flex-1 rounded-2xl bg-nevoa p-5 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                <p className="text-[22px] font-bold">
                  {comprovados} de 6 <span className="text-base font-normal text-cinza">itens comprovados</span>
                </p>
                <div className="flex gap-1.5" aria-hidden>
                  {itens.map((i) => (
                    <span key={i.item} className={`h-1.5 w-7 rounded-full ${i.status === "Comprovado" ? "bg-verde" : "bg-linha"}`} />
                  ))}
                </div>
              </div>
              <ul>
                {itens.map((i) => {
                  const s = STATUS[i.status];
                  return (
                    <li key={i.item} className="grid grid-cols-[32px_1fr_auto] items-start gap-x-4 border-t border-claro/60 py-4 md:grid-cols-[32px_170px_1fr_auto]">
                      <span className="grid size-8 place-items-center rounded-full" style={{ background: s.bg, color: s.cor }}>
                        <s.I size={14} />
                      </span>
                      <span className="font-medium md:pt-1">{i.item}</span>
                      <span className="col-start-2 md:col-start-3 md:pt-1">
                        <span className="block">{i.detalhe}</span>
                        <span className="text-[13px] text-cinza">{i.fonte}</span>
                      </span>
                      <span
                        className="col-start-3 row-start-1 rounded-md px-2.5 py-1 text-[13px] font-bold md:col-start-4"
                        style={{ background: s.bg, color: s.cor }}
                      >
                        {i.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Revelar>

            {c.diferenciais.laudoAprovado && (
              <Revelar className="rounded-2xl bg-nevoa p-5 md:p-7 lg:w-[520px]" atraso={0.1}>
                <div className="flex items-center justify-between">
                  <h3 className="text-[22px] font-bold">Laudo cautelar</h3>
                  <span className="rounded-md bg-verde px-2.5 py-1 text-[13px] font-bold text-white">Aprovado</span>
                </div>
                <p className="mt-1 text-sm text-cinza">Feito pela Vistoria Litoral em 28/09/2026</p>
                <ul className="mt-3">
                  {[
                    ["Estrutura e longarinas", "Sem reparos"],
                    ["Chassi e motor", "Numeração original"],
                    ["Leilão", "Sem registro"],
                    ["Sinistro e roubo", "Sem registro"],
                    ["Débitos e multas", "Nada pendente"],
                  ].map(([a, b]) => (
                    <li key={a} className="flex items-center gap-3 border-b border-claro/60 py-3 text-[15px] last:border-0">
                      <IconeCheck className="text-verde" />
                      <span className="flex-1">{a}</span>
                      <span className="text-cinza">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link href={linkConversa({ carro: c.id, assunto: "laudo" })} className="mt-3 inline-block font-medium text-azul underline">
                  Pedir o laudo completo (PDF)
                </Link>
              </Revelar>
            )}
          </div>
        </section>

        {/* Simule e troque */}
        <section id="simular" className="relative mt-16 scroll-mt-24 overflow-hidden bg-profundo text-creme lg:mt-20" aria-labelledby="simular-titulo">
          <span id="simular-troca" className="absolute top-0" aria-hidden />
          <Ondas className="absolute top-24 left-[-160px] w-[620px] opacity-[0.07] lg:top-40 lg:w-[900px]" />
          <div className="margem relative grid gap-10 py-12 lg:grid-cols-[1fr_440px] lg:gap-20 lg:py-20">
            <Revelar className="lg:pt-24">
              <h2 id="simular-titulo" className="titulo-display text-[40px] lg:text-[56px]">
                Descubra sua parcela em 1 minuto
              </h2>
              <p className="mt-4 max-w-[640px] text-[17px] text-creme/85">
                Escolha a entrada e o prazo. Se tiver carro na troca, ele entra na conta, e o vendedor já começa a conversa sabendo o que você precisa.
              </p>
              <ul className="mt-6 flex flex-col gap-3.5">
                {[
                  [IconeCheck, "Sem compromisso"],
                  [IconeDocumento, "CPF opcional"],
                  [IconeRelogio, "Proposta em até 1 dia útil"],
                ].map(([I, t]) => {
                  const Ic = I as typeof IconeCheck;
                  return (
                    <li key={t as string} className="flex items-center gap-3 text-[17px]">
                      <span className="grid size-9 place-items-center rounded-full bg-white/10 text-amarelo">
                        <Ic />
                      </span>
                      {t as string}
                    </li>
                  );
                })}
              </ul>
            </Revelar>
            <Simulador carro={c} />
          </div>
        </section>

        {/* Ficha técnica */}
        <section className="margem pt-16 lg:pt-20" aria-labelledby="ficha">
          <Revelar>
            <h2 id="ficha" className="titulo-display text-[34px] lg:text-[44px]">
              Ficha técnica
            </h2>
          </Revelar>
          <dl className="mt-6 grid md:grid-cols-2 md:gap-x-12 xl:grid-cols-3">
            {ficha(c).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-linha py-3.5">
                <dt className="text-cinza">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-8 mb-3 font-medium">Itens de série</h3>
          <ul className="flex flex-wrap gap-2">
            {ITENS_SERIE[c.tipo].map((i) => (
              <li key={i} className="rounded-full bg-creme px-3.5 py-2 text-sm">
                {i}
              </li>
            ))}
          </ul>
        </section>

        {/* Parecidos */}
        {outros.length > 0 && (
          <section className="pt-16 pb-16 lg:pt-20 lg:pb-20" aria-labelledby="parecidos">
            <div className="margem flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 id="parecidos" className="titulo-display text-[34px] lg:text-[44px]">
                Outros {c.tipo === "Sedã" ? "sedãs" : c.tipo === "Picape" ? "picapes" : `${c.tipo}s`} nessa faixa de preço
              </h2>
              <Link href={`/?q=${encodeURIComponent(c.tipo)}`} className="font-medium text-azul underline">
                Ver todos ({CARROS.filter((o) => o.tipo === c.tipo).length})
              </Link>
            </div>
            <div className="sem-barra margem mt-6 flex snap-x gap-4 overflow-x-auto md:grid md:grid-cols-2 md:gap-6 md:overflow-visible xl:grid-cols-4">
              {outros.map((o) => (
                <div key={o.id} className="w-[280px] shrink-0 snap-start md:w-auto">
                  <CardCarro carro={o} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <BarraFixa carro={c} alvo="galeria" />
      <Rodape />
    </>
  );
}

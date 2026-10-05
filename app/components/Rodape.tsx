import Link from "next/link";
import { Logo, Ondas } from "./Marca";
import { IconeInstagram, IconeWhatsApp, IconeYouTube } from "./icones";
import { BotaoLink } from "./Botao";
import { SITE } from "@/lib/site";
import { linkConversa } from "@/lib/links";

const COLUNAS = [
  {
    titulo: "Comprar",
    links: [
      { label: "Seminovos", href: "/" },
      { label: "Com garantia de fábrica", href: "/?atalho=garantiaFabrica" },
      { label: "Abaixo da FIPE", href: "/?ordem=fipe" },
      { label: "Financiamento", href: "/carros/ms0014#simular" },
    ],
  },
  {
    titulo: "Vender",
    links: [
      { label: "Avaliar meu carro", href: "/#troca" },
      { label: "Usar na troca", href: "/carros/ms0014#simular" },
      { label: "Como avaliamos", href: "#como-avaliamos" },
    ],
  },
];

const LOJAS = [
  { nome: "Marés Litoral", end: "Av. Ana Costa, 1200 · Santos" },
  { nome: "Marés Centro", end: "R. da Consolação, 900 · São Paulo" },
  { nome: "Marés Zona Norte", end: "Av. Braz Leme, 1500 · São Paulo" },
];

export default function Rodape() {
  return (
    <footer id="lojas" className="relative overflow-hidden bg-profundo text-creme">
      <Ondas className="absolute -top-6 right-[-120px] w-[600px] opacity-[0.06] md:w-[820px]" />
      <div className="margem relative py-12 md:py-[72px]">
        <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Logo altura={56} className="h-14 w-auto self-start" />
            <p className="max-w-[340px] text-[17px] leading-relaxed text-creme/80">
              Seminovos com procedência, laudo e garantia. Três lojas entre Santos e São Paulo.
            </p>
            <BotaoLink href={linkConversa()} icone={<IconeWhatsApp />} className="self-start">
              Falar no WhatsApp
            </BotaoLink>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {COLUNAS.map((c) => (
              <div key={c.titulo}>
                <h2 className="mb-4 font-bold">{c.titulo}</h2>
                <ul className="flex flex-col gap-3 text-[15px] text-creme/75">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="hover:text-amarelo">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="mb-4 font-bold">Atendimento</h2>
              <ul className="flex flex-col gap-3 text-[15px] text-creme/75">
                <li>{SITE.telefone}</li>
                <li>WhatsApp {SITE.whatsappExibicao}</li>
                <li>Seg a sáb, 9h às 19h</li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h2 className="mb-4 font-bold">Lojas</h2>
              <ul className="flex flex-col gap-3">
                {LOJAS.map((l) => (
                  <li key={l.nome}>
                    <span className="block text-[15px]">{l.nome}</span>
                    <span className="text-[13px] text-creme/65">{l.end}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-5 border-t border-creme/15 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="text-[13px] text-creme/65">
            <p>© 2026 Marés Automóveis · Projeto fictício para o desafio AutoForce</p>
            <p>Imagens ilustrativas. Preços e condições sujeitos a alteração sem aviso e à análise de crédito.</p>
          </div>
          <ul className="flex gap-2.5">
            {[
              { l: "Instagram", I: IconeInstagram },
              { l: "WhatsApp", I: IconeWhatsApp },
              { l: "YouTube", I: IconeYouTube },
            ].map(({ l, I }) => (
              <li key={l}>
                <span aria-label={`${l} (fictício)`} className="grid size-10 place-items-center rounded-full bg-creme/10">
                  <I />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

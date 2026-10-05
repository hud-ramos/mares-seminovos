import dados from "@/data/carros.json";

export type Diferenciais = {
  laudoAprovado: boolean;
  unicoDono: boolean;
  garantiaFabrica: boolean;
  revisoesConcessionaria: boolean;
  baixaKm: boolean;
  ipvaPago: boolean;
  financiamentoEspecial: boolean;
  aceitaTroca: boolean;
};

export type Carro = {
  id: string;
  marca: string;
  modelo: string;
  versao: string;
  tipo: "SUV" | "Hatch" | "Sedã" | "Picape";
  ano: number;
  km: number;
  cambio: string;
  combustivel: string;
  cor: string;
  loja: string;
  preco: number;
  fipe: number;
  abaixoFipe: boolean;
  simulacao: { entrada: number; parcelas: number; parcela: number; taxaMensal: number };
  diferenciais: Diferenciais;
  selos: { label: string; tipo: string }[];
};

export const CARROS = dados as Carro[];

/** O carro usado como vitrine em todo o projeto (página do veículo no Figma). */
export const DESTAQUE_ID = "MS0014";

export const ATALHOS = [
  { chave: "laudoAprovado", label: "Laudo aprovado" },
  { chave: "unicoDono", label: "Único dono" },
  { chave: "garantiaFabrica", label: "Garantia de fábrica" },
  { chave: "revisoesConcessionaria", label: "Revisado na concessionária" },
  { chave: "baixaKm", label: "Baixa km" },
] as const;
export type ChaveAtalho = (typeof ATALHOS)[number]["chave"];

export const FAIXAS_PRECO = [
  { id: "ate60", label: "Até R$ 60 mil", min: 0, max: 60000 },
  { id: "60a90", label: "R$ 60 a 90 mil", min: 60000, max: 90000 },
  { id: "90a130", label: "R$ 90 a 130 mil", min: 90000, max: 130000 },
  { id: "acima130", label: "Acima de R$ 130 mil", min: 130000, max: Infinity },
];

export const FAIXAS_KM = [
  { id: "ate30", label: "Até 30 mil km", min: 0, max: 30000 },
  { id: "30a60", label: "30 a 60 mil km", min: 30000, max: 60000 },
  { id: "60a100", label: "60 a 100 mil km", min: 60000, max: 100000 },
  { id: "acima100", label: "Acima de 100 mil km", min: 100000, max: Infinity },
];

export const TIPOS = ["SUV", "Hatch", "Sedã", "Picape"] as const;

/** Fotos geradas para o projeto: uma por modelo, no mesmo cenário da loja. */
const FOTO_POR_MODELO: Record<string, string> = {
  Hilux: "01-hilux",
  Polo: "02-polo",
  Versa: "03-versa",
  Duster: "04-duster",
  Fastback: "05-fastback",
  "City Hatchback": "06-city",
  Creta: "07-creta",
  Argo: "08-argo",
  S10: "09-s10",
  Renegade: "10-renegade",
  Toro: "11-toro",
  "Onix Plus": "12-onix-plus",
  Compass: "compass",
  Corolla: "corolla",
  "HR-V": "hrv",
  Kicks: "kicks-principal",
  Yaris: "yaris",
  Amarok: "amarok",
  Kwid: "kwid",
  Civic: "civic",
  Virtus: "virtus",
  Pulse: "pulse",
  Onix: "onix",
  "T-Cross": "t-cross",
  Tracker: "tracker",
  Nivus: "nivus",
  Strada: "strada",
  City: "city",
  HB20: "hb20",
};

export function foto(c: Carro): string | null {
  if (c.modelo === "Corolla Cross") {
    return c.versao.includes("XRX") ? "/fotos/corolla-cross-xrx.jpg" : "/fotos/corolla-cross-xre.jpg";
  }
  const f = FOTO_POR_MODELO[c.modelo];
  return f ? `/fotos/${f}.jpg` : null;
}

export function galeria(c: Carro): { src: string; alt: string }[] {
  const nomeCarro = nome(c);
  if (c.id === DESTAQUE_ID) {
    return [
      { src: "/fotos/kicks-principal.jpg", alt: `${nomeCarro}, frente` },
      { src: "/fotos/kicks-traseira.jpg", alt: `${nomeCarro}, traseira` },
      { src: "/fotos/kicks-interior.jpg", alt: `${nomeCarro}, interior` },
      { src: "/fotos/kicks-painel.jpg", alt: `${nomeCarro}, painel com 52.000 km` },
      { src: "/fotos/kicks-porta-malas.jpg", alt: `${nomeCarro}, porta-malas` },
    ];
  }
  const f = foto(c);
  return f ? [{ src: f, alt: nomeCarro }] : [];
}

export const nome = (c: Carro) => `${c.marca} ${c.modelo} ${c.versao}`;
export const resumo = (c: Carro) => `${c.ano} · ${formatarKm(c.km)} · ${c.cambio}`;
export const url = (c: Carro) => `/carros/${c.id.toLowerCase()}`;

export const formatarPreco = (v: number) =>
  "R$ " + Math.round(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
export const formatarKm = (km: number) => `${km.toLocaleString("pt-BR")} km`;

/** Parcela pela tabela Price. */
export function parcela(valorFinanciado: number, meses: number, taxa: number) {
  if (valorFinanciado <= 0) return 0;
  return (valorFinanciado * taxa) / (1 - Math.pow(1 + taxa, -meses));
}

export const entradaMinima = (c: Carro) => Math.ceil((c.preco * 0.2) / 10) * 10;

/** Parcela "a partir de": entrada mínima, 48x, mesma conta do simulador. */
export const parcelaPadrao = (c: Carro) => parcela(c.preco - entradaMinima(c), 48, c.simulacao.taxaMensal);

/**
 * "Mais relevantes": o carro de vitrine primeiro, depois carros com foto,
 * mais selos de confiança e abaixo da FIPE.
 */
export function relevancia(c: Carro) {
  let s = 0;
  if (c.id === DESTAQUE_ID) s += 1000;
  if (foto(c)) s += 100;
  s += c.selos.length * 12;
  if (c.abaixoFipe) s += 6;
  s += (c.ano - 2016) * 0.5;
  return s;
}

export function porId(id: string) {
  return CARROS.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function parecidos(c: Carro, n = 4) {
  return CARROS.filter((o) => o.id !== c.id && o.tipo === c.tipo && foto(o))
    .sort((a, b) => Math.abs(a.preco - c.preco) - Math.abs(b.preco - c.preco))
    .slice(0, n);
}

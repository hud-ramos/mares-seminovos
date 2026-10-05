import { type Carro, type ChaveAtalho, FAIXAS_KM, FAIXAS_PRECO, nome, relevancia } from "./carros";

export const FAIXAS_ANO = [
  { id: "2024", label: "2024 ou mais novo", min: 2024, max: 9999 },
  { id: "2021", label: "2021 a 2023", min: 2021, max: 2023 },
  { id: "2018", label: "2018 a 2020", min: 2018, max: 2020 },
  { id: "2017", label: "2017 ou mais antigo", min: 0, max: 2017 },
];

export const ORDENS = [
  { id: "relevantes", label: "Mais relevantes" },
  { id: "menor", label: "Menor preço" },
  { id: "maior", label: "Maior preço" },
  { id: "km", label: "Menor km" },
  { id: "novos", label: "Mais novos" },
  { id: "fipe", label: "Mais abaixo da FIPE" },
] as const;
export type Ordem = (typeof ORDENS)[number]["id"];

export type Faceta = "preco" | "tipo" | "marca" | "ano" | "km" | "cambio" | "combustivel" | "loja";

export type Estado = {
  q: string;
  atalhos: ChaveAtalho[];
  facetas: Record<Faceta, string[]>;
  ordem: Ordem;
};

export const ESTADO_INICIAL: Estado = {
  q: "",
  atalhos: [],
  facetas: { preco: [], tipo: [], marca: [], ano: [], km: [], cambio: [], combustivel: [], loja: [] },
  ordem: "relevantes",
};

export const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const texto = (c: Carro) => normalizar(`${nome(c)} ${c.tipo} ${c.cor} ${c.combustivel} ${c.cambio}`);

export function casaBusca(c: Carro, q: string) {
  const termos = normalizar(q).split(/\s+/).filter(Boolean);
  if (!termos.length) return true;
  const t = texto(c);
  return termos.every((x) => t.includes(x));
}

function casaFaceta(c: Carro, f: Faceta, valores: string[]) {
  if (!valores.length) return true;
  switch (f) {
    case "preco":
      return valores.some((v) => {
        const r = FAIXAS_PRECO.find((x) => x.id === v)!;
        return c.preco >= r.min && c.preco < r.max;
      });
    case "km":
      return valores.some((v) => {
        const r = FAIXAS_KM.find((x) => x.id === v)!;
        return c.km >= r.min && c.km < r.max;
      });
    case "ano":
      return valores.some((v) => {
        const r = FAIXAS_ANO.find((x) => x.id === v)!;
        return c.ano >= r.min && c.ano <= r.max;
      });
    default:
      return valores.includes(String(c[f]));
  }
}

/** Aplica tudo, menos a faceta ignorada (para calcular as contagens de cada opção). */
export function filtrar(carros: Carro[], e: Estado, ignorar?: Faceta | "atalhos") {
  return carros.filter(
    (c) =>
      casaBusca(c, e.q) &&
      (ignorar === "atalhos" || e.atalhos.every((a) => c.diferenciais[a])) &&
      (Object.keys(e.facetas) as Faceta[]).every((f) => f === ignorar || casaFaceta(c, f, e.facetas[f])),
  );
}

export function ordenar(carros: Carro[], ordem: Ordem) {
  const l = [...carros];
  switch (ordem) {
    case "menor":
      return l.sort((a, b) => a.preco - b.preco);
    case "maior":
      return l.sort((a, b) => b.preco - a.preco);
    case "km":
      return l.sort((a, b) => a.km - b.km);
    case "novos":
      return l.sort((a, b) => b.ano - a.ano || a.km - b.km);
    case "fipe":
      return l.sort((a, b) => b.fipe - b.preco - (a.fipe - a.preco));
    default:
      return l.sort((a, b) => relevancia(b) - relevancia(a));
  }
}

export function contar(carros: Carro[], e: Estado, f: Faceta, valor: string) {
  return filtrar(carros, e, f).filter((c) => casaFaceta(c, f, [valor])).length;
}

export function totalFiltrosAtivos(e: Estado) {
  return e.atalhos.length + Object.values(e.facetas).reduce((n, v) => n + v.length, 0);
}

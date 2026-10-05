export const ANOS = Array.from({ length: 15 }, (_, k) => 2026 - k);

export const somenteDigitos = (s: string) => s.replace(/\D/g, "");
export const formatarMilhar = (n: number) => n.toLocaleString("pt-BR");

export function mascaraKm(v: string) {
  const d = somenteDigitos(v).slice(0, 7);
  return d ? formatarMilhar(Number(d)) : "";
}

export function mascaraZap(v: string) {
  const d = somenteDigitos(v).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

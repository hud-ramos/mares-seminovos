import { IconeDono, IconeGarantia, IconeKm, IconeLaudo, IconeRevisao } from "./icones";

const ESTILO: Record<string, { bg: string; cor: string; Icone: typeof IconeLaudo }> = {
  "Laudo aprovado": { bg: "#E3EAFB", cor: "#2A55C0", Icone: IconeLaudo },
  "Único dono": { bg: "#EFE7FB", cor: "#6B3FB8", Icone: IconeDono },
  "Garantia de fábrica": { bg: "#E2E7F2", cor: "#00266E", Icone: IconeGarantia },
  "Revisado na concessionária": { bg: "#DDF4F2", cor: "#0F766E", Icone: IconeRevisao },
  "Baixa quilometragem": { bg: "#FFF2D1", cor: "#9A5B00", Icone: IconeKm },
};

export function corDoSelo(label: string) {
  return ESTILO[label] ?? ESTILO["Laudo aprovado"];
}

export default function Selo({ label, pequeno }: { label: string; pequeno?: boolean }) {
  const { bg, cor, Icone } = corDoSelo(label);
  return (
    <span
      className={`inline-flex items-center gap-[5px] rounded-md font-medium whitespace-nowrap ${
        pequeno ? "px-2 py-1 text-[12px]" : "py-[5px] pr-2.5 pl-2 text-[13px]"
      }`}
      style={{ background: bg, color: cor }}
    >
      <Icone size={pequeno ? 14 : 16} />
      {label}
    </span>
  );
}

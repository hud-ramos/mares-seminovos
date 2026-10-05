"use client";

import { ATALHOS, type ChaveAtalho } from "@/lib/carros";
import { IconeDono, IconeGarantia, IconeKm, IconeLaudo, IconeRevisao } from "../icones";

const ICONE: Record<ChaveAtalho, { I: typeof IconeLaudo; cor: string }> = {
  laudoAprovado: { I: IconeLaudo, cor: "#2A55C0" },
  unicoDono: { I: IconeDono, cor: "#6B3FB8" },
  garantiaFabrica: { I: IconeGarantia, cor: "#00266E" },
  revisoesConcessionaria: { I: IconeRevisao, cor: "#0F766E" },
  baixaKm: { I: IconeKm, cor: "#9A5B00" },
};

export default function Atalhos({
  ativos,
  contagens,
  alternar,
}: {
  ativos: ChaveAtalho[];
  contagens: Record<ChaveAtalho, number>;
  alternar: (c: ChaveAtalho) => void;
}) {
  return (
    <ul className="flex w-max items-center gap-2" aria-label="Atalhos por diferencial">
      {ATALHOS.map(({ chave, label }) => {
        const ativo = ativos.includes(chave);
        const { I, cor } = ICONE[chave];
        return (
          <li key={chave}>
            <button
              type="button"
              aria-pressed={ativo}
              onClick={() => alternar(chave)}
              className={`flex items-center gap-1.5 rounded-full border py-2.5 pr-4 pl-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                ativo
                  ? "border-amarelo bg-amarelo hover:border-amarelo-hover hover:bg-amarelo-hover"
                  : "border-linha bg-branco hover:border-tinta hover:bg-creme"
              }`}
            >
              <span style={{ color: ativo ? "#0E1430" : cor }}>
                <I />
              </span>
              {label}
              <span className={ativo ? "text-tinta/70" : "text-cinza"}>{contagens[chave]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

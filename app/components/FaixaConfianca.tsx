"use client";

import { useEffect, useState } from "react";
import { IconeGarantia, IconeLaudo, IconeTroca } from "./icones";
import PainelLaudo from "./PainelLaudo";

export default function FaixaConfianca() {
  const [aberto, setAberto] = useState(false);
  // "#como-avaliamos" (link do rodapé) abre o painel direto.
  useEffect(() => {
    const ver = () => window.location.hash === "#como-avaliamos" && setAberto(true);
    ver();
    window.addEventListener("hashchange", ver);
    return () => window.removeEventListener("hashchange", ver);
  }, []);
  return (
    <div className="sem-barra overflow-x-auto bg-nevoa">
      <ul className="margem flex w-max min-w-full items-center gap-7 py-3.5 text-sm font-medium whitespace-nowrap text-profundo md:justify-center">
        <li className="flex items-center gap-2">
          <IconeLaudo />
          <button onClick={() => setAberto(true)} className="underline underline-offset-2 hover:text-azul">
            Laudo cautelar independente
          </button>
        </li>
        <li aria-hidden className="size-1 rounded-full bg-claro" />
        <li className="flex items-center gap-2">
          <IconeGarantia />
          Garantia Marés de 3 meses
        </li>
        <li aria-hidden className="size-1 rounded-full bg-claro" />
        <li className="flex items-center gap-2">
          <IconeTroca />
          Supervalorização do seu usado na troca
        </li>
      </ul>
      <PainelLaudo aberto={aberto} aoFechar={() => setAberto(false)} />
    </div>
  );
}

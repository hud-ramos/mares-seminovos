"use client";

import Link from "next/link";
import Gaveta from "./Gaveta";
import { IconeCarro, IconeDocumento, IconeLaudo, IconeRelogio, IconeRevisao } from "./icones";
import { classeBotao } from "./Botao";
import { TOTAL_COM_LAUDO as totalComLaudo } from "@/lib/contagens";

const ITENS = [
  { Icone: IconeRevisao, titulo: "Estrutura", texto: "Longarinas, colunas e assoalho sem reparos ou solda." },
  { Icone: IconeCarro, titulo: "Identificação", texto: "Chassi, motor e vidros com a numeração original." },
  { Icone: IconeRelogio, titulo: "Histórico", texto: "Sem registro de leilão, sinistro, roubo ou furto." },
  { Icone: IconeDocumento, titulo: "Documentação", texto: "Sem débitos, multas ou restrições no Detran." },
];

export default function PainelLaudo({ aberto, aoFechar }: { aberto: boolean; aoFechar: () => void }) {
  return (
    <Gaveta
      aberta={aberto}
      aoFechar={aoFechar}
      modo="lateral"
      titulo={
        <span className="flex items-center gap-2 text-sm font-medium text-[#2A55C0]">
          <IconeLaudo /> Laudo aprovado
        </span>
      }
      rodape={
        <Link href="/?atalho=laudoAprovado" onClick={aoFechar} className={classeBotao("primario", "w-full")}>
          Ver carros com laudo aprovado ({totalComLaudo})
        </Link>
      }
    >
      <h2 className="titulo-display text-[34px] md:text-[44px]">O que avaliamos em cada carro</h2>
      <p className="mt-4 text-[17px] leading-relaxed text-cinza">
        Antes de anunciar, todo carro passa por uma vistoria cautelar feita por empresa credenciada, independente da Marés. Só quem
        passa recebe o selo.
      </p>
      <ul className="mt-5">
        {ITENS.map(({ Icone, titulo, texto }) => (
          <li key={titulo} className="flex gap-4 border-b border-linha py-4 last:border-0">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-nevoa text-profundo">
              <Icone />
            </span>
            <span>
              <strong className="block font-medium">{titulo}</strong>
              <span className="text-[15px] text-cinza">{texto}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 rounded-xl bg-nevoa p-4">
        <strong className="block font-medium">E se o carro não passar?</strong>
        <span className="text-[15px] text-cinza">
          Ele não vai para a vitrine com o selo. O laudo completo de cada carro fica em PDF na página dele.
        </span>
      </div>
    </Gaveta>
  );
}

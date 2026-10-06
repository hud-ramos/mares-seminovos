import type { Metadata } from "next";
import { Suspense } from "react";
import Cabecalho from "../components/Cabecalho";
import Rodape from "../components/Rodape";
import SimulacaoWhatsApp from "../components/whatsapp/SimulacaoWhatsApp";
import { porId, foto, nome, url, formatarPreco, formatarKm, parcelaPadrao, entradaMinima } from "@/lib/carros";

export const metadata: Metadata = {
  title: "Conversa no WhatsApp (simulação)",
  robots: { index: false, follow: true },
};

export default async function PaginaWhatsApp({ searchParams }: PageProps<"/whatsapp">) {
  const p = await searchParams;
  const um = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const c = porId(um(p.carro) ?? "") ?? null;
  const carro = c && {
    id: c.id,
    nome: nome(c),
    ano: c.ano,
    km: formatarKm(c.km),
    preco: formatarPreco(c.preco),
    precoNum: c.preco,
    foto: foto(c),
    url: url(c),
    loja: c.loja,
    laudo: c.diferenciais.laudoAprovado,
    revisoes: c.diferenciais.revisoesConcessionaria,
    marca: c.marca,
    modelo: c.modelo,
    entradaMin: entradaMinima(c),
    parcelaPadrao: parcelaPadrao(c),
    taxa: c.simulacao.taxaMensal,
  };
  return (
    <>
      <Cabecalho />
      <Suspense>
        <SimulacaoWhatsApp
          tipo={um(p.tipo) === "lead" ? "lead" : um(p.tipo) === "troca" ? "troca" : "conversa"}
          assunto={um(p.assunto) ?? "carro"}
          texto={um(p.texto) ?? ""}
          carro={carro}
        />
      </Suspense>
      <Rodape />
    </>
  );
}

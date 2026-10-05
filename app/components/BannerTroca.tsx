"use client";

import Image from "next/image";
import { useState } from "react";
import { Ondas } from "./Marca";
import { IconeCarro, IconeSetaCima } from "./icones";
import AvaliarTroca from "./AvaliarTroca";

export function SeloSupervalorizacao() {
  return (
    <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-amarelo px-3 py-1.5 text-[13px] font-bold tracking-wide text-tinta uppercase">
      <IconeSetaCima size={14} />
      Supervalorização do seu usado
    </span>
  );
}

export default function BannerTroca() {
  const [carro, setCarro] = useState("");
  const [aberto, setAberto] = useState(false);
  const [abertura, setAbertura] = useState(0);
  return (
    <section
      id="troca"
      aria-labelledby="troca-titulo"
      className="relative col-span-full overflow-hidden rounded-2xl bg-azul text-creme"
    >
      <Ondas className="absolute top-4 right-[30%] hidden w-[560px] opacity-[0.07] md:block" />
      <div className="relative grid md:grid-cols-[1fr_minmax(0,40%)]">
        <div className="flex flex-col gap-4 p-6 md:p-12">
          <SeloSupervalorizacao />
          <h2
            id="troca-titulo"
            className="titulo-display text-[34px] md:text-[46px]"
          >
            Seu carro atual paga parte do próximo
          </h2>
          <p className="max-w-[620px] text-base md:text-[17px]">
            Na troca, seu usado vale até R$ 3 mil acima da FIPE.* Proposta em
            até 1 dia útil.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAbertura((n) => n + 1);
              setAberto(true);
            }}
            className="mt-1 flex flex-col gap-2.5 md:flex-row"
          >
            <label className="flex h-[52px] flex-1 items-center gap-2.5 rounded-full bg-branco px-5 text-tinta md:max-w-[340px]">
              <IconeCarro className="text-cinza" />
              <span className="sr-only">Seu carro</span>
              <input
                value={carro}
                onChange={(e) => setCarro(e.target.value)}
                placeholder="Ex.: Fiat Argo 2020"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-cinza"
              />
            </label>
            <button className="h-[52px] rounded-full bg-amarelo px-7 font-bold text-tinta transition-colors hover:bg-amarelo-hover">
              Avaliar meu carro
            </button>
          </form>
          <p className="text-xs text-creme/75">
            *Conforme avaliação, na compra de um seminovo Marés.
          </p>
        </div>
        <div className="relative hidden min-h-[320px] md:block">
          <Image
            src="/fotos/chave-mares.jpg"
            alt="Chave de carro com chaveiro de couro gravado com a logo da Marés"
            fill
            sizes="40vw"
            quality={70}
            className="object-cover"
          />
        </div>
      </div>
      <AvaliarTroca
        key={abertura}
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        inicial={carro}
      />
    </section>
  );
}

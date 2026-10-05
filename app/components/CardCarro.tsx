"use client";

import Image from "next/image";
import Link from "next/link";
import { type Carro, foto, formatarPreco, nome, parcelaPadrao, resumo, url } from "@/lib/carros";
import { useFavoritos } from "@/lib/favoritos";
import Selo from "./Selo";
import { IconeCarro, IconeCoracao, IconeSetaBaixo } from "./icones";

export function SemFoto({ compacto }: { compacto?: boolean }) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-2 bg-areia text-cinza">
      <IconeCarro size={compacto ? 24 : 36} />
      {!compacto && <span className="text-sm">Fotos em produção</span>}
    </div>
  );
}

export function Favoritar({ id, className = "" }: { id: string; className?: string }) {
  const { tem, alternar } = useFavoritos();
  const ativo = tem(id);
  return (
    <button
      type="button"
      aria-pressed={ativo}
      aria-label={ativo ? "Remover dos favoritos" : "Salvar nos favoritos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alternar(id);
      }}
      className={`grid size-10 place-items-center rounded-full bg-branco text-tinta shadow-sm transition-colors hover:bg-nevoa ${
        ativo ? "text-[#D6336C]" : ""
      } ${className}`}
    >
      <IconeCoracao size={20} cheio={ativo} />
    </button>
  );
}

export default function CardCarro({ carro, prioridade }: { carro: Carro; prioridade?: boolean }) {
  const f = foto(carro);
  return (
    <Link href={url(carro)} className="group flex flex-col" aria-label={`${nome(carro)}, ${formatarPreco(carro.preco)}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-areia">
        {f ? (
          <Image
            src={f}
            alt={nome(carro)}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            quality={70}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading={prioridade ? "eager" : "lazy"}
            fetchPriority={prioridade ? "high" : "auto"}
          />
        ) : (
          <SemFoto />
        )}
        <span aria-hidden className="absolute inset-0 bg-azul opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
        <Favoritar id={carro.id} className="absolute top-4 right-4" />
      </div>
      <div className="flex flex-col gap-1 pt-4">
        <div className="mb-1.5 flex min-h-[27px] flex-wrap gap-2">
          {carro.selos.map((sl) => (
            <Selo key={sl.label} label={sl.label} />
          ))}
        </div>
        <h3 className="text-lg font-medium leading-snug decoration-2 underline-offset-4 group-hover:underline">{nome(carro)}</h3>
        <p className="text-base text-cinza">{resumo(carro)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-[22px] font-bold">{formatarPreco(carro.preco)}</span>
          {carro.abaixoFipe && (
            <span className="inline-flex items-center gap-1 rounded-md bg-verde py-1 pr-2.5 pl-2 text-[13px] font-bold text-white">
              <IconeSetaBaixo size={14} />
              Abaixo da FIPE
            </span>
          )}
        </div>
        <p className="text-sm text-cinza">
          ou 48x de {formatarPreco(parcelaPadrao(carro))}
        </p>
      </div>
    </Link>
  );
}

export function CardCarregando() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col">
      <div className="aspect-[4/3] w-full bg-areia" />
      <div className="flex flex-col gap-2.5 pt-4">
        <div className="flex gap-2">
          <div className="h-6 w-28 rounded-md bg-linha" />
          <div className="h-6 w-24 rounded-md bg-linha" />
        </div>
        <div className="h-5 w-3/4 rounded-md bg-linha" />
        <div className="h-4 w-1/2 rounded-md bg-linha" />
        <div className="h-6 w-2/5 rounded-md bg-linha" />
      </div>
    </div>
  );
}

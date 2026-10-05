"use client";

import { useState } from "react";
import type { Carro } from "@/lib/carros";
import Link from "next/link";
import { linkConversa } from "@/lib/links";
import { Favoritar } from "../CardCarro";
import { IconeCompartilhar, IconeWhatsApp } from "../icones";
import { classeBotao } from "../Botao";

export function Compartilhar({ titulo, url }: { titulo: string; url: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      aria-label={copiado ? "Link copiado" : "Compartilhar"}
      onClick={async () => {
        const link = `${window.location.origin}${url}`;
        if (navigator.share) {
          try {
            await navigator.share({ title: titulo, url: link });
          } catch {}
        } else {
          await navigator.clipboard.writeText(link);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        }
      }}
      className="relative grid size-10 place-items-center rounded-full border border-linha bg-branco transition-colors hover:bg-nevoa"
    >
      <IconeCompartilhar />
      {copiado && <span className="absolute top-12 right-0 rounded-md bg-tinta px-2 py-1 text-xs whitespace-nowrap text-white">Link copiado</span>}
    </button>
  );
}

export function FavoritoBorda({ id }: { id: string }) {
  return <Favoritar id={id} className="border border-linha shadow-none" />;
}

export function BotoesCompra({ carro }: { carro: Carro }) {
  return (
    <div className="flex flex-col gap-3">
      <a href="#simular" className={classeBotao("primario", "w-full")}>
        Simular parcelas
      </a>
      <Link href={linkConversa({ carro: carro.id })} className={classeBotao("contorno", "w-full")}>
        <IconeWhatsApp /> Conversar no WhatsApp
      </Link>
      <p className="text-center text-sm text-cinza">
        Supervalorizamos seu usado na troca ·{" "}
        <a href="#simular-troca" className="font-medium text-azul underline">
          Avaliar meu carro
        </a>
      </p>
    </div>
  );
}

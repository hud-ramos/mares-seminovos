"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Carro, foto, formatarPreco, nome, parcelaPadrao, resumo } from "@/lib/carros";
import Link from "next/link";
import { linkConversa } from "@/lib/links";
import { IconeWhatsApp } from "../icones";
import { classeBotao } from "../Botao";

/**
 * Desktop: aparece presa no topo depois que a pessoa passa da galeria.
 * Celular: fica sempre presa no rodapé da tela.
 */
export default function BarraFixa({ carro, alvo }: { carro: Carro; alvo: string }) {
  const [visivel, setVisivel] = useState(false);
  const f = foto(carro);
  const whats = linkConversa({ carro: carro.id });

  useEffect(() => {
    const el = document.getElementById(alvo);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [alvo]);

  return (
    <>
      <AnimatePresence>
        {visivel && (
          <motion.div
            initial={{ y: -90 }}
            animate={{ y: 0 }}
            exit={{ y: -90 }}
            transition={{ duration: 0.25 }}
            className="margem fixed inset-x-0 top-0 z-40 hidden items-center gap-6 border-b border-linha bg-white py-3 shadow-[0_8px_24px_rgba(14,20,48,0.08)] lg:flex"
          >
            <div className="relative h-12 w-[72px] shrink-0 overflow-hidden rounded-md bg-areia">
              {f && <Image src={f} alt="" fill sizes="72px" quality={70} className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-bold">{nome(carro)}</p>
              <p className="text-[13px] text-cinza">{resumo(carro)}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{formatarPreco(carro.preco)}</p>
              <p className="text-[13px] text-cinza">
                a partir de 48x de {formatarPreco(parcelaPadrao(carro))}
              </p>
            </div>
            <Link href={whats} className={classeBotao("contorno", "py-3.5")}>
              <IconeWhatsApp /> WhatsApp
            </Link>
            <a href="#simular" className={classeBotao("primario", "py-3.5")}>
              Simular parcelas
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 border-t border-linha bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(14,20,48,0.1)] lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xl leading-tight font-bold">{formatarPreco(carro.preco)}</p>
          <p className="text-[13px] text-cinza">
            48x de {formatarPreco(parcelaPadrao(carro))}
          </p>
        </div>
        <Link href={whats} aria-label="Conversar no WhatsApp" className="grid size-[52px] place-items-center rounded-full border-[1.5px] border-tinta">
          <IconeWhatsApp />
        </Link>
        <a href="#simular" className={classeBotao("primario", "px-6 py-3.5")}>
          Simular
        </a>
      </div>
    </>
  );
}

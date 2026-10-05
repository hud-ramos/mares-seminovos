"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconeSeta } from "../icones";
import { SemFoto } from "../CardCarro";

type Foto = { src: string; alt: string };

export default function Galeria({ fotos, totalAnunciado }: { fotos: Foto[]; totalAnunciado?: number }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const n = fotos.length;
  const ir = (novo: number) => {
    setDir(novo > i || (i === n - 1 && novo === 0) ? 1 : -1);
    setI((novo + n) % n);
  };

  if (!n) {
    return (
      <div className="aspect-[4/3] w-full">
        <SemFoto />
      </div>
    );
  }

  const miniaturas = fotos.slice(1, 5);
  const total = totalAnunciado ?? n;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-areia lg:aspect-[860/580]" aria-roledescription="carrossel" aria-label="Fotos do carro">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={i}
            className="absolute inset-0"
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={n > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) ir(i + 1);
              else if (info.offset.x > 60) ir(i - 1);
            }}
          >
            <Image
              src={fotos[i].src}
              alt={fotos[i].alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              quality={80}
              className="pointer-events-none object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {n > 1 && (
          <>
            <button aria-label="Foto anterior" onClick={() => ir(i - 1)} className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-branco shadow-md transition-colors hover:bg-nevoa md:left-5 md:size-12">
              <IconeSeta />
            </button>
            <button aria-label="Próxima foto" onClick={() => ir(i + 1)} className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 rotate-180 place-items-center rounded-full bg-branco shadow-md transition-colors hover:bg-nevoa md:right-5 md:size-12">
              <IconeSeta />
            </button>
          </>
        )}
        <span aria-live="polite" className="absolute bottom-4 left-4 rounded-full bg-branco px-3.5 py-2 text-sm font-medium md:bottom-6 md:left-6">
          {i + 1} / {total} {total === 1 ? "foto" : "fotos"}
        </span>
      </div>

      {miniaturas.length > 0 && (
        <ul className="hidden grid-cols-4 gap-3 lg:grid">
          {miniaturas.map((f, k) => {
            const idx = k + 1;
            const ultima = k === miniaturas.length - 1 && total > 5;
            return (
              <li key={f.src}>
                <button
                  onClick={() => ir(idx)}
                  aria-label={`Ver foto ${idx + 1}`}
                  aria-current={i === idx}
                  className={`relative block aspect-[206/128] w-full overflow-hidden ${i === idx ? "ring-3 ring-azul ring-inset" : ""}`}
                >
                  <Image src={f.src} alt="" fill sizes="15vw" quality={70} className="object-cover" />
                  {ultima && (
                    <span className="absolute inset-0 grid place-items-center bg-tinta/55 text-lg font-bold text-white">+{total - 4} fotos</span>
                  )}
                  {i === idx && <span className="absolute inset-0 ring-3 ring-azul ring-inset" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

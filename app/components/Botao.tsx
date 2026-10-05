import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const TIPOS = {
  primario: "bg-amarelo text-tinta hover:bg-amarelo-hover",
  secundario: "bg-profundo text-branco hover:bg-azul",
  contorno: "border-[1.5px] border-tinta text-tinta hover:border-azul hover:bg-azul hover:text-white",
};

type Base = { tipo?: keyof typeof TIPOS; children: ReactNode; className?: string; icone?: ReactNode };

export function classeBotao(tipo: keyof typeof TIPOS = "primario", className = "") {
  return `inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold leading-[21px] transition-colors ${TIPOS[tipo]} ${className}`;
}

export function Botao({ tipo, children, className, icone, ...p }: Base & ComponentProps<"button">) {
  return (
    <button className={classeBotao(tipo, className)} {...p}>
      {icone}
      {children}
    </button>
  );
}

export function BotaoLink({ tipo, children, className, icone, href, ...p }: Base & ComponentProps<"a">) {
  const externo = href?.startsWith("http");
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classeBotao(tipo, className)} {...p}>
        {icone}
        {children}
      </a>
    );
  }
  return (
    <Link href={href ?? "/"} className={classeBotao(tipo, className)}>
      {icone}
      {children}
    </Link>
  );
}

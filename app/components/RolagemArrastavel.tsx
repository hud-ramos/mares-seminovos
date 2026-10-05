"use client";

import { useEffect } from "react";

/**
 * Faixas com rolagem lateral (.sem-barra) também rolam arrastando com o mouse.
 * No toque o navegador já rola sozinho; isto cobre desktop e simuladores de celular.
 */
export default function RolagemArrastavel() {
  useEffect(() => {
    let alvo: HTMLElement | null = null;
    let inicioX = 0;
    let inicioScroll = 0;
    let arrastou = false;

    const baixar = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>(".sem-barra");
      if (!el || el.scrollWidth <= el.clientWidth) return;
      alvo = el;
      inicioX = e.clientX;
      inicioScroll = el.scrollLeft;
      arrastou = false;
    };
    const mover = (e: PointerEvent) => {
      if (!alvo) return;
      const dx = e.clientX - inicioX;
      if (Math.abs(dx) > 4) arrastou = true;
      if (arrastou) {
        alvo.scrollLeft = inicioScroll - dx;
        e.preventDefault();
      }
    };
    const soltar = () => {
      alvo = null;
    };
    // Depois de arrastar, o clique que vem no fim não deve ativar o filtro.
    const clicar = (e: MouseEvent) => {
      if (arrastou) {
        e.stopPropagation();
        e.preventDefault();
        arrastou = false;
      }
    };

    document.addEventListener("pointerdown", baixar);
    document.addEventListener("pointermove", mover);
    document.addEventListener("pointerup", soltar);
    document.addEventListener("click", clicar, true);
    return () => {
      document.removeEventListener("pointerdown", baixar);
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerup", soltar);
      document.removeEventListener("click", clicar, true);
    };
  }, []);
  return null;
}

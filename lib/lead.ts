"use client";

/** Dados da simulação levados para a tela do WhatsApp. Ficam só nesta aba (sessionStorage), nunca na URL. */
export type Lead = {
  nome: string;
  entrada: number;
  prazo: number;
  parcela: number;
  troca: string | null;
  cpf: boolean;
};

const CHAVE = "mares:lead";

export function guardarLead(l: Lead) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(l));
  } catch {}
}

export function lerLead(): Lead | null {
  try {
    const v = sessionStorage.getItem(CHAVE);
    return v ? (JSON.parse(v) as Lead) : null;
  } catch {
    return null;
  }
}

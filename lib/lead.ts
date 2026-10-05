"use client";

/** Dados da simulação levados para a tela do WhatsApp. Ficam só nesta aba (sessionStorage), nunca na URL. */
export type Lead = {
  nome: string;
  entrada: number;
  prazo: number;
  parcela: number;
  troca: string | null;
  cpf: boolean;
  /** true quando a pessoa não preencheu nome e WhatsApp: a tela mostra um exemplo. */
  exemplo?: boolean;
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

/** Pedido de avaliação do usado, vindo do banner de troca da listagem. */
export type PedidoTroca = {
  nome: string;
  modelo: string;
  ano: number;
  km: string;
  exemplo?: boolean;
};

const CHAVE_TROCA = "mares:troca";

export function guardarTroca(t: PedidoTroca) {
  try {
    sessionStorage.setItem(CHAVE_TROCA, JSON.stringify(t));
  } catch {}
}

export function lerTroca(): PedidoTroca | null {
  try {
    const v = sessionStorage.getItem(CHAVE_TROCA);
    return v ? (JSON.parse(v) as PedidoTroca) : null;
  } catch {
    return null;
  }
}

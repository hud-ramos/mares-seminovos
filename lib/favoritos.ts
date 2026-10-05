"use client";

import { useSyncExternalStore } from "react";

const CHAVE = "mares:favoritos";
const ouvintes = new Set<() => void>();
const VAZIO: string[] = [];
let cache: string[] | null = null;

function ler(): string[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
  } catch {
    cache = [];
  }
  return cache!;
}

function gravar(lista: string[]) {
  cache = lista;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {}
  ouvintes.forEach((o) => o());
}

function assinar(o: () => void) {
  ouvintes.add(o);
  return () => ouvintes.delete(o);
}

export function useFavoritos() {
  const lista = useSyncExternalStore(assinar, ler, () => VAZIO);
  const alternar = (id: string) =>
    gravar(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);
  return { lista, alternar, tem: (id: string) => lista.includes(id) };
}

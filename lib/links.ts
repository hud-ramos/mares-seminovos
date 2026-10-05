// Links para a tela de simulação do WhatsApp (o número da Marés é fictício).
export type Assunto = "carro" | "troca" | "aviso" | "laudo" | "geral";

export function linkConversa(opcoes: { carro?: string; assunto?: Assunto; texto?: string } = {}) {
  const u = new URLSearchParams({ tipo: "conversa" });
  if (opcoes.carro) u.set("carro", opcoes.carro.toLowerCase());
  if (opcoes.assunto) u.set("assunto", opcoes.assunto);
  if (opcoes.texto) u.set("texto", opcoes.texto.slice(0, 80));
  return `/whatsapp?${u}`;
}

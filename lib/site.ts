export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mares-seminovos.vercel.app",
  whatsapp: "5513999992026",
  telefone: "(13) 4000-2026",
  whatsappExibicao: "(13) 99999-2026",
};

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

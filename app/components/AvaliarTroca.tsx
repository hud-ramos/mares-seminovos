"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Gaveta from "./Gaveta";
import { classeBotao } from "./Botao";
import { IconeSetaCima, IconeWhatsApp } from "./icones";
import { guardarTroca } from "@/lib/lead";
import { ANOS, mascaraKm, mascaraZap, somenteDigitos } from "@/lib/mascaras";

/** "Fiat Argo 2020" vira modelo "Fiat Argo" e ano 2020, quando o ano está na lista. */
function separarAno(texto: string) {
  const achado = texto.match(/\b(19|20)\d{2}\b/);
  const ano = achado ? Number(achado[0]) : NaN;
  if (!ANOS.includes(ano)) return { modelo: texto.trim(), ano: null };
  return {
    modelo: texto.replace(achado![0], "").replace(/\s+/g, " ").trim(),
    ano,
  };
}

export default function AvaliarTroca({
  aberto,
  aoFechar,
  inicial,
}: {
  aberto: boolean;
  aoFechar: () => void;
  inicial: string;
}) {
  // O que a pessoa digitou no banner já entra preenchido. O banner remonta o modal a cada abertura (key).
  const [inicio] = useState(() => separarAno(inicial));
  const [modelo, setModelo] = useState(inicio.modelo);
  const [ano, setAno] = useState(inicio.ano ?? 2020);
  const [km, setKm] = useState("");
  const [nomeCliente, setNome] = useState("");
  const [zap, setZap] = useState("");
  const [erro, setErro] = useState(false);
  const router = useRouter();

  const enviar = () => {
    const vazio = !nomeCliente.trim() && !somenteDigitos(zap);
    if (!vazio && (!nomeCliente.trim() || somenteDigitos(zap).length < 10)) {
      setErro(true);
      return;
    }
    // Sem nome e WhatsApp, a tela mostra um exemplo com o carro desta pessoa (útil na apresentação).
    guardarTroca({
      nome: nomeCliente.trim() || "Ana Souza",
      modelo: modelo.trim() || (vazio ? "Fiat Argo" : "modelo a informar"),
      ano,
      km: km || (vazio ? "58.000" : ""),
      exemplo: vazio,
    });
    aoFechar();
    router.push("/whatsapp?tipo=troca");
  };

  const campo =
    "h-[52px] w-full rounded-xl bg-creme px-4 outline-none placeholder:text-cinza focus:ring-2 focus:ring-azul";

  return (
    <Gaveta
      aberta={aberto}
      aoFechar={aoFechar}
      titulo={<span className="font-bold">Quanto vale seu carro?</span>}
      rodape={
        <div className="flex flex-col gap-3">
          {erro && (
            <p role="alert" className="text-sm font-medium text-[#B42318]">
              Preencha seu nome e um WhatsApp com DDD.
            </p>
          )}
          <button
            onClick={enviar}
            className={classeBotao("primario", "w-full")}
          >
            <IconeWhatsApp /> Receber avaliação no WhatsApp
          </button>
          <p className="text-[13px] text-cinza">
            Avaliação sem compromisso. Usamos seus dados só para esta proposta.
          </p>
        </div>
      }
    >
      <p className="text-cinza">
        Complete os dados e um avaliador responde no WhatsApp com o valor para
        usar na troca.
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amarelo px-3 py-1.5 text-[13px] font-bold text-tinta">
        <IconeSetaCima size={14} /> Supervalorizamos seu usado na troca
      </span>

      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-cinza">Marca e modelo</span>
          <input
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="Ex.: Fiat Argo"
            className={campo}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-cinza">Ano</span>
            <select
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className={campo}
            >
              {ANOS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-cinza">Km rodados</span>
            <input
              value={km}
              onChange={(e) => setKm(mascaraKm(e.target.value))}
              inputMode="numeric"
              placeholder="58.000"
              className={campo}
            />
          </label>
        </div>

        <p className="mt-1 border-t border-linha pt-4 font-bold">
          Para onde enviamos a avaliação?
        </p>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-cinza">Nome</span>
          <input
            value={nomeCliente}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            className={campo}
            aria-invalid={erro && !nomeCliente.trim()}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-cinza">WhatsApp</span>
          <input
            value={zap}
            onChange={(e) => setZap(mascaraZap(e.target.value))}
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(13) 99999-0000"
            className={campo}
            aria-invalid={erro && somenteDigitos(zap).length < 10}
          />
        </label>
        <button type="submit" className="sr-only">
          Enviar
        </button>
      </form>
    </Gaveta>
  );
}

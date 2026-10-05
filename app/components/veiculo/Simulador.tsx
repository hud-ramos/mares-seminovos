"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Carro, entradaMinima, formatarPreco, nome, parcela } from "@/lib/carros";
import { linkWhatsApp, SITE } from "@/lib/site";
import { IconeCheck, IconeInfo, IconeSeta, IconeWhatsApp } from "../icones";
import { SeloSupervalorizacao } from "../BannerTroca";
import Gaveta from "../Gaveta";
import { classeBotao } from "../Botao";

const PRAZOS = [12, 24, 36, 48, 60];
const ANOS = Array.from({ length: 15 }, (_, k) => 2026 - k);

const somenteDigitos = (s: string) => s.replace(/\D/g, "");
const formatarMilhar = (n: number) => n.toLocaleString("pt-BR");

export default function Simulador({ carro, url }: { carro: Carro; url: string }) {
  const minimo = entradaMinima(carro);
  const [entrada, setEntrada] = useState(minimo);
  const [prazo, setPrazo] = useState(48);
  const [troca, setTroca] = useState(false);
  const [trocaModelo, setTrocaModelo] = useState("");
  const [trocaAno, setTrocaAno] = useState(2020);
  const [trocaKm, setTrocaKm] = useState("");
  const [dica, setDica] = useState(false);
  const [contato, setContato] = useState(false);
  const ids = useId();

  // Links como "#simular-troca" chegam com a troca marcada.
  useEffect(() => {
    const ver = () => window.location.hash === "#simular-troca" && setTroca(true);
    ver();
    window.addEventListener("hashchange", ver);
    return () => window.removeEventListener("hashchange", ver);
  }, []);

  const taxa = carro.simulacao.taxaMensal;
  const financiado = Math.max(carro.preco - entrada, 0);
  const valorParcela = parcela(financiado, prazo, taxa);

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-branco p-5 text-tinta shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-7">
      <h3 className="text-[22px] font-bold">Simule sua parcela</h3>

      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <label htmlFor={`${ids}-entrada`} className="text-sm text-cinza">
            Entrada
          </label>
          <button
            type="button"
            aria-label="Por que existe entrada mínima?"
            onMouseEnter={() => setDica(true)}
            onMouseLeave={() => setDica(false)}
            onFocus={() => setDica(true)}
            onBlur={() => setDica(false)}
            className="text-cinza hover:text-tinta"
          >
            <IconeInfo />
          </button>
          <AnimatePresence>
            {dica && (
              <motion.div
                role="tooltip"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-7 left-8 z-10 w-[280px] rounded-lg bg-tinta p-3 text-[13px] leading-snug text-white shadow-lg"
              >
                A entrada mínima é de 20% do valor do carro ({formatarPreco(minimo)}). É o que os bancos parceiros exigem para aprovar o crédito.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex h-[49px] items-center gap-2.5 rounded-xl bg-creme px-4">
          <span className="text-cinza">R$</span>
          <input
            id={`${ids}-entrada`}
            inputMode="numeric"
            value={formatarMilhar(entrada)}
            onChange={(e) => setEntrada(Math.min(Number(somenteDigitos(e.target.value)) || 0, carro.preco))}
            onBlur={() => setEntrada((v) => Math.max(v, minimo))}
            className="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none"
          />
        </div>
        <input
          type="range"
          aria-label="Ajustar entrada"
          className="faixa mt-2 w-full"
          min={minimo}
          max={carro.preco}
          step={100}
          value={Math.max(entrada, minimo)}
          onChange={(e) => setEntrada(Number(e.target.value))}
          style={{ background: `linear-gradient(to right, var(--color-azul) ${((Math.max(entrada, minimo) - minimo) / (carro.preco - minimo)) * 100}%, var(--color-areia) 0)` }}
        />
        <div className="flex justify-between text-xs text-cinza">
          <span>Mínimo {formatarPreco(minimo)}</span>
          <span>{formatarPreco(carro.preco)}</span>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm text-cinza">Prazo</legend>
        <div className="grid grid-cols-5 gap-1.5">
          {PRAZOS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={prazo === p}
              onClick={() => setPrazo(p)}
              className={`h-10 rounded-lg text-[15px] font-medium transition-colors ${prazo === p ? "bg-profundo text-white" : "bg-creme hover:bg-areia"}`}
            >
              {p}x
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2.5">
        <label className="flex cursor-pointer items-center gap-3 text-base">
          <input type="checkbox" className="peer sr-only" checked={troca} onChange={(e) => setTroca(e.target.checked)} />
          <span className={`grid size-[22px] place-items-center rounded-md border-[1.5px] peer-focus-visible:outline-2 peer-focus-visible:outline-azul ${troca ? "border-azul bg-azul text-white" : "border-tinta"}`}>
            {troca && <IconeCheck size={14} />}
          </span>
          Tenho um carro para dar na troca
        </label>
        <div className="pl-[34px]">
          <SeloSupervalorizacao />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {troca && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-col gap-3 rounded-[14px] bg-nevoa p-4">
              <p className="font-bold">Seu carro</p>
              <input
                value={trocaModelo}
                onChange={(e) => setTrocaModelo(e.target.value)}
                placeholder="Marca e modelo. Ex.: Fiat Argo"
                aria-label="Marca e modelo do seu carro"
                className="h-[46px] rounded-xl bg-white px-4 outline-none placeholder:text-cinza focus:ring-2 focus:ring-azul"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex h-[46px] items-center gap-2 rounded-xl bg-white px-4">
                  <span className="text-sm text-cinza">Ano</span>
                  <select value={trocaAno} onChange={(e) => setTrocaAno(Number(e.target.value))} className="min-w-0 flex-1 bg-transparent outline-none">
                    {ANOS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </label>
                <label className="flex h-[46px] items-center gap-2 rounded-xl bg-white px-4">
                  <input
                    inputMode="numeric"
                    value={trocaKm}
                    onChange={(e) => setTrocaKm(somenteDigitos(e.target.value) ? formatarMilhar(Number(somenteDigitos(e.target.value))) : "")}
                    placeholder="58.000"
                    aria-label="Quilometragem do seu carro"
                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-cinza"
                  />
                  <span className="text-sm text-cinza">km</span>
                </label>
              </div>
              <p className="text-[13px] text-cinza">
                Supervalorização: até R$ 3 mil acima da FIPE, conforme avaliação. Proposta em até 1 dia útil, sem compromisso.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <hr className="border-linha" />
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-cinza">Parcela estimada</p>
          <p className="text-xs text-cinza">Total financiado {formatarPreco(financiado)}</p>
        </div>
        <p className="text-[28px] leading-none font-bold whitespace-nowrap" aria-live="polite">
          {prazo}x {formatarPreco(valorParcela)}
        </p>
      </div>
      <button onClick={() => setContato(true)} className={classeBotao("primario", "w-full")}>
        Simular com meus dados
      </button>
      <p className="text-[13px] text-cinza">
        Estimativa com taxa média de {(taxa * 100).toFixed(2).replace(".", ",")}% a.m. A taxa real depende da análise de crédito.
      </p>

      <Contato
        aberto={contato}
        aoFechar={() => setContato(false)}
        carro={carro}
        url={url}
        entrada={entrada}
        prazo={prazo}
        valorParcela={valorParcela}
        troca={troca ? `${trocaModelo || "carro a informar"} ${trocaAno}${trocaKm ? ` · ${trocaKm} km` : ""}` : null}
      />
    </div>
  );
}

function Contato({
  aberto,
  aoFechar,
  carro,
  url,
  entrada,
  prazo,
  valorParcela,
  troca,
}: {
  aberto: boolean;
  aoFechar: () => void;
  carro: Carro;
  url: string;
  entrada: number;
  prazo: number;
  valorParcela: number;
  troca: string | null;
}) {
  const [nomeCliente, setNome] = useState("");
  const [zap, setZap] = useState("");
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState(false);

  const mascaraZap = (v: string) => {
    const d = somenteDigitos(v).slice(0, 11);
    if (d.length <= 2) return d ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  const mascaraCpf = (v: string) =>
    somenteDigitos(v)
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const enviar = () => {
    if (!nomeCliente.trim() || somenteDigitos(zap).length < 10) {
      setErro(true);
      return;
    }
    // O lead chega com contexto: carro, simulação e troca. O CPF não vai na mensagem; o vendedor pede na conversa.
    const msg = [
      `Olá! Sou ${nomeCliente.trim()} e quero a taxa real para o ${nome(carro)} ${carro.ano} (${formatarPreco(carro.preco)}).`,
      `Anúncio: ${SITE.url}${url}`,
      `Simulação: entrada de ${formatarPreco(entrada)} + ${prazo}x de ${formatarPreco(valorParcela)}.`,
      troca ? `Tenho um carro para a troca: ${troca}.` : "Não tenho carro para a troca.",
      cpf ? "Já tenho o CPF em mãos para a pré-aprovação." : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(linkWhatsApp(msg), "_blank", "noopener,noreferrer");
    aoFechar();
  };

  const campo = "h-[52px] w-full rounded-xl bg-creme px-4 outline-none placeholder:text-cinza focus:ring-2 focus:ring-azul";

  return (
    <Gaveta
      aberta={aberto}
      aoFechar={aoFechar}
      titulo={
        <button onClick={aoFechar} className="flex items-center gap-1 text-base text-azul">
          <IconeSeta size={18} /> Voltar à simulação
        </button>
      }
      rodape={
        <div className="flex flex-col gap-3">
          <button onClick={enviar} className={classeBotao("primario", "w-full")}>
            <IconeWhatsApp /> Receber simulação no WhatsApp
          </button>
          <p className="text-[13px] text-cinza">Usamos seus dados só para esta proposta. Resposta em até 1 dia útil.</p>
        </div>
      }
    >
      <h3 className="text-[26px] font-bold">Falta pouco</h3>
      <p className="mt-2 text-cinza">Para qual WhatsApp enviamos sua simulação com a taxa real?</p>

      <div className="mt-5 rounded-2xl bg-nevoa p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-bold">{nome(carro)}</p>
            <p className="text-sm text-cinza">{formatarPreco(carro.preco)}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-cinza">Parcela estimada</p>
            <p className="text-2xl font-bold">
              {prazo}x {formatarPreco(valorParcela)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-md bg-white px-3 py-1.5">Entrada {formatarPreco(entrada)}</span>
          {troca && <span className="rounded-md bg-white px-3 py-1.5">Troca supervalorizada: {troca}</span>}
        </div>
      </div>

      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-cinza">Nome</span>
          <input value={nomeCliente} onChange={(e) => setNome(e.target.value)} autoComplete="name" className={campo} aria-invalid={erro && !nomeCliente.trim()} />
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
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-cinza">CPF (opcional)</span>
          <input value={cpf} onChange={(e) => setCpf(mascaraCpf(e.target.value))} inputMode="numeric" placeholder="000.000.000-00" className={campo} />
          <span className="text-[13px] text-cinza">Com o CPF, já trazemos a taxa pré-aprovada na proposta.</span>
        </label>
        {erro && (
          <p role="alert" className="text-sm font-medium text-[#B42318]">
            Preencha seu nome e um WhatsApp com DDD.
          </p>
        )}
        <button type="submit" className="sr-only">
          Enviar
        </button>
      </form>
    </Gaveta>
  );
}

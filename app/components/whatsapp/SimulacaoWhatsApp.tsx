"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { lerLead, type Lead } from "@/lib/lead";
import { parcela as calcularParcela } from "@/lib/carros";
import { IconeSeta, IconeWhatsApp } from "../icones";
import { classeBotao } from "../Botao";

type CarroResumo = {
  id: string;
  nome: string;
  ano: number;
  km: string;
  preco: string;
  precoNum: number;
  foto: string | null;
  url: string;
  loja: string;
  laudo: boolean;
  revisoes: boolean;
  marca: string;
  modelo: string;
  entradaMin: number;
  parcelaPadrao: number;
};

type Props = { tipo: "conversa" | "lead"; assunto: string; texto: string; carro: CarroResumo | null };

const brl = (v: number) => "R$ " + Math.round(v).toLocaleString("pt-BR");
const LEAD_EXEMPLO: Lead = { nome: "Ana Souza", entrada: 0, prazo: 48, parcela: 0, troca: "Fiat Argo Drive 1.0 2020 · 58.000 km", cpf: true };

type Bolha = { de: "cliente" | "loja" | "auto"; texto: ReactNode; hora: string; cartao?: boolean };

export default function SimulacaoWhatsApp({ tipo, assunto, texto, carro }: Props) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  useEffect(() => {
    const ler = () => setLead(lerLead());
    ler();
  }, []);

  const voltar = () => (window.history.length > 1 ? router.back() : router.push(carro?.url ?? "/"));
  const destinoVolta = carro ? "Voltar para o anúncio" : "Voltar para o site";

  const l: Lead = lead ?? {
    ...LEAD_EXEMPLO,
    entrada: carro?.entradaMin ?? 20240,
    parcela: carro?.parcelaPadrao ?? 2528,
  };
  const primeiroNome = l.nome.split(" ")[0] || "Olá";

  // ---------- conversa ----------
  const tags = tipo === "lead" ? ["Novo lead", "Financiamento", ...(l.troca ? ["Troca"] : []), carro?.loja ?? "Marés"] : ["Novo lead", "Conversa direta", carro?.loja ?? "Marés"];
  let bolhas: Bolha[];
  if (tipo === "lead" && carro) {
    const precoBase = carro.precoNum - l.entrada;
    const taxaReal = 0.0149;
    const parcelaReal = calcularParcela(precoBase, l.prazo, taxaReal);
    bolhas = [
      {
        de: "cliente",
        cartao: true,
        hora: "10:41",
        texto: (
          <>
            Olá! Quero receber a simulação deste carro com a minha taxa.
            <br />
            <br />
            <b>Carro:</b> {carro.nome} · {carro.ano} · {carro.km}
            <br />
            Código: {carro.id} · {carro.preco}
            <br />
            <br />
            <b>Minha simulação</b>
            <br />
            Entrada: {brl(l.entrada)}
            <br />
            Prazo: {l.prazo}x
            <br />
            Parcela estimada: {brl(l.parcela)}
            {l.troca && (
              <>
                <br />
                <br />
                <b>Meu carro na troca</b>
                <br />
                {l.troca}
              </>
            )}
            <br />
            <br />
            Nome: {l.nome}
            {l.cpf && (
              <>
                <br />
                CPF informado para pré-aprovação
              </>
            )}
          </>
        ),
      },
      {
        de: "auto",
        hora: "10:41",
        texto: `Oi, ${primeiroNome}! Recebemos sua simulação do ${carro.modelo}${l.troca ? " e os dados do seu carro na troca" : ""}. O Rafael, da ${carro.loja}, vai te mandar a proposta com a taxa real em até 1 dia útil.`,
      },
      {
        de: "loja",
        hora: "10:58",
        texto: l.cpf ? (
          <>
            {primeiroNome}, aqui é o Rafael. Sua taxa pré-aprovada ficou em 1,49% a.m.: {l.prazo}x de {brl(parcelaReal)}, com a mesma entrada.
            {l.troca && (
              <>
                <br />
                <br />
                Com a supervalorização, seu carro entra até R$ 3 mil acima da FIPE.
              </>
            )}{" "}
            Posso deixar o {carro.modelo} reservado para um test drive amanhã às 10h?
          </>
        ) : (
          <>
            {primeiroNome}, aqui é o Rafael. Com a sua entrada, a estimativa fica em {l.prazo}x de {brl(l.parcela)}. Se me mandar seu CPF, eu já te passo a taxa real
            pré-aprovada. Quer agendar um test drive do {carro.modelo}?
          </>
        ),
      },
    ];
  } else {
    const primeira =
      assunto === "troca"
        ? `Olá! Quero avaliar meu carro para usar na troca${texto ? `: ${texto}` : ""}.`
        : assunto === "aviso"
          ? `Olá! Procuro ${texto || "um carro"} e não encontrei no site. Podem me avisar quando chegar?`
          : assunto === "laudo" && carro
            ? `Olá! Quero receber o laudo completo do ${carro.nome} ${carro.ano} (código ${carro.id}).`
            : carro
              ? `Olá! Tenho interesse no ${carro.nome} ${carro.ano} (código ${carro.id}). Ainda está disponível?`
              : "Olá! Vim pelo site da Marés Seminovos.";
    const resposta = carro
      ? `Oi! ${assunto === "laudo" ? "Já te mando o PDF do laudo." : `Está sim, na ${carro.loja}.`} O Rafael já vai falar com você. Para adiantar, como você pensa em comprar?`
      : "Oi! Que bom ter você aqui. Para adiantar, como você pensa em comprar?";
    bolhas = [
      { de: "cliente", cartao: !!carro, hora: "14:05", texto: primeira },
      { de: "auto", hora: "14:05", texto: resposta },
    ];
  }

  return (
    <main className="flex-1 bg-[#EFEEE8]">
      <div className="margem py-6 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={voltar} className="flex items-center gap-1.5 font-medium text-azul hover:underline">
            <IconeSeta size={18} /> {destinoVolta}
          </button>
          <p className="rounded-full bg-white px-3.5 py-1.5 text-[13px] text-cinza">
            Simulação: num site real, este botão abriria o WhatsApp da loja.
          </p>
        </div>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[400px_1fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto w-full max-w-[400px]">
            <Celular nomeCliente={tipo === "lead" ? l.nome : "Novo contato"} subtitulo={carro ? `${tipo === "lead" ? "Lead do site" : "Pelo site"} · ${carro.modelo} ${carro.id}` : "Pelo site"} tags={tags}>
              {bolhas.map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.5 }}>
                  <Balao b={b} carro={b.cartao ? carro : null} />
                  {tipo === "conversa" && i === 1 && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {["Vou financiar", "Tenho carro para dar na troca", "Só quero ver o carro"].map((o) => (
                        <span key={o} className="rounded-lg bg-white py-2 text-center text-[13px] text-[#027EB5] shadow-sm">
                          {o}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </Celular>
          </motion.div>

          <div>
            <p className="text-sm text-cinza">{tipo === "lead" ? "Simulação · lead no WhatsApp" : "Simulação · conversa direta no WhatsApp"}</p>
            <h1 className="titulo-display mt-3 text-[40px] md:text-[56px]">
              {tipo === "lead" ? "O vendedor responde com proposta, não com perguntas" : "Para quem só quer falar com uma pessoa"}
            </h1>
            {tipo === "conversa" && (
              <p className="mt-4 max-w-[640px] text-[17px] text-tinta/80">
                Nem todo mundo quer preencher simulação. Tem gente que só quer saber se o carro ainda está lá, negociar ou tirar uma dúvida. Se o botão some, essa
                pessoa não preenche nada: ela vai para outro site.
              </p>
            )}
            <dl className="mt-6 max-w-[760px]">
              {(tipo === "lead"
                ? [
                    ["Qual carro", carro ? `${carro.modelo} ${carro.id}, com link do anúncio. Ele não precisa perguntar de qual carro se trata.` : "O anúncio vem na mensagem."],
                    ["Se cabe no orçamento", "Entrada acima do mínimo, prazo e parcela que a pessoa já aceitou ver."],
                    ["Se tem troca", l.troca ? `${l.troca}. A avaliação prévia sai antes da visita.` : "Ela disse que não tem carro na troca."],
                    ["Se dá para pré-aprovar", l.cpf ? "Com o CPF, a primeira resposta já traz a taxa real." : "Sem CPF, o vendedor pede na conversa para trazer a taxa real."],
                    ["Em que etapa está", `Etiquetas ${tags.join(", ")}.`],
                  ]
                : [
                    ["O carro já vem na mensagem", 'Código e link do anúncio. O vendedor nunca precisa perguntar "qual carro?".'],
                    ["A automação faz as perguntas", "Três respostas rápidas (financiar, troca, só ver) qualificam sem formulário."],
                    ["O vendedor puxa para a simulação", "Pergunta a entrada e manda o link que abre direto no simulador."],
                    ["Dá para comparar os caminhos", 'A etiqueta "Conversa direta" separa esse lead do que veio pela simulação.'],
                  ]
              ).map(([k, v]) => (
                <div key={k} className="grid gap-1 border-t border-linha py-4 md:grid-cols-[260px_1fr] md:gap-6">
                  <dt className="font-bold">{k}</dt>
                  <dd className="text-cinza">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 grid max-w-[760px] gap-3 md:grid-cols-2">
              {tipo === "lead" ? (
                <>
                  <Comparativo escuro rotulo="Com a simulação" titulo="9 informações e 1 proposta" />
                  <Comparativo rotulo="Hoje, formulário genérico" titulo="2 campos e 1 ligação" />
                </>
              ) : (
                <>
                  <Comparativo escuro rotulo="Simular parcelas" titulo="Lead completo, proposta na 1ª resposta" />
                  <Comparativo rotulo="Conversar no WhatsApp" titulo="Lead com o carro, qualificado na conversa" />
                </>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={voltar} className={classeBotao("contorno")}>
                <IconeSeta size={18} /> {destinoVolta}
              </button>
              {carro && tipo === "conversa" && (
                <Link href={`${carro.url}#simular`} className={classeBotao("primario")}>
                  Simular parcelas
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Comparativo({ rotulo, titulo, escuro }: { rotulo: string; titulo: string; escuro?: boolean }) {
  return (
    <div className={`rounded-xl p-5 ${escuro ? "bg-profundo text-white" : "bg-areia text-tinta"}`}>
      <p className={`text-sm ${escuro ? "text-white/75" : "text-cinza"}`}>{rotulo}</p>
      <p className="mt-1 text-xl font-bold">{titulo}</p>
    </div>
  );
}

function Celular({ nomeCliente, subtitulo, tags, children }: { nomeCliente: string; subtitulo: string; tags: string[]; children: ReactNode }) {
  const iniciais = nomeCliente
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="overflow-hidden rounded-[44px] border-[10px] border-[#14161C] bg-[#EAE3D9] shadow-2xl">
      <div className="bg-[#2E6E5A] px-5 pt-3 pb-3 text-white">
        <div className="flex justify-between text-[13px]">
          <span>10:42</span>
          <span>5G 92%</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <IconeSeta size={18} />
          <span className="grid size-9 place-items-center rounded-full bg-[#A9C9F5] text-sm font-bold text-tinta">{iniciais}</span>
          <span>
            <span className="block font-medium">{nomeCliente}</span>
            <span className="text-xs text-white/80">{subtitulo}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 bg-white px-3 py-2">
        {tags.map((t, i) => (
          <span key={t} className={`rounded px-2 py-0.5 text-[11px] font-medium ${["bg-[#DCF0E3] text-verde", "bg-[#FDE2D2] text-[#B54708]", "bg-[#EFE7FB] text-[#6B3FB8]", "bg-nevoa text-azul"][i % 4]}`}>
            {t}
          </span>
        ))}
      </div>
      <div className="flex min-h-[520px] flex-col gap-3 px-3 py-4">
        <span className="self-center rounded-md bg-white px-2 py-0.5 text-[11px] text-cinza">HOJE</span>
        {children}
      </div>
      <div className="flex items-center gap-2 bg-[#EAE3D9] px-3 pb-4">
        <span className="flex-1 rounded-full bg-white px-4 py-2.5 text-sm text-cinza">Mensagem</span>
        <span className="grid size-10 place-items-center rounded-full bg-[#2E6E5A] text-white">
          <IconeWhatsApp size={18} />
        </span>
      </div>
    </div>
  );
}

function Balao({ b, carro }: { b: Bolha; carro: CarroResumo | null }) {
  const doCliente = b.de === "cliente";
  return (
    <div className={`max-w-[88%] rounded-xl p-2.5 text-[13px] leading-snug shadow-sm ${doCliente ? "bg-white" : "ml-auto bg-[#D9FDD3]"}`}>
      {b.de === "auto" && <p className="mb-1 text-[11px] font-medium text-verde">Mensagem automática</p>}
      {carro && (
        <div className="mb-2 overflow-hidden rounded-lg bg-[#F0F2F5]">
          {carro.foto && (
            <div className="relative h-24">
              <Image src={carro.foto} alt="" fill sizes="320px" quality={70} className="object-cover" />
            </div>
          )}
          <p className="px-2 pt-1.5 font-bold">{carro.nome} · Marés Seminovos</p>
          <p className="px-2 pb-1.5 text-[12px] text-cinza">mares-seminovos.vercel.app{carro.url}</p>
        </div>
      )}
      <div>{b.texto}</div>
      <p className="mt-1 text-right text-[11px] text-cinza">
        {b.hora}
        {!doCliente && " ✓✓"}
      </p>
    </div>
  );
}

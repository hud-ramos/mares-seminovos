import { type Carro, DESTAQUE_ID, formatarKm, formatarPreco } from "./carros";

export type Status = "Comprovado" | "Informado" | "Sem registro";
export type ItemProcedencia = { item: string; detalhe: string; fonte: string; status: Status };

/** Os mesmos 6 pontos para todo carro. O que não tem comprovação aparece também. */
export function procedencia(c: Carro): ItemProcedencia[] {
  const d = c.diferenciais;
  if (c.id === DESTAQUE_ID) {
    return [
      { item: "Origem", detalhe: "Comprado zero km na Marés, em mar/2023", fonte: "Nota fiscal de venda da Marés", status: "Comprovado" },
      { item: "Donos anteriores", detalhe: "Único dono", fonte: "Conforme documento do veículo (CRLV)", status: "Comprovado" },
      { item: "Revisões", detalhe: "4 de 4 na concessionária Nissan", fonte: "Aos 10, 20, 30 e 40 mil km · manual carimbado", status: "Comprovado" },
      { item: "Laudo cautelar", detalhe: "Aprovado em 28/09/2026", fonte: "Vistoria Litoral · sem apontamentos", status: "Comprovado" },
      { item: "Garantia", detalhe: "Garantia Marés de 3 meses", fonte: "A de fábrica terminou em 03/2026", status: "Comprovado" },
      { item: "IPVA e documentos", detalhe: "IPVA 2026 pago, sem débitos", fonte: "Consulta ao Detran-SP em 01/10/2026", status: "Comprovado" },
    ];
  }
  return [
    d.unicoDono
      ? { item: "Origem", detalhe: "Um único dono desde zero km", fonte: "Nota fiscal da primeira venda", status: "Comprovado" }
      : { item: "Origem", detalhe: "Recebido na troca por outro carro", fonte: "Declaração do dono anterior", status: "Informado" },
    d.unicoDono
      ? { item: "Donos anteriores", detalhe: "Único dono", fonte: "Conforme documento do veículo (CRLV)", status: "Comprovado" }
      : { item: "Donos anteriores", detalhe: "Mais de um dono", fonte: "Conforme documento do veículo (CRLV)", status: "Informado" },
    d.revisoesConcessionaria
      ? { item: "Revisões", detalhe: `Todas na concessionária ${c.marca}`, fonte: "Manual carimbado e notas fiscais", status: "Comprovado" }
      : { item: "Revisões", detalhe: "Sem comprovante de revisões", fonte: "O dono anterior não apresentou o manual", status: "Sem registro" },
    d.laudoAprovado
      ? { item: "Laudo cautelar", detalhe: "Aprovado", fonte: "Vistoria Litoral · sem apontamentos", status: "Comprovado" }
      : { item: "Laudo cautelar", detalhe: "Em andamento", fonte: "O carro só recebe o selo depois do laudo", status: "Sem registro" },
    d.garantiaFabrica
      ? { item: "Garantia", detalhe: "Garantia de fábrica vigente", fonte: "Mais a Garantia Marés de 3 meses", status: "Comprovado" }
      : { item: "Garantia", detalhe: "Garantia Marés de 3 meses", fonte: "Motor e câmbio, a partir da entrega", status: "Comprovado" },
    d.ipvaPago
      ? { item: "IPVA e documentos", detalhe: "IPVA 2026 pago, sem débitos", fonte: "Consulta ao Detran-SP", status: "Comprovado" }
      : { item: "IPVA e documentos", detalhe: "IPVA 2026 a pagar na transferência", fonte: "Sem multas ou restrições no Detran-SP", status: "Informado" },
  ];
}

export type Motivo = { icone: "laudo" | "dono" | "revisao" | "fipe" | "ipva" | "troca" | "garantia" | "km"; titulo: string; texto: string };

export function motivos(c: Carro): Motivo[] {
  const d = c.diferenciais;
  const l: Motivo[] = [];
  if (d.laudoAprovado) l.push({ icone: "laudo", titulo: "Laudo cautelar aprovado", texto: "Estrutura, motor e documentação conferidos" });
  if (d.unicoDono) l.push({ icone: "dono", titulo: "Único dono", texto: c.id === DESTAQUE_ID ? "Comprado zero km aqui na Marés" : "Um só dono desde zero km" });
  if (d.revisoesConcessionaria)
    l.push({ icone: "revisao", titulo: c.id === DESTAQUE_ID ? "4 de 4 revisões" : "Revisões em dia", texto: `Todas feitas na concessionária ${c.marca}` });
  if (c.abaixoFipe && c.fipe > c.preco)
    l.push({ icone: "fipe", titulo: `${formatarPreco(c.fipe - c.preco)} abaixo da FIPE`, texto: "Tabela FIPE de outubro/2026" });
  if (d.garantiaFabrica) l.push({ icone: "garantia", titulo: "Garantia de fábrica", texto: "Ainda vigente, mais 3 meses da Marés" });
  if (d.baixaKm) l.push({ icone: "km", titulo: "Baixa quilometragem", texto: `Só ${formatarKm(c.km)} rodados` });
  if (d.ipvaPago) l.push({ icone: "ipva", titulo: "IPVA 2026 pago", texto: "Sem custo extra para transferir" });
  l.push({ icone: "troca", titulo: "Supervalorização do seu usado", texto: "Até R$ 3 mil acima da FIPE na troca" });
  return l.slice(0, 6);
}

export function ficha(c: Carro): [string, string][] {
  const final = c.id.slice(-1);
  return [
    ["Marca", c.marca],
    ["Modelo", c.modelo],
    ["Versão", c.versao],
    ["Ano", String(c.ano)],
    ["Quilometragem", formatarKm(c.km)],
    ["Câmbio", c.cambio],
    ["Combustível", c.combustivel],
    ["Cor", c.cor],
    ["Carroceria", c.tipo],
    ["Final da placa", final],
    ["Código", c.id],
    ["Loja", c.loja],
  ];
}

export const ITENS_SERIE: Record<Carro["tipo"], string[]> = {
  SUV: ["Multimídia com Android Auto e CarPlay", "Câmera de ré", "Ar-condicionado digital", "Partida sem chave", "6 airbags", "Faróis em LED", "Rodas de liga leve"],
  Hatch: ["Multimídia com Android Auto e CarPlay", "Ar-condicionado", "Direção elétrica", "Vidros e travas elétricas", "Sensor de estacionamento", "Rodas de liga leve"],
  Sedã: ["Multimídia com Android Auto e CarPlay", "Ar-condicionado digital", "Câmera de ré", "Bancos em couro", "Partida sem chave", "6 airbags"],
  Picape: ["Tração 4x4", "Multimídia com Android Auto e CarPlay", "Câmera de ré", "Protetor de caçamba", "Controle de estabilidade", "Rodas de liga leve"],
};

export const LOJAS: Record<string, string> = {
  "Marés Litoral": "Santos, SP",
  "Marés Centro": "São Paulo, SP",
  "Marés Zona Norte": "São Paulo, SP",
};

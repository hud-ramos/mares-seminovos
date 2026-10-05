# Marés Seminovos

Site fictício feito para o desafio de Product Designer da AutoForce: listagem de seminovos e página do veículo, desktop e mobile, a partir do Figma do projeto.

## O que funciona

- **Listagem** com os 180 carros da base fictícia (`data/carros.json`):
  - busca com sugestões de modelos, marcas e buscas populares;
  - atalhos por diferencial (laudo aprovado, único dono, garantia de fábrica, revisões, baixa km);
  - filtros com contagem por opção, chips de filtros ativos e "Limpar filtros";
  - ordenação, "Carregar mais", estados de carregando e sem resultado;
  - favoritos salvos no navegador.
- **Página do veículo** (`/carros/[id]`, gerada estaticamente para os 180 carros):
  - galeria com setas, miniaturas e arrastar no celular;
  - procedência com os mesmos 6 pontos para todo carro, inclusive o que não tem comprovação;
  - simulador de parcela com entrada mínima de 20%, prazos e carro na troca;
  - etapa de contato que monta a mensagem de WhatsApp com o carro, a simulação e a troca;
  - barra de contato fixa (topo no desktop depois da galeria, rodapé no celular).

## Rodar localmente

```bash
npm install
npm run dev
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion. Fontes DM Sans e Barlow Semi Condensed via `next/font`. Fotos geradas com IA para o projeto.

Projeto fictício. Telefones, endereços e WhatsApp não são reais.

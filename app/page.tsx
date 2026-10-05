import { Suspense } from "react";
import Cabecalho from "./components/Cabecalho";
import Rodape from "./components/Rodape";
import Listagem from "./components/listagem/Listagem";
import { CardCarregando } from "./components/CardCarro";
import { CARROS } from "@/lib/carros";

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-amarelo focus:px-3 focus:py-2">
        Pular para os carros
      </a>
      <Cabecalho />
      <Suspense
        fallback={
          <main className="margem flex-1 py-10">
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardCarregando key={i} />
              ))}
            </div>
          </main>
        }
      >
        <Listagem carros={CARROS} />
      </Suspense>
      <Rodape />
    </>
  );
}

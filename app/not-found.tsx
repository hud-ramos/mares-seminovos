import Link from "next/link";
import Cabecalho from "./components/Cabecalho";
import Rodape from "./components/Rodape";
import { classeBotao } from "./components/Botao";

export default function NaoEncontrado() {
  return (
    <>
      <Cabecalho />
      <main className="margem flex flex-1 flex-col items-center justify-center gap-5 py-24 text-center">
        <h1 className="titulo-display text-[44px] md:text-[64px]">Esse carro já foi vendido</h1>
        <p className="max-w-[520px] text-[17px] text-cinza">Ou o endereço mudou. Os outros seminovos da Marés continuam esperando por você.</p>
        <Link href="/" className={classeBotao("primario")}>
          Ver seminovos
        </Link>
      </main>
      <Rodape />
    </>
  );
}

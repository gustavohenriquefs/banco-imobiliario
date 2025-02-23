import { Jogador } from "../models/jogador";
import { IEfeitoEspecial } from "./efeito-especial";

export class EfeitoPartida implements IEfeitoEspecial {
  aplicar(jogador: Jogador): void {
    console.log(`Sem efeito especial para ${jogador.nome}`);

  }
}

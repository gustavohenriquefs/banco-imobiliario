import { Jogador } from "../models/jogador";
import { IEfeitoEspecial } from "./efeito-especial";

export class EfeitoPartida implements IEfeitoEspecial {
  aplicar(jogador: Jogador): void {
    console.log(`🎉 ${jogador.nome} recebeu R$ 200 ao passar pelo Ponto de Partida!`);
    jogador.saldo += 200;
  }
}

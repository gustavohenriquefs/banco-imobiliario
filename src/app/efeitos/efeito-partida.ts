import { Jogador } from "../models/jogador";
import { IEfeitoEspecial } from "./efeito-especial";

export class EfeitoPartida implements IEfeitoEspecial {
  aplicar(jogador: Jogador): void {
    jogador.saldo += 50;
    console.log(`🎉 ${jogador.nome} recebeu R$ ${jogador.saldo} ao passar pelo Ponto de Partida!`);
    
  }
}

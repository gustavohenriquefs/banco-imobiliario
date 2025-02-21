import { Jogador } from "../models/jogador";
import { IEfeitoEspecial } from "./efeito-especial";

export class EfeitoPrisao implements IEfeitoEspecial {
  aplicar(jogador: Jogador): void {
    console.log(`🚔 ${jogador.nome} foi enviado para a prisão!`);
    jogador.posicao = 10;
  }
}

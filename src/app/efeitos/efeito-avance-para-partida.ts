import { Jogador } from "../models/jogador";

export class EfeitoAvanceParaPartida {
  constructor() { }

  aplicar(jogador: Jogador): void {
    jogador.posicaoAtual = 0;
  }
}
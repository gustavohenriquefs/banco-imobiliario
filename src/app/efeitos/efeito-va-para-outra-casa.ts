import { Jogador } from "../models/jogador";

export class EfeitoVaParaOutraCasa {
  constructor(public casaDestino: number) {}

  aplicar(jogador: Jogador): void {
    jogador.posicaoAtual = this.casaDestino;
  }
}
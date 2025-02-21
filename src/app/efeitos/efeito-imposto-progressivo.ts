import { Jogador } from "../models/jogador";

export class EfeitoImpostoProgressivo {
  constructor(public valorBase: number, public valorPorCasa: number) { }

  aplicar(jogador: Jogador): void {
    jogador.saldo -= this.valorBase + this.valorPorCasa * jogador.posicaoAtual;
  }
}
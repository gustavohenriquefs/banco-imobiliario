import { Jogador } from "../models/jogador";

export class EfeitoVolteXCasas {
  constructor(public casas: number) {}

  aplicar(jogador: Jogador): void {
    jogador.posicaoAtual -= this.casas;
  }
}
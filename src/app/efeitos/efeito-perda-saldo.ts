import { Jogador } from "../models/jogador";

export class EfeitoPerdaSaldo {
  constructor(public valor: number) {}

  aplicar(jogador: Jogador): void {
    jogador.saldo -= this.valor;
  }
}
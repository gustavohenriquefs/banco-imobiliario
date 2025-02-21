import { Jogador } from "../models/jogador";

export class EfeitoBonus {
  constructor(public valor: number) {}

  aplicar(jogador: Jogador): void {
    jogador.saldo += this.valor;
  }
}
import { ISujeitoObservavel } from '../observador/sujeito-observavel.interface';
import { Observador } from './../observador/observador';
export class Jogador implements Observador {
  constructor(
    public nome: string,
    public saldo: number = 1500,
    public posicao: number = 0
  ) { }

  atualizar(imovel: ISujeitoObservavel): void {
    const aluguel: number = imovel.getValorAluguel();

    if(imovel.getDono() === this) {
      this.saldo += aluguel;
    } else {
      this.saldo -= aluguel;
    }
  }

  mover(casas: number, tamanhoTabuleiro: number): void {
    this.posicao = (this.posicao + casas) % tamanhoTabuleiro;

    if (this.posicao === 0) {
      this.saldo += 200;
    }
  }
  
  private comprarPropriedade(valor: number): void {
    this.saldo -= valor;
  }

  pagar(valor: number, destinatario: Jogador | null): void {
    if (this.saldo >= valor) {
      this.saldo -= valor;
      if (destinatario) destinatario.saldo += valor;
    }
  }
}
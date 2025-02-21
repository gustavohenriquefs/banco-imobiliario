import { ISujeitoObservavel } from '../observador/sujeito-observavel.interface';
import { Observador } from './../observador/observador';

const SALDO_INICIAL = 1500;
const POSICAO_INICIAL = 0;
const BONUS_PASSAGEM = 200;
export class Jogador implements Observador {
  constructor(
    public nome: string,
    public saldo: number = SALDO_INICIAL,
    public posicaoAtual: number = POSICAO_INICIAL
  ) { }

  atualizar(imovel: ISujeitoObservavel): void {
    const aluguel: number = imovel.getValorAluguel();

    if (imovel.getDono() === this) {
      this.saldo += aluguel;
    } else {
      this.saldo -= aluguel;
    }
  }

  mover(casas: number, tamanhoTabuleiro: number): void {
    if (casas + this.posicaoAtual >= tamanhoTabuleiro) {
      this.saldo += BONUS_PASSAGEM;
    }

    this.posicaoAtual = (this.posicaoAtual + casas) % tamanhoTabuleiro;
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
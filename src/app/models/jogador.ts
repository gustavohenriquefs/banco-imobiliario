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
    const aluguel: number = imovel.getValorQuestao();

    if (!imovel.getDono()) return;

    if (imovel.getDono() === this) {
      this.saldo += aluguel;

      console.log(`Jogador ${this.nome} recebeu aluguel de ${aluguel}`);
    } else {
      this.saldo -= aluguel;

      console.log(`Jogador ${this.nome} pagou aluguel de ${aluguel} para o jogador ${imovel.getDono()?.nome}`);
    }
  }

  mover(somaDados: number, tamanhoTabuleiro: number): void {
    if (somaDados + this.posicaoAtual >= tamanhoTabuleiro) {
      this.saldo += BONUS_PASSAGEM;
    }

    console.log(`Jogador ${this.nome} está na posição ${this.posicaoAtual} e tirou ${somaDados} nos dados`);

    this.posicaoAtual = (this.posicaoAtual + somaDados) % tamanhoTabuleiro;
  }

  pagar(valor: number, destinatario: Jogador | null): void {
    if (this.saldo >= valor) {
      this.saldo -= valor;
      if (destinatario) destinatario.saldo += valor;
    }
  }

  public reiniciarJogador(): void {
    this.saldo = SALDO_INICIAL;
    this.posicaoAtual = POSICAO_INICIAL;
  }
}
import { Propriedade } from "../models/propriedade";
import { Imovel } from '../models/imovel';
import { Empresa } from '../models/empresa';
import { Jogador } from '../models/jogador';
import { Tabuleiro } from '../models/tabuleiro';
import { LugarEspecial } from '../models/lugar-especial';



export enum EventoMoverCasa {
  ComprarImovel = "Comprar Imóvel",
  PagarAluguel = "Pagar Aluguel",
  PagarImposto = "Pagar Imposto",
  Prisao = "Vá para a Prisão",
  Partida = "Ponto de Partida",
  ComprarEmpresa = "Comprar Empresa",
  PagarEmpresa = "Pagar Empresa",
}

export class TabuleiroController {
  private tabuleiro: Tabuleiro;

  private jogador1: Jogador = null;
  private jogador2: Jogador = null;

  private turnoAtual: number = 1;
  private jogoAtivo: boolean = true;

  constructor() {
    this.tabuleiro = Tabuleiro.getInstance();
    this.tabuleiro.iniciarTabuleiro();
  }

  public criarJogadores(jogador1: string, jogador2: string): void {
    this.jogador1 = new Jogador(jogador1);
    this.jogador2 = new Jogador(jogador2);
  }

  // TODO: aqui mesmo?
  public moverJogador(jogador: Jogador, posicao: number): EventoMoverCasa {
    jogador.mover(posicao, this.tabuleiro.getQuantidadePropriedades());

    const casaAtual = this.tabuleiro.getPropriedade(jogador.posicao);

    if (casaAtual instanceof Imovel) {
      if (casaAtual.getDono() === null) {
        console.log(`🏠 ${jogador.nome} caiu em ${casaAtual.nome} e pode comprar por R$${casaAtual.preco}`);
        return EventoMoverCasa.ComprarImovel;
      } else {
        console.log(`🏠 ${jogador.nome} caiu em ${casaAtual.nome} e deve pagar R$${casaAtual.calcularAluguel()}`);
        return EventoMoverCasa.PagarAluguel;
      }
    } else if (casaAtual instanceof Empresa) {
      const empresa: Empresa = casaAtual as Empresa;

      if (empresa.dono === null) {
        console.log(`🏢 ${jogador.nome} caiu em ${casaAtual.nome} e pode comprar por R$${casaAtual.preco}`);
        return EventoMoverCasa.ComprarEmpresa;
      } else {
        console.log(`🏢 ${jogador.nome} caiu em ${casaAtual.nome} e deve pagar R$${casaAtual.calcularAluguel()}`);
        return EventoMoverCasa.PagarEmpresa;
      }
    } else {
      const lugarEspecial: LugarEspecial = casaAtual as LugarEspecial;

      lugarEspecial.ativarEfeito(jogador);

      return EventoMoverCasa.PagarImposto;
    }

  }

  public getPropriedades(): Propriedade[] {
    return this.tabuleiro.getPropriedades();
  }
}
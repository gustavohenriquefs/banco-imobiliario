import { IPropriedade } from "../models/propriedade";
import { Imovel } from '../models/imovel';
import { Empresa } from '../models/empresa';
import { Jogador } from '../models/jogador';
import { Tabuleiro } from '../models/tabuleiro';

export enum EventoMoverCasa {
  ComprarImovel = "Comprar Imóvel",
  PagarAluguel = "Pagar Aluguel",
  ComprarEmpresa = "Comprar Empresa",
  AcaoEspecial = "Ação Especial",
  PagarEmpresa = "Pagar Empresa",
}

export class TabuleiroController {
  private tabuleiro: Tabuleiro;

  private jogador1!: Jogador;
  private jogador2!: Jogador;

  constructor() {
    this.tabuleiro = Tabuleiro.getInstance();
    this.tabuleiro.iniciarTabuleiro();
  }

  public criarJogadores(jogador1: string, jogador2: string): void {
    this.jogador1 = new Jogador(jogador1);
    this.jogador2 = new Jogador(jogador2);
  }

  public getJogadores(): { jogador1: Jogador; jogador2: Jogador } {
    return { jogador1: this.jogador1, jogador2: this.jogador2 };
  }

  public getPropriedades(): IPropriedade[] {
    return this.tabuleiro.getPropriedades();
  }

  private jogarDados(): number {
    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;

    return dado1 + dado2;
  }

  setSomaDados(somaDados: number): void {
    this.jogador1.setSomaDadosRodada(somaDados);
    this.jogador2.setSomaDadosRodada(somaDados);
  }

  private realizarAcaoJogada(jogador: Jogador): EventoMoverCasa {
    const propriedadeEmQueEstou = this.tabuleiro.getPropriedade(jogador.posicaoAtual);

    console.log("Estou na propriedade: ", propriedadeEmQueEstou.nome);

    if (propriedadeEmQueEstou instanceof Imovel) {

      if (!propriedadeEmQueEstou.getDono()) {
        return EventoMoverCasa.ComprarImovel;
      }

      return EventoMoverCasa.PagarAluguel;

    } else if (propriedadeEmQueEstou instanceof Empresa) {
      if (!propriedadeEmQueEstou.dono) {
        return EventoMoverCasa.ComprarEmpresa;
      }

      return EventoMoverCasa.PagarEmpresa;
    }

    return EventoMoverCasa.AcaoEspecial;
  }

  public realizarJogada(jogador: Jogador, dadoManual?: number): {
    resultado: number;
    evento: EventoMoverCasa;
    propriedade: IPropriedade;
  } {
    // realizar jogada caso que seja um valor inválido ou não ter inserido um valor:
    let resultado: number;

    if (dadoManual !== undefined && dadoManual >= 2 && dadoManual <= 12) {
      resultado = dadoManual;
    } else {
      resultado = this.jogarDados();
    }

    this.setSomaDados(resultado);

    const propriedadeAntiga = this.tabuleiro.getPropriedade(jogador.posicaoAtual);

    if (propriedadeAntiga instanceof Imovel || propriedadeAntiga instanceof Empresa) {
      propriedadeAntiga.removerObservador(jogador);
    }

    // realizar movimento do jogador:
    jogador.mover(resultado, this.tabuleiro.getQuantidadePropriedades());

    // verificar a propriedade 
    const propriedade = this.tabuleiro.getPropriedade(jogador.posicaoAtual);

    if (propriedade instanceof Imovel || propriedade instanceof Empresa) {
      propriedade.adicionarObservador(jogador);
    }

    const evento: EventoMoverCasa = this.realizarAcaoJogada(jogador);

    return { resultado, evento, propriedade };
  }

  public comprarPropriedade(jogador: Jogador, propriedade: IPropriedade): void {
    if (propriedade instanceof Imovel || propriedade instanceof Empresa) {
      propriedade.setDono(jogador);

      console.log(`${jogador.nome} comprou ${propriedade.nome} por ${propriedade.preco}`);
      jogador.saldo -= propriedade.preco;
    }
  }

  public trocarJogador(jogadorAtual: Jogador): Jogador {
    return jogadorAtual === this.jogador1 ? this.jogador2 : this.jogador1;
  }

  public reiniciarJogo(): void {
    this.tabuleiro.reiniciarTabuleiro();
    this.jogador1.reiniciarJogador();
    this.jogador2.reiniciarJogador();
  }
}

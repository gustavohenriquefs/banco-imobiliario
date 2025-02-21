
import { IEfeitoEspecial } from "../efeitos/efeito-especial";
import { Jogador } from "./jogador";
import { Propriedade } from "./propriedade";

export class LugarEspecial extends Propriedade {
  constructor(
    public nome: string,
    private efeito: IEfeitoEspecial
  ) {
    super(nome, 0);
  }

  calcularAluguel(): number {
    return 0;
  }

  ativarEfeito(jogador: Jogador): void {
    console.log(`🚀 ${jogador.nome} caiu em ${this.nome}!`);
    this.efeito.aplicar(jogador);
  }
}

import { Jogador } from "./jogador";

export abstract class Propriedade {
  constructor(
    public nome: string, 
    public preco: number,
    public dono: Jogador | null = null
  ) { }

  abstract calcularAluguel(): number;

  exibirInfo(): void {
    console.log(`Nome: ${this.nome}, Preço: ${this.preco}, Aluguel: ${this.calcularAluguel()}`);
  }
}

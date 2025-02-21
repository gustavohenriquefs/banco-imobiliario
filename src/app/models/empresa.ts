import { Propriedade } from "./propriedade";

export class Empresa extends Propriedade {
  constructor(
    public nome: string,
    public preco: number,
    private multiplicador: number
  ) {
    super(nome, preco);
  }

  calcularAluguel(): number {
    return this.preco * this.multiplicador;
  }
}
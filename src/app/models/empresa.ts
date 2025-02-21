import { Observador } from "../observador/observador";
import { ISujeitoObservavel } from "../observador/sujeito-observavel.interface";
import { Jogador } from "./jogador";
import { Propriedade } from "./propriedade";

export class Empresa extends Propriedade implements ISujeitoObservavel {
  private observadores: Observador[] = [];

  constructor(
    public nome: string,
    public preco: number,
    private multiplicador: number,
    public dono: Jogador | null = null,
  ) {
    super(nome, preco);
  }

  getValorQuestao(): number {
    this.multiplicador = Math.floor(Math.random() * 10) + 1;
    return this.multiplicador;
  }

  adicionarObservador(observador: Observador): void {
    if(observador == this.dono){return;}
    this.observadores.push(observador);

    console.log("jogador " + observador + " foi adicionado na lista de observadores");

    this.notificarObservadores();
  }

  removerObservador(observador: Observador): void {
    if (observador != this.dono) {
      this.observadores = this.observadores.filter(o => o !== observador);
      console.log("jogador " + observador + " foi removido da lista de observadores");
    }
  }

  notificarObservadores(): void {
    console.log("Executar notificação: ",
      this.observadores.length
    )
    this.observadores.forEach(observador => observador.atualizar(this));
  }

  calcularAluguel(): number {
    return this.preco * this.multiplicador;
  }

  setDono(dono: Jogador): void {
    this.dono = dono;
  }

  getDono(): Jogador | null {
    return this.dono;
  }
}
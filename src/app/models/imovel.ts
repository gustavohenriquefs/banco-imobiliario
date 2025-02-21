import { ISujeitoObservavel } from "../observador/sujeito-observavel.interface";
import { Observador } from "../observador/observador";
import { Jogador } from "./jogador";
import { Propriedade } from "./propriedade";

export class Imovel extends Propriedade implements ISujeitoObservavel {
  private observadores: Observador[] = [];

  constructor(
    public nome: string,
    public preco: number,
    public dono: Jogador | null = null,
    private aluguelBase: number
  ) {
    super(nome, preco);
  }

  getValorQuestao(): number {
    return this.aluguelBase;
  }

  adicionarObservador(observador: Observador): void {
    this.observadores.push(observador);
    console.log("jogador ", observador, " foi adicionado na lista de observadores");

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

  public calcularAluguel(): number {
    return this.dono ? this.aluguelBase : 0;
  }

  public setDono(dono: Jogador): void {
    this.dono = dono;
  }

  public getDono(): Jogador | null {
    return this.dono;
  }
}

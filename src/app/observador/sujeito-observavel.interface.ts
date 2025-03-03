import { Jogador } from "../models/jogador";
import { Observador } from "./observador";

export interface ISujeitoObservavel {
  getValorQuestao(somaDados: number): number;
  getDono(): Jogador | null;
  adicionarObservador(observador: Observador): void;
  removerObservador(observador: Observador): void;
  notificarObservadores(): void;
}
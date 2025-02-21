import { ISujeitoObservavel } from "./sujeito-observavel.interface";

export interface Observador {
  atualizar(imovel: ISujeitoObservavel): void;
}
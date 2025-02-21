import { Jogador } from "../models/jogador";

export interface IEfeitoEspecial {
  aplicar(jogador: Jogador): void;
}
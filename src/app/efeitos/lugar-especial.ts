import { Jogador } from "../models/jogador";
import { IEfeitoEspecial } from "./efeito-especial";

export class LugarEspecial {

  constructor(
    public nome: string,
    public lugarEfeitoEspecial: IEfeitoEspecial
  ) {
    this.lugarEfeitoEspecial = lugarEfeitoEspecial;
  }

  aplicar(jogador: Jogador): void {
    this.lugarEfeitoEspecial.aplicar(jogador);
  }
}
import { Jogador } from "../models/jogador";
import { Propriedade } from "../models/propriedade";
import { IEfeitoEspecial } from "./efeito-especial";

export class LugarEspecial implements Propriedade {
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
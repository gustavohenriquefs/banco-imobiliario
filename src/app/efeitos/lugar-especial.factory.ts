import { LugarEspecial } from "../models/lugar-especial";
import { EfeitoImposto } from "./efeito-imposto";
import { EfeitoPartida } from "./efeito-partida";
import { EfeitoPrisao } from "./efeito-prisao";
import { ILugarEspecialFactory } from "./lugar-especial.factory.interface";

export enum NomesLugaresEspeciais {
  PARTIDA = "Ponto de Partida",
  IMPOSTO = "Imposto de Renda",
  PRISAO = "Vá para a Prisão",
}

export class LugarEspecialFactory implements ILugarEspecialFactory {
  public criarLugarEspecial(nome: NomesLugaresEspeciais): LugarEspecial {
    switch (nome) {
      case "Ponto de Partida":
        return new LugarEspecial(nome, new EfeitoPartida());
      case "Imposto de Renda":
        return new LugarEspecial(nome, new EfeitoImposto());
      case "Vá para a Prisão":
        return new LugarEspecial(nome, new EfeitoPrisao());
      default:
        throw new Error(`Lugar especial "${nome}" não encontrado.`);
    }
  }
}

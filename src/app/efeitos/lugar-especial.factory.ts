import { LugarEspecial } from "../models/lugar-especial";
import { EfeitoAvanceParaPartida } from "./efeito-avance-para-partida";
import { EfeitoBonus } from "./efeito-bonus";
import { EfeitoImposto } from "./efeito-imposto";
import { EfeitoImpostoProgressivo } from "./efeito-imposto-progressivo";
import { EfeitoPartida } from "./efeito-partida";
import { EfeitoPerdaSaldo } from "./efeito-perda-saldo";
import { EfeitoVaParaOutraCasa } from "./efeito-va-para-outra-casa";
import { EfeitoVolteXCasas } from "./efeito-volte-x-casas";
import { ILugarEspecialFactory } from "./lugar-especial.factory.interface";

export enum NomesLugaresEspeciais {
  PARTIDA = "Ponto de Partida",
  IMPOSTO = "Imposto de Renda",
  VA_PARA_OUTRA_CASA = "Vá para outra casa",
  BONUS = "Bônus",
  IMPOSTO_PROGRESSIVO = "Imposto Progressivo",
  VOLTE_X_CASAS = "Volte X casas",
  PERDA_SALDO = "Perda de saldo",
  AVANCE_PARA_PARTIDA = "Avance para o Ponto de Partida",
}

export class LugarEspecialFactory implements ILugarEspecialFactory {
  public criarLugarEspecial(nome: NomesLugaresEspeciais): LugarEspecial {
    switch (nome) {
      case NomesLugaresEspeciais.PARTIDA:
        return new LugarEspecial(nome, new EfeitoPartida());
      case NomesLugaresEspeciais.IMPOSTO:
        return new LugarEspecial(nome, new EfeitoImposto());
      case NomesLugaresEspeciais.VA_PARA_OUTRA_CASA:
        return new LugarEspecial(nome, new EfeitoVaParaOutraCasa(
          0
        ));
      case NomesLugaresEspeciais.BONUS:
        return new LugarEspecial(nome, new EfeitoBonus(
          100
        ));
      case NomesLugaresEspeciais.IMPOSTO_PROGRESSIVO:
        return new LugarEspecial(nome, new EfeitoImpostoProgressivo(
          10,
          5
        ));
      case NomesLugaresEspeciais.VOLTE_X_CASAS:
        return new LugarEspecial(nome, new EfeitoVolteXCasas(
          3
        ));
      case NomesLugaresEspeciais.PERDA_SALDO:
        return new LugarEspecial(nome, new EfeitoPerdaSaldo(
          50
        ));
      case NomesLugaresEspeciais.AVANCE_PARA_PARTIDA:
        return new LugarEspecial(nome, new EfeitoAvanceParaPartida());
      default:
        throw new Error(`Lugar especial "${nome}" não encontrado.`);
    }
  }
}

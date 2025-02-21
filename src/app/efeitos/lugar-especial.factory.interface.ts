import { LugarEspecial } from "../models/lugar-especial";

export interface ILugarEspecialFactory {
  criarLugarEspecial(nome: string): LugarEspecial;
}
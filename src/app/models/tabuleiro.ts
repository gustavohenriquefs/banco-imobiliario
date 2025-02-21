import { LugarEspecialFactory, NomesLugaresEspeciais } from "../efeitos/lugar-especial.factory";
import { ILugarEspecialFactory } from "../efeitos/lugar-especial.factory.interface";
import { Empresa } from "./empresa";
import { Imovel } from "./imovel";
import { Propriedade } from "./propriedade";


export class Tabuleiro {
  private _propriedades: Propriedade[] = [];
  private _lugarEspecialFactory: ILugarEspecialFactory;
  private _inicializado: boolean = false;
  private static instance: Tabuleiro;

  private constructor() {
    this._lugarEspecialFactory = new LugarEspecialFactory();
  }

  public static getInstance(): Tabuleiro {
    if (!Tabuleiro.instance) {
      Tabuleiro.instance = new Tabuleiro();
    }
    return Tabuleiro.instance;
  }

  public iniciarTabuleiro(): void {
    if (this._inicializado) return;
    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.PARTIDA
    ));
    this._propriedades.push(new Imovel("Av. Brasil", 200, null, 50));
    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.IMPOSTO
    ));
    this._propriedades.push(new Imovel("Av. Paulista", 350, null, 100));
    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.PRISAO
    ));
    this._propriedades.push(new Empresa("Companhia de Água", 150, 50));
    this._propriedades.push(new Imovel("Av. Atlântica", 400, null, 150));
    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.IMPOSTO
    ));
    this._inicializado = true;
    console.log(this._propriedades);
  }

  public getPropriedades(): Propriedade[] {
    return this._propriedades;
  }

  public getPropriedade(index: number): Propriedade {
    return this._propriedades[index];
  }

  public getQuantidadePropriedades(): number {
    return this._propriedades.length;
  }
}
import { LugarEspecialFactory, NomesLugaresEspeciais } from "../efeitos/lugar-especial.factory";
import { ILugarEspecialFactory } from "../efeitos/lugar-especial.factory.interface";
import { Empresa } from "./empresa";
import { Imovel } from "./imovel";
import { IPropriedade } from "./propriedade";

export class Tabuleiro {
  private _propriedades: IPropriedade[] = [];
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

    this._propriedades.push(new Imovel("Av. Brasil", 150, null, 50));

    this._propriedades.push(new Empresa("Companhia de Eletricidade", 150, 0.5));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.PERDA_SALDO
    ));

    this._propriedades.push(new Imovel("Av. Paulista", 300, null, 80));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.IMPOSTO_PROGRESSIVO
    ));

    this._propriedades.push(new Empresa("Companhia de Água", 200, 0.05));

    this._propriedades.push(new Imovel("Av. Atlântica", 400, null, 120));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.BONUS
    ));

    this._propriedades.push(new Empresa("Companhia de Transporte", 250, 0.04));

    this._propriedades.push(new Imovel("Av. Copacabana", 200, null, 50));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.VOLTE_X_CASAS
    ));

    this._propriedades.push(new Imovel("Rua Augusta", 500, null, 150));

    this._propriedades.push(new Empresa("Companhia de Internet", 300, 0.075));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.IMPOSTO
    ));

    this._propriedades.push(new Imovel("Rua das Flores", 350, null, 90));

    this._propriedades.push(new Empresa("Companhia de Telefonia", 350, 0.05));

    this._propriedades.push(new Imovel("Rua Bela Vista", 600, null, 180));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.PERDA_SALDO
    ));

    this._propriedades.push(new Imovel("Rua Ouro Preto", 250, null, 70));

    this._propriedades.push(new Empresa("Companhia de Publicidade", 1020, 0.15));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.AVANCE_PARA_PARTIDA
    ));

    this._propriedades.push(new Imovel("Rua do Comércio", 1600, null, 150));
    this._inicializado = true;

  }

  public getPropriedades(): IPropriedade[] {
    return this._propriedades;
  }

  public getPropriedade(index: number): IPropriedade {
    return this._propriedades[index];
  }

  public getQuantidadePropriedades(): number {
    return this._propriedades.length;
  }

  public reiniciarTabuleiro(): void {
    this._propriedades = [];
    this._inicializado = false;

    this.iniciarTabuleiro();
  }
}

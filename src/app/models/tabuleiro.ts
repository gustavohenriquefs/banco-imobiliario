import { NomesLugaresEspeciais } from "../efeitos/lugar-especial.factory";
import { ILugarEspecialFactory } from "../efeitos/lugar-especial.factory.interface";
import { Empresa } from "./empresa";
import { Imovel } from "./imovel";
import { Propriedade } from "./propriedade";

export class Tabuleiro {
  private _propriedades: Propriedade[] = [];
  private _lugarEspecialFactory: ILugarEspecialFactory;

  constructor(lugarEspecialFactory: ILugarEspecialFactory) {
    this._lugarEspecialFactory = lugarEspecialFactory;
  }

  public iniciarTabuleiro(): void {
    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.PARTIDA
    ));

    this._propriedades.push(new Imovel("Av. Brasil", 200, null, 50));

    this._propriedades.push(new Empresa("Companhia de Eletricidade", 150, 50));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.IMPOSTO
    ));

    this._propriedades.push(new Imovel("Av. Paulista", 350, null, 100));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.VA_PARA_OUTRA_CASA
    ));

    this._propriedades.push(new Empresa("Companhia de Água", 150, 50));

    this._propriedades.push(new Imovel("Av. Atlântica", 400, null, 150));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.BONUS
    ));

    this._propriedades.push(new Empresa("Companhia de Transporte", 200, 75));

    this._propriedades.push(new Imovel("Av. Copacabana", 250, null, 75));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.PRISAO
    ));

    this._propriedades.push(new Imovel("Rua Augusta", 300, null, 90));

    this._propriedades.push(new Empresa("Companhia de Internet", 220, 80));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.IMPOSTO_PROGRESSIVO
    ));

    this._propriedades.push(new Imovel("Rua das Flores", 280, null, 85));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.VOLTE_X_CASAS
    ));

    this._propriedades.push(new Empresa("Companhia de Telefonia", 180, 65));

    this._propriedades.push(new Imovel("Rua Bela Vista", 320, null, 95));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.PERDA_SALDO
    ));

    this._propriedades.push(new Imovel("Rua Ouro Preto", 350, null, 105));

    this._propriedades.push(new Empresa("Companhia de Publicidade", 250, 90));

    this._propriedades.push(this._lugarEspecialFactory.criarLugarEspecial(
      NomesLugaresEspeciais.AVANCE_PARA_PARTIDA
    ));

    this._propriedades.push(new Imovel("Rua do Comércio", 500, null, 125));
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
import { Jogador } from "../models/jogador";
import { IEfeitoEspecial } from "./efeito-especial";

export class EfeitoImposto implements IEfeitoEspecial {
  aplicar(jogador: Jogador): void {
    console.log(`💸 ${jogador.nome} pagou R$ 200 em impostos!`);
    jogador.saldo -= 200;
  }
}
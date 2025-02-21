import { Jogador } from "../models/jogador";
import { IEfeitoEspecial } from "./efeito-especial";

export class EfeitoSorteOuReves implements IEfeitoEspecial {
  aplicar(jogador: Jogador): void {
    const sorte = Math.random() > 0.5;
    if (sorte) {
      console.log(`${jogador.nome} teve sorte e recebeu R$ 100!`);
      jogador.saldo += 100;
    } else {
      console.log(`${jogador.nome} teve azar e perdeu R$ 100!`);
      jogador.saldo -= 100;
    }
  }
}

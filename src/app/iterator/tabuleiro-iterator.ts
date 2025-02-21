import { IIterator } from "./iterator.interface";
import { Propriedade } from "../models/propriedade";

export class TabuleiroIterator implements IIterator<Propriedade> {
  private index: number = 0;

  constructor(private propriedades: Propriedade[]) {}

  hasNext(): boolean {
    return this.index < this.propriedades.length;
  }

  next(): Propriedade {
    return this.propriedades[this.index++];
  }
}
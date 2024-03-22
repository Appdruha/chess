import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import wB from '../../../../assets/alpha/wB.png'
import bB from '../../../../assets/alpha/bB.png'

export class Bishop extends Figure {
  constructor(color: FigureColor, cell: Cell) {
    super(color, cell)
    this.name = FigureNames.BISHOP
    this.color === 'WHITE' ? this.icon.src = wB : this.icon.src = bB
  }
}
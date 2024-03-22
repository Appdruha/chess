import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import wN from '../../../../assets/alpha/wN.png'
import bN from '../../../../assets/alpha/bN.png'

export class Knight extends Figure {
  constructor(color: FigureColor, cell: Cell) {
    super(color, cell)
    this.name = FigureNames.KNIGHT
    this.color === 'WHITE' ? this.icon.src = wN : this.icon.src = bN
  }
}
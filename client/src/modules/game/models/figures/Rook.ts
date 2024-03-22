import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import wR from '../../../../assets/alpha/wR.png'
import bR from '../../../../assets/alpha/bR.png'

export class Rook extends Figure {
  constructor(color: FigureColor, cell: Cell) {
    super(color, cell)
    this.name = FigureNames.ROOK
    this.color === 'WHITE' ? this.icon.src = wR : this.icon.src = bR
  }
}
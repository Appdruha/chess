import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import wP from '../../../../assets/alpha/wP.png'
import bP from '../../../../assets/alpha/bP.png'

export class Pawn extends Figure {
  isFirstStep = true
  constructor(color: FigureColor, cell: Cell) {
    super(color, cell)
    this.name = FigureNames.PAWN
    this.color === 'WHITE' ? this.icon.src = wP : this.icon.src = bP
  }
}
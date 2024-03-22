import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import wK from '../../../../assets/alpha/wK.png'
import bK from '../../../../assets/alpha/bK.png'

export class King extends Figure {
  isUnderAttack = false
  constructor(color: FigureColor, cell: Cell) {
    super(color, cell)
    this.name = FigureNames.KING
    this.color === 'WHITE' ? this.icon.src = wK : this.icon.src = bK
  }
}
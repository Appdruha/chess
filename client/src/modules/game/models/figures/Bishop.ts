import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import wB from '../../../../assets/alpha/wB.png'
import bB from '../../../../assets/alpha/bB.png'
import { KingAttacker } from '../../types/KingAttacker.ts'

export class Bishop extends Figure {
  constructor(color: FigureColor, cell: Cell) {
    super(color, cell)
    this.name = FigureNames.BISHOP
    this.color === 'WHITE' ? this.icon.src = wB : this.icon.src = bB
  }

  canMove(args: { target: Cell, cells: Cell[], kingAttacker?: KingAttacker }) {
    const { target, cells , kingAttacker} = args
    if (!super.canMove({ target, kingAttacker })) {
      return false
    }
    if (this.cell.isEmptyDiagonal(target, cells)) {
      return true
    }
    return false
  }
}
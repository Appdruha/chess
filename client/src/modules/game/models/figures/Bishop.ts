import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import { KingAttacker } from '../../types/KingAttacker.ts'

export class Bishop extends Figure {
  constructor(color: FigureColor, cell: Cell, src: { black: string, white: string }) {
    super(color, cell)
    this.name = FigureNames.BISHOP
    this.color === 'WHITE' ? this.icon.src = src.white : this.icon.src = src.black
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
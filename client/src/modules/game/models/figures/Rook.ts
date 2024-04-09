import { Figure, FigureColor } from './Figure.ts'
import { FigureNames } from '../../../../models/figure-names.ts'
import { Cell } from '../Cell.ts'
import { KingAttacker } from '../../types/KingAttacker.ts'

export class Rook extends Figure {
  isFirstStep = true

  constructor(color: FigureColor, cell: Cell, src: { black: string, white: string }) {
    super(color, cell)
    this.name = FigureNames.ROOK
    this.color === 'WHITE' ? this.icon.src = src.white : this.icon.src = src.black
  }

  canMove(args: { target: Cell, cells: Cell[], kingAttacker?: KingAttacker }) {
    const { target, cells, kingAttacker } = args
    if (!super.canMove({ target, kingAttacker })) {
      return false
    }
    if (this.cell.isEmptyVertical(target, cells)) {
      return true
    }
    if (this.cell.isEmptyHorizontal(target, cells)) {
      return true
    }
    return false
  }
}
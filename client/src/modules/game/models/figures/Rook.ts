import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import wR from '../../../../assets/alpha/wR.png'
import bR from '../../../../assets/alpha/bR.png'
import { KingAttacker } from '../../types/KingAttacker.ts'

export class Rook extends Figure {
  isFirstStep = true

  constructor(color: FigureColor, cell: Cell) {
    super(color, cell)
    this.name = FigureNames.ROOK
    this.color === 'WHITE' ? this.icon.src = wR : this.icon.src = bR
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
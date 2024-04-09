import { Figure, FigureColor } from './Figure.ts'
import { FigureNames } from '../../../../models/figure-names.ts'
import { Cell } from '../Cell.ts'
import { KingAttacker } from '../../types/KingAttacker.ts'

export class Pawn extends Figure {
  isFirstStep = true

  constructor(color: FigureColor, cell: Cell, src: { black: string, white: string }) {
    super(color, cell)
    this.name = FigureNames.PAWN
    this.color === 'WHITE' ? this.icon.src = src.white : this.icon.src = src.black
  }

  canMove(args: { target: Cell, cells: Cell[], kingAttacker?: KingAttacker }) {
    const { target, cells, kingAttacker } = args
    if (!super.canMove({ target, kingAttacker })) {
      return false
    }
    const direction = this.color === 'WHITE' ? -1 : 1
    const firstStepDirection = this.color === 'WHITE' ? -2 : 2
    const cellSideSize = this.cell.cellSideSize

    if ((target.y === this.cell.y + direction * cellSideSize || this.isFirstStep
        && (target.y === this.cell.y + firstStepDirection * cellSideSize))
      && target.x === this.cell.x && !target.figure && this.cell.isEmptyVertical(target, cells)) {
      return true
    }

    if (target.y === this.cell.y + direction * cellSideSize
      && (target.x === this.cell.x + cellSideSize || target.x === this.cell.x - cellSideSize)
      && target.figure) {
      return true
    }

    return false
  }
}
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

  canMove(args: { target: Cell, cells: Cell[] }) {
    const { target, cells } = args
    if (!super.canMove({ target })) {
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
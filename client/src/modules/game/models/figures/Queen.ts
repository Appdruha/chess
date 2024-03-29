import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import wQ from '../../../../assets/alpha/wQ.png'
import bQ from '../../../../assets/alpha/bQ.png'

export class Queen extends Figure {
  constructor(color: FigureColor, cell: Cell) {
    super(color, cell)
    this.name = FigureNames.QUEEN
    this.color === 'WHITE' ? this.icon.src = wQ : this.icon.src = bQ
  }

  canMove(args: { target: Cell, cells: Cell[] }) {
    const { target, cells } = args
    if (!super.canMove({ target })) {
      return false
    }
    if (this.cell.isEmptyVertical(target, cells)) {
      return true
    }
    if (this.cell.isEmptyHorizontal(target, cells)) {
      return true
    }
    if (this.cell.isEmptyDiagonal(target, cells)) {
      return true
    }
    return false
  }
}
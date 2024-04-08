import { Figure, FigureColor, FigureNames } from './Figure.ts'
import { Cell } from '../Cell.ts'
import { KingAttacker } from '../../types/KingAttacker.ts'

export class Knight extends Figure {
  constructor(color: FigureColor, cell: Cell, src: { black: string, white: string }) {
    super(color, cell)
    this.name = FigureNames.KNIGHT
    this.color === 'WHITE' ? this.icon.src = src.white : this.icon.src = src.black
  }

  canMove(args: { target: Cell, cells: Cell[], kingAttacker?: KingAttacker }) {
    const { target, kingAttacker } = args
    if (!super.canMove({ target, kingAttacker })) {
      return false
    }
    const dx = Math.abs(this.cell.x - target.x)
    const dy = Math.abs(this.cell.y - target.y)
    const cellSideSize = this.cell.cellSideSize

    return (dx === cellSideSize && dy === 2 * cellSideSize) || (dx === 2 * cellSideSize && dy === cellSideSize)
  }
}
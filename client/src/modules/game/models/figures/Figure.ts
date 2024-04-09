import { Cell } from '../Cell.ts'
import { KingAttacker } from '../../types/KingAttacker.ts'
import { FigureNames } from '../../../../models/figure-names.ts'

export type FigureColor = 'BLACK' | 'WHITE'

export class Figure {
  color: FigureColor
  cell: Cell
  name: FigureNames | null
  icon: HTMLImageElement

  constructor(color: FigureColor, cell: Cell) {
    this.color = color
    this.cell = cell
    this.name = null
    this.icon = new Image()
  }

  canMove(args: { target: Cell, cells?: Cell[], kingAttacker?: KingAttacker}): boolean {
    const {target, kingAttacker} = args
    if (kingAttacker && !kingAttacker.intermCells.includes(target)) {
      return false
    }
    return !(target.figure && target.figure.color === this.color)
  }
}
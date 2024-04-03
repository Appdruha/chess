import { Cell } from '../Cell.ts'

export enum FigureNames {
  KING = 'Король',
  KNIGHT = 'Конь',
  PAWN = 'Пешка',
  QUEEN = 'Ферзь',
  ROOK = 'Ладья',
  BISHOP = 'Слон',
}

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

  canMove(args: { target: Cell, cells?: Cell[] }): boolean {

    return !(args.target.figure && args.target.figure.color === this.color)
  }
}
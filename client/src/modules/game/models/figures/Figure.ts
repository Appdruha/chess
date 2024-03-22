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
  allowedCells: Cell[] | null

  constructor(color: FigureColor, cell: Cell) {
    this.color = color
    this.cell = cell
    this.name = null
    this.icon = new Image()
    this.allowedCells = null
  }

  setAllowedCells() {
  }

  moveFigure(target: Cell) {
  }
}
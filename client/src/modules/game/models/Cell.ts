import { Figure } from './figures/Figure.ts'
import { Colors } from './Colors.ts'

export class Cell {
  readonly x: number
  readonly y: number
  readonly color: Colors
  readonly id: string
  cellSideSize: number
  figure: Figure | null

  constructor(x: number, y: number, color: Colors, id: string, cellSideSize: number) {
    this.x = x
    this.y = y
    this.color = color
    this.id = id
    this.figure = null
    this.cellSideSize = cellSideSize
  }

  setFigure(figure: Figure) {
    this.figure = figure
    this.figure.cell = this
  }
}
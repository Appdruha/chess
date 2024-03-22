import { Figure } from './figures/Figure.ts'
import { Colors } from './Colors.ts'

export class Cell {
  readonly x: number
  readonly y: number
  readonly color: Colors
  readonly id: string
  figure: Figure | null

  constructor(x: number, y: number, color: Colors, id: string) {
    this.x = x
    this.y = y
    this.color = color
    this.id = id
    this.figure = null
  }

  setFigure(figure: Figure) {
    this.figure = figure
  }
}
import { Figure, FigureColor } from './Figure.ts'
import { Colors } from './Colors.ts'

export class Cell {
  readonly x: number
  readonly y: number
  readonly color: Colors
  figure: Figure | null
  figureColor: FigureColor | null

  constructor(x: number, y: number, color: Colors) {
    this.x = x
    this.y = y
    this.color = color
    this.figure = null
    this.figureColor = null
  }

  setFigure(figure: Figure) {
    this.figure = figure
    this.figureColor = figure.color
  }
}
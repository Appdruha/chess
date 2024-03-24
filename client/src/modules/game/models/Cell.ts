import { Figure } from './figures/Figure.ts'
import { Colors } from './Colors.ts'

export class Cell {
  readonly x: number
  readonly y: number
  readonly color: Colors
  readonly id: string
  readonly cellSideSize: number
  _figure: Figure | null

  constructor(x: number, y: number, color: Colors, id: string, cellSideSize: number) {
    this.x = x
    this.y = y
    this.color = color
    this.id = id
    this._figure = null
    this.cellSideSize = cellSideSize
  }

  get figure() {
    return this._figure
  }

  setFigure(figure: Figure | null) {
    if (figure) {
      this._figure = figure
      this._figure.cell = this
    } else {
      this._figure = null
    }
  }

  isEmptyVertical(target: Cell, cells: Cell[]): boolean {
    if (this.x !== target.x) {
      return false;
    }

    const min = Math.min(this.y, target.y);
    const max = Math.max(this.y, target.y);
    for (let y = min + this.cellSideSize; y < max; y += this.cellSideSize) {
      const cell = cells.find(cell => cell.x === target.x && cell.y === y)
      if(!cell || cell._figure) {
        return false
      }
    }
    return true;
  }

  isEmptyHorizontal(target: Cell, cells: Cell[]): boolean {
    if (this.y !== target.y) {
      return false;
    }

    const min = Math.min(this.x, target.x);
    const max = Math.max(this.x, target.x);
    for (let x = min + this.cellSideSize; x < max; x += this.cellSideSize) {
      const cell = cells.find(cell => cell.y === target.y && cell.x === x)
      if(!cell || cell._figure) {
        return false
      }
    }
    return true;
  }

  isEmptyDiagonal(target: Cell): boolean {
    const absX = Math.abs(target.x - this.x);
    const absY = Math.abs(target.y - this.y);
    if(absY !== absX)
      return false;

    const dy = this.y < target.y ? 1 : -1
    const dx = this.x < target.x ? 1 : -1

    for (let i = 1; i < absY; i++) {
      if(!this.board.getCell(this.x + dx*i, this.y + dy   * i).isEmpty())
        return false;
    }
    return true;
  }
}

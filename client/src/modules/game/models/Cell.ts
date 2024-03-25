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
      return false
    }

    const min = Math.min(this.y, target.y)
    const max = Math.max(this.y, target.y)
    for (let y = min + this.cellSideSize; y < max; y += this.cellSideSize) {
      const cell = cells.find(cell => cell.x === target.x && cell.y === y)
      if (!cell || cell._figure) {
        return false
      }
    }
    return true
  }

  isEmptyHorizontal(target: Cell, cells: Cell[]): boolean {
    if (this.y !== target.y) {
      return false
    }

    const min = Math.min(this.x, target.x)
    const max = Math.max(this.x, target.x)
    for (let x = min + this.cellSideSize; x < max; x += this.cellSideSize) {
      const cell = cells.find(cell => cell.y === target.y && cell.x === x)
      if (!cell || cell._figure) {
        return false
      }
    }
    return true
  }

  isEmptyDiagonal(target: Cell, cells: Cell[]): boolean {
    const absX = Math.abs(target.x - this.x)
    const absY = Math.abs(target.y - this.y)
    if (absY !== absX)
      return false

    const dy = this.y < target.y ? 1 : -1
    const dx = this.x < target.x ? 1 : -1

    for (let i = this.cellSideSize; i < absY; i += this.cellSideSize) {
      const cell = cells.find(cell => cell.y === this.y + dy * i && cell.x === this.x + dx * i)
      if (!cell || cell._figure) {
        return false
      }
    }
    return true
  }

  isUnderAttack(cells: Cell[], color: 'WHITE' | 'BLACK') {
    let isCellUnderAttack = false
    cells.forEach(cell => {
      if (cell.figure && cell.figure.color !== color && (cell.figure.name === 'Пешка' || cell.figure.canMove({
        target: this,
        cells,
      }))) {
        if (!(cell.figure.name === 'Пешка' && cell.x === this.x)) {
          if (cell.figure.name === 'Пешка' && this.y === cell.y + (cell.figure.color === 'BLACK' ? 1 : -1) * this.cellSideSize
            && (this.x === cell.x + this.cellSideSize || this.x === cell.x - this.cellSideSize)) {
            return isCellUnderAttack = true
          }
          if (cell.figure.name !== 'Пешка') {
            return isCellUnderAttack = true
          }
        }
      }
    })
    return isCellUnderAttack
  }
}

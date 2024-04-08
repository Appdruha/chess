import { Figure } from './figures/Figure.ts'
import { Colors } from './Colors.ts'
import { KingAttacker } from '../types/KingAttacker.ts'

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

  isUnderAttack(cells: Cell[], color: 'WHITE' | 'BLACK'): KingAttacker {
    let attackingFigure: KingAttacker = null
    cells.forEach(cell => {
      const figure = cell.figure
      if (figure && figure.color !== color && (figure.name === 'Пешка' || figure.canMove({
        target: this,
        cells,
      }))) {
        if (!(figure.name === 'Пешка' && cell.x === this.x)) {
          if (figure.name === 'Пешка' && this.y === cell.y + (figure.color === 'BLACK' ? 1 : -1) * this.cellSideSize
            && (this.x === cell.x + this.cellSideSize || this.x === cell.x - this.cellSideSize)) {
            return attackingFigure = { figure, intermCells: [cell] }
          }
          if (cell.figure.name !== 'Пешка') {
            let intermCells: Cell[] = []
            if (cell.x === this.x) {
              const maxY = Math.max(this.y, cell.y)
              const minY = Math.min(this.y, cell.y)
              intermCells = cells.filter(i => i.x === this.x && i.y <= maxY && i.y >= minY && i.y !== this.y)
            }
            if (cell.y === this.y) {
              const maxX = Math.max(this.x, cell.x)
              const minX = Math.min(this.x, cell.x)
              intermCells = cells.filter(i => i.y === this.y && i.x <= maxX && i.x >= minX && i.x !== this.x)
            }
            const absX = Math.abs(cell.x - this.x)
            const absY = Math.abs(cell.y - this.y)
            if (absY === absX) {
              const maxX = Math.max(this.x, cell.x)
              const minX = Math.min(this.x, cell.x)
              intermCells = cells
                .filter(i => i.x <= maxX && i.x >= minX && Math.abs(i.x - this.x) === Math.abs(i.y - this.y) && i.x !== this.x)
            }
            return attackingFigure = { figure, intermCells }
          }
        }
      }
    })
    return attackingFigure
  }
}

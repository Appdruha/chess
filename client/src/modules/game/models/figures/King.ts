import { Figure, FigureColor } from './Figure.ts'
import { FigureNames } from '../../../../models/figure-names.ts'
import { Cell } from '../Cell.ts'
import { Rook } from './Rook.ts'

export class King extends Figure {
  isFirstStep = true
  rookCastling: {from: string, to: string} | null = null
  isMyTurn: boolean

  constructor(color: FigureColor, cell: Cell, src: { black: string, white: string }) {
    super(color, cell)
    this.name = FigureNames.KING
    this.color === 'WHITE' ? this.icon.src = src.white : this.icon.src = src.black
    this.isMyTurn = false
  }

  canMove(args: { target: Cell, cells: Cell[] }) {
    const { target, cells } = args

    if (this.isMyTurn) {
      const figure = target.figure
      target.setFigure(null)
      if (target.isUnderAttack(cells, this.color)) {
        target.setFigure(figure)
        return false
      }
      target.setFigure(figure)
    }
    if (!super.canMove({ target })) {
      return false
    }
    const dx = Math.abs(this.cell.x - target.x)
    const dy = Math.abs(this.cell.y - target.y)
    if (this.cell.isEmptyVertical(target, cells) && dy === this.cell.cellSideSize) {
      return true
    }
    if (this.cell.isEmptyHorizontal(target, cells) && dx === this.cell.cellSideSize) {
      return true
    }
    if (this.cell.isEmptyDiagonal(target, cells) && dy === this.cell.cellSideSize && dx === this.cell.cellSideSize) {
      return true
    }
    if (this.isMyTurn && this.isFirstStep && !this.cell.isUnderAttack(cells, this.color) && this.cell.isEmptyHorizontal(target, cells)) {
      const cellSideSize = this.cell.cellSideSize
      const castling = (rookCell: Cell | undefined, dx: number) => {
        if (rookCell && rookCell.figure && rookCell.figure.name === 'Ладья') {
          const rook = rookCell.figure as Rook
          const newRookCell = cells.find(cell => cell.x === target.x - dx && cell.y === target.y)
          if (newRookCell && !newRookCell.isUnderAttack(cells, this.color) && rook.isFirstStep && rook.canMove({
            target,
            cells,
          })) {
            rook.isFirstStep = false
            this.rookCastling = {
              from: rookCell.id,
              to: newRookCell.id
            }
            return true
          } else {
            return false
          }
        }
      }
      let rookCell = cells.find(cell => cell.x === target.x + cellSideSize && cell.y === target.y)
      if (rookCell && castling(rookCell, cellSideSize)) {
        return true
      }
      rookCell = cells.find(cell => cell.x === target.x - cellSideSize * 2 && cell.y === target.y)
      if (rookCell && castling(rookCell, -cellSideSize)) {
        return true
      }
    }
    return false
  }
}
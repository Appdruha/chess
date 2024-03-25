import { MutableRefObject, MouseEvent } from 'react'
import { Pawn } from '../models/figures/Pawn.ts'
import { Knight } from '../models/figures/Knight.ts'
import { Bishop } from '../models/figures/Bishop.ts'
import { Rook } from '../models/figures/Rook.ts'
import { King } from '../models/figures/King.ts'
import { Queen } from '../models/figures/Queen.ts'
import { Cell } from '../models/Cell.ts'

interface HandleClickParams {
  selectedFigureRef: MutableRefObject<null | Pawn | Knight | Bishop | Rook | King | Queen>
  event: MouseEvent<HTMLCanvasElement>
  cells: Cell[] | null
  chessBoard: HTMLCanvasElement | null
  chessBoardPosition: null | {x: number, y: number}
  prevCellRef: MutableRefObject<Cell | null>
}

export const handleClick = ({ selectedFigureRef, event, cells, chessBoard, chessBoardPosition, prevCellRef }: HandleClickParams) => {
  if (cells && chessBoard && chessBoardPosition) {
    if (selectedFigureRef.current && prevCellRef.current) {
      const cell = cells.filter(cell => Math.abs(cell.x + chessBoardPosition.x + 40 - event.clientX) <= 40
        && Math.abs(cell.y + chessBoardPosition.y + 40 - event.clientY) <= 40)
      if (selectedFigureRef.current.canMove({target: cell[0], cells})) {
        cell[0].setFigure(selectedFigureRef.current)
        if (cell[0].figure?.name === 'Пешка') {
          const figure = cell[0].figure as Pawn
          figure.isFirstStep = false
        }
        if (cell[0].figure?.name === 'Ладья') {
          const figure = cell[0].figure as Rook
          figure.isFirstStep = false
        }
        if (cell[0].figure?.name === 'Король') {
          const figure = cell[0].figure as King
          figure.isFirstStep = false
        }
      } else {
        prevCellRef.current.setFigure(selectedFigureRef.current)
      }
      selectedFigureRef.current = null

    } else {
      const cell = cells.filter(cell => Math.abs(cell.x + chessBoardPosition.x + 40 - event.clientX) <= 40
        && Math.abs(cell.y + chessBoardPosition.y + 40 - event.clientY) <= 40)
      selectedFigureRef.current = cell[0].figure
      prevCellRef.current = cell[0]
      cell[0].setFigure(null)
    }
  } else {
    throw new Error('handleClick Error')
  }
}
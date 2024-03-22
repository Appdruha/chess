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
}

export const handleClick = ({ selectedFigureRef, event, cells, chessBoard, chessBoardPosition }: HandleClickParams) => {
  if (cells && chessBoard && chessBoardPosition) {
    if (selectedFigureRef.current) {
      const cell = cells.filter(cell => Math.abs(cell.x + chessBoardPosition.x + 40 - event.clientX) <= 40
        && Math.abs(cell.y + chessBoardPosition.y + 40 - event.clientY) <= 40)
      cell[0].figure = selectedFigureRef.current
      selectedFigureRef.current = null
    } else {
      const cell = cells.filter(cell => Math.abs(cell.x + chessBoardPosition.x + 40 - event.clientX) <= 40
        && Math.abs(cell.y + chessBoardPosition.y + 40 - event.clientY) <= 40)
      selectedFigureRef.current = cell[0].figure
      cell[0].figure = null
    }
  } else {
    throw new Error('handleClick Error')
  }
}
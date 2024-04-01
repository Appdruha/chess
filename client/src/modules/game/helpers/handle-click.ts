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
  webSocket: WebSocket | null
  roomId: string | undefined
}

export const handleClick = ({ selectedFigureRef, event, cells, chessBoard, chessBoardPosition, prevCellRef, webSocket, roomId }: HandleClickParams) => {
  if (cells && chessBoard && chessBoardPosition && webSocket && roomId) {
    if (selectedFigureRef.current && prevCellRef.current) {
      const cell = cells.find(cell => Math.abs(cell.x + chessBoardPosition.x + 40 - event.clientX) <= 40
        && Math.abs(cell.y + chessBoardPosition.y + 40 - event.clientY) <= 40)
      if (cell && selectedFigureRef.current.canMove({target: cell, cells})) {
        cell.setFigure(selectedFigureRef.current)
        const message = {
          type: 'message',
          params: {
            from: prevCellRef.current?.id,
            to: cell.id
          },
          roomId
        }
        webSocket.send(JSON.stringify(message))
        if (cell.figure?.name === 'Пешка' && cell.id !== prevCellRef.current?.id) {
          const figure = cell.figure as Pawn
          figure.isFirstStep = false
        }
        if (cell.figure?.name === 'Ладья' && cell.id !== prevCellRef.current?.id) {
          const figure = cell.figure as Rook
          figure.isFirstStep = false
        }
        if (cell.figure?.name === 'Король' && cell.id !== prevCellRef.current?.id) {
          const figure = cell.figure as King
          figure.isFirstStep = false
        }
      } else {
        prevCellRef.current.setFigure(selectedFigureRef.current)
      }
      selectedFigureRef.current = null

    } else {
      const cell = cells.find(cell => Math.abs(cell.x + chessBoardPosition.x + 40 - event.clientX) <= 40
        && Math.abs(cell.y + chessBoardPosition.y + 40 - event.clientY) <= 40)
      if (cell) {
        selectedFigureRef.current = cell.figure
        prevCellRef.current = cell
        cell.setFigure(null)
      }
    }
  } else {
    throw new Error('handleClick Error')
  }
}
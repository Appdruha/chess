import { MutableRefObject, MouseEvent } from 'react'
import { Pawn } from '../models/figures/Pawn.ts'
import { Knight } from '../models/figures/Knight.ts'
import { Bishop } from '../models/figures/Bishop.ts'
import { Rook } from '../models/figures/Rook.ts'
import { King } from '../models/figures/King.ts'
import { Queen } from '../models/figures/Queen.ts'
import { Cell } from '../models/Cell.ts'
import { Message } from '../../../types/Message.ts'
import { Player } from '../models/Player.ts'
import { KingAttacker } from '../types/KingAttacker.ts'

interface HandleClickParams {
  selectedFigureRef: MutableRefObject<null | Pawn | Knight | Bishop | Rook | King | Queen>
  event: MouseEvent<HTMLCanvasElement>
  cells: Cell[] | null
  chessBoard: HTMLCanvasElement | null
  chessBoardPosition: null | { x: number, y: number }
  prevCellRef: MutableRefObject<Cell | null>
  webSocket: WebSocket | null
  roomId: string | undefined
  player: Player | null
  kingAttackerRef: MutableRefObject<null | KingAttacker>
}

export const handleClick = ({
                              selectedFigureRef,
                              event,
                              cells,
                              chessBoard,
                              chessBoardPosition,
                              prevCellRef,
                              webSocket,
                              roomId,
                              player,
                              kingAttackerRef,
                            }: HandleClickParams) => {
  if (cells && chessBoard && chessBoardPosition && webSocket && roomId && player) {
    if (selectedFigureRef.current && prevCellRef.current) {
      const cell = cells.find(cell => Math.abs(cell.x + chessBoardPosition.x + 40 - event.clientX) <= 40
        && Math.abs(cell.y + chessBoardPosition.y + 40 - event.clientY) <= 40)
      if (cell && cell.id !== prevCellRef.current?.id && selectedFigureRef.current.canMove({
        target: cell,
        cells,
        kingAttacker: kingAttackerRef.current,
      })) {
        const message: Message = {
          type: 'move',
          params: {
            from: prevCellRef.current.id,
            to: cell.id,
          },
          roomId,
        }
        if (selectedFigureRef.current.name === 'Король') {
          const figure = selectedFigureRef.current as King
          figure.isFirstStep = false
          if (Math.abs(cell.x - prevCellRef.current?.x) > cell.cellSideSize && figure.rookCastling) {
            message.type = 'castling'
            if (message.params) {
              message.params = { ...message.params, from1: figure.rookCastling.from, to1: figure.rookCastling.to }
            }
          }
        }
        if (selectedFigureRef.current.name === 'Пешка') {
          const figure = selectedFigureRef.current as Pawn
          figure.isFirstStep = false
        }
        if (selectedFigureRef.current.name === 'Ладья') {
          const figure = selectedFigureRef.current as Rook
          figure.isFirstStep = false
        }
        webSocket.send(JSON.stringify(message))
      } else {
        prevCellRef.current.setFigure(selectedFigureRef.current)
        selectedFigureRef.current = null
      }
    } else if (player && player.isMyTurn) {
      const cell = cells.find(cell => Math.abs(cell.x + chessBoardPosition.x + 40 - event.clientX) <= 40
        && Math.abs(cell.y + chessBoardPosition.y + 40 - event.clientY) <= 40)
      if (cell && cell.figure && cell.figure.color === player.color) {
        selectedFigureRef.current = cell.figure
        prevCellRef.current = cell
        cell.setFigure(null)
      }
    }
  } else {
    throw new Error('handleClick Error')
  }
}
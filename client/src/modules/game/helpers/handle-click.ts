import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { Pawn } from '../models/figures/Pawn.ts'
import { Knight } from '../models/figures/Knight.ts'
import { Bishop } from '../models/figures/Bishop.ts'
import { Rook } from '../models/figures/Rook.ts'
import { King } from '../models/figures/King.ts'
import { Queen } from '../models/figures/Queen.ts'
import { Cell } from '../models/Cell.ts'
import { Message, MoveParams } from '../../../types/Message.ts'
import { Player } from '../models/Player.ts'
import { KingAttacker } from '../types/KingAttacker.ts'
import { ColorNames } from '../types/ColorNames.ts'

interface HandleClickParams {
  selectedFigureRef: MutableRefObject<null | Pawn | Knight | Bishop | Rook | King | Queen>
  cells: Cell[] | null
  chessBoard: HTMLCanvasElement | null
  clientPosition: null | { x: number, y: number }
  prevCellRef: MutableRefObject<Cell | null>
  webSocket: WebSocket | null
  roomId: string | undefined
  player: Player | null
  kingAttackerRef: MutableRefObject<null | KingAttacker>
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  changeFigureRef: MutableRefObject<null | { from: string, to: string }>
}

const findCell = (color: ColorNames, clientPosition: { x: number, y: number }, cells: Cell[]) => {
  if (color === 'BLACK') {
    return cells.find(cell => Math.abs(cell.x + 40 - (640 - clientPosition.x)) <= 40
      && Math.abs(cell.y + 40 - (640 - clientPosition.y)) <= 40)
  } else {
    return cells.find(cell => Math.abs(cell.x + 40 - clientPosition.x) <= 40
      && Math.abs(cell.y + 40 - clientPosition.y) <= 40)
  }
}

export const handleClick = ({
                              selectedFigureRef,
                              cells,
                              chessBoard,
                              clientPosition,
                              prevCellRef,
                              webSocket,
                              roomId,
                              player,
                              kingAttackerRef,
                              setIsModalOpen,
                              changeFigureRef,
                            }: HandleClickParams) => {
  if (cells && chessBoard && clientPosition && webSocket && roomId && player) {
    const cell = findCell(player.color, clientPosition, cells)
    if (selectedFigureRef.current && prevCellRef.current) {
      if (cell && cell.id !== prevCellRef.current?.id && selectedFigureRef.current.canMove({
        target: cell,
        cells,
        kingAttacker: kingAttackerRef.current,
      })) {
        if (selectedFigureRef.current.name === 'Пешка' && (cell.id.includes('1') || cell.id.includes('8'))) {
          changeFigureRef.current = {from: prevCellRef.current.id, to: cell.id}
          return setIsModalOpen(true)
        }
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
            const newMessageParams = message.params as MoveParams
            message.params = { ...newMessageParams, from1: figure.rookCastling.from, to1: figure.rookCastling.to }
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
        if (kingAttackerRef.current && kingAttackerRef.current.intermCells.includes(prevCellRef.current)) {
          kingAttackerRef.current = null
        }
        prevCellRef.current.setFigure(selectedFigureRef.current)
        selectedFigureRef.current = null
      }
    } else if (player && player.isMyTurn) {
      if (cell && cell.figure && cell.figure.color === player.color) {
        selectedFigureRef.current = cell.figure
        prevCellRef.current = cell
        cell.setFigure(null)
        if (!kingAttackerRef.current) {
          kingAttackerRef.current = player.king.cell.isUnderAttack(cells, player.color)
        }
      }
    }
  } else {
    throw new Error('handleClick Error')
  }
}
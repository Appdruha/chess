import { Pawn } from '../models/figures/Pawn.ts'
import { Rook } from '../models/figures/Rook.ts'
import { King } from '../models/figures/King.ts'
import { MutableRefObject } from 'react'
import { Knight } from '../models/figures/Knight.ts'
import { Bishop } from '../models/figures/Bishop.ts'
import { Queen } from '../models/figures/Queen.ts'
import { Cell } from '../models/Cell.ts'
import { Player } from '../models/Player.ts'
import { KingAttacker } from '../types/KingAttacker.ts'
import { Figure } from '../models/figures/Figure.ts'

interface HandleSocketMessageParams {
  selectedFigureRef: MutableRefObject<null | Pawn | Knight | Bishop | Rook | King | Queen>
  kingAttackerRef: MutableRefObject<null | KingAttacker>
  cells: Cell[] | null
  event: MessageEvent<any>
  player: Player | null
  webSocket: WebSocket | null
}

export const handleSocketMessage = ({
                                      cells,
                                      selectedFigureRef,
                                      event,
                                      player,
                                      kingAttackerRef,
                                      webSocket,
                                    }: HandleSocketMessageParams) => {
  if (JSON.parse(event.data).move && cells) {
    const cell = cells?.find(cell => cell.id === JSON.parse(event.data).move.to)!
    if (!selectedFigureRef.current) {
      const prevCell = cells?.find(cell => cell.id === JSON.parse(event.data).move.from)!
      const figure = prevCell.figure
      cell.setFigure(figure)
      prevCell.setFigure(null)
    } else {
      cell.setFigure(selectedFigureRef.current)
      selectedFigureRef.current = null
    }
    if (JSON.parse(event.data).move.toggleTurn && player) {
      player.isMyTurn = !player?.isMyTurn
      player.king.isMyTurn = player.isMyTurn
      kingAttackerRef.current = player.king.cell.isUnderAttack(cells, player.color)
      if (kingAttackerRef.current) {
        alert('ШАХ')
        const playerFigures = cells.filter(cell => cell.figure && cell.figure.color === player.color)
          .map(cell => cell.figure) as Figure[]
        const cellToPreventCheck = kingAttackerRef.current.intermCells.find(cell => {
          playerFigures.forEach(figure => {
            if (figure.canMove({ target: cell, cells, kingAttacker: kingAttackerRef.current })) {
              return true
            }
          })
        })
        if (!cellToPreventCheck) {
          if (webSocket) {
            websocket.send()
          }
        }
      }
    }
  }
}
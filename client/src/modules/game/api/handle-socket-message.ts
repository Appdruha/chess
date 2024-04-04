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
import { Message, MoveParams, PlayerParams } from '../../../types/Message.ts'

interface HandleSocketMessageParams {
  selectedFigureRef: MutableRefObject<null | Pawn | Knight | Bishop | Rook | King | Queen>
  kingAttackerRef: MutableRefObject<null | KingAttacker>
  cells: Cell[] | null
  event: MessageEvent<string>
  player: Player | null
  webSocket: WebSocket
  roomId: string | undefined
}

export const handleSocketMessage = ({
                                      cells,
                                      selectedFigureRef,
                                      event,
                                      player,
                                      kingAttackerRef,
                                      webSocket,
                                      roomId,
                                    }: HandleSocketMessageParams) => {
  const data = JSON.parse(event.data) as Message
  if (data.type === 'endGame') {
    const params = data.params as PlayerParams
    alert(`${params.color === 'WHITE' ? 'Белые' : 'Черные'} победили!`)
  }
  if (data.type === 'join') {
    const params = data.params as PlayerParams
    alert(`Игрок подключился к комнате ${data.roomId}, цвет ${params.color}`)
  }
  if (data.type === 'move' && cells && roomId) {
    const params = data.params as MoveParams
    const cell = cells.find(cell => cell.id === params.to)
    if (!cell)
      throw new Error('handle socket message error')
    if (!selectedFigureRef.current) {
      const prevCell = cells.find(cell => cell.id === params.from)
      if (!prevCell)
        throw new Error('handle socket message error')
      const figure = prevCell.figure
      cell.setFigure(figure)
      prevCell.setFigure(null)
    } else {
      cell.setFigure(selectedFigureRef.current)
      selectedFigureRef.current = null
    }
    if (params.toggleTurn && player) {
      player.isMyTurn = !player.isMyTurn
      player.king.isMyTurn = player.isMyTurn
      kingAttackerRef.current = player.king.cell.isUnderAttack(cells, player.color)
      if (kingAttackerRef.current) {
        console.log('ШАХ')
        const playerFigures = cells.filter(cell => cell.figure && cell.figure.color === player.color)
          .map(cell => cell.figure) as Figure[]
        const cellToPreventCheck = kingAttackerRef.current.intermCells.find(cell => {
          let result = false
          playerFigures.forEach(figure => {
            if (figure.canMove({ target: cell, cells, kingAttacker: kingAttackerRef.current })) {
              return result = true
            }
          })
          return result
        })
        if (!cellToPreventCheck) {
          const message: Message = {
            type: 'endGame',
            roomId,
            params: {color: player.color}
          }
          webSocket.send(JSON.stringify(message))
        }
      }
    }
  } else {
    throw new Error('handle socket message error')
  }
}
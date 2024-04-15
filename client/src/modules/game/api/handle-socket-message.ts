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
import { ChangeFigureParams, Message, MoveParams, PlayerParams } from '../../../types/Message.ts'
import wB from '/alpha/wB.png'
import bB from '/alpha/bB.png'
import rwB from '/rotated/wB.png'
import rbB from '/rotated/bB.png'
import wQ from '/alpha/wQ.png'
import bQ from '/alpha/bQ.png'
import rwQ from '/rotated/wQ.png'
import rbQ from '/rotated/bQ.png'
import wN from '/alpha/wN.png'
import bN from '/alpha/bN.png'
import rwN from '/rotated/wN.png'
import rbN from '/rotated/bN.png'
import wR from '/alpha/wR.png'
import bR from '/alpha/bR.png'
import rwR from '/rotated/wR.png'
import rbR from '/rotated/bR.png'

interface HandleSocketMessageParams {
  selectedFigureRef: MutableRefObject<null | Pawn | Knight | Bishop | Rook | King | Queen>
  kingAttackerRef: MutableRefObject<null | KingAttacker>
  cells: Cell[] | null
  event: MessageEvent<string>
  player: Player | null
  webSocket: WebSocket
  roomId: string | undefined
  setRestart: React.Dispatch<React.SetStateAction<boolean>>
  restart: boolean
}

export const handleSocketMessage = ({
                                      cells,
                                      selectedFigureRef,
                                      event,
                                      player,
                                      kingAttackerRef,
                                      webSocket,
                                      roomId,
                                      setRestart,
                                      restart,
                                    }: HandleSocketMessageParams) => {
  const data = JSON.parse(event.data) as Message
  const findKingAttacker = (toggleTurn: boolean | undefined, cells: Cell[], roomId: string) => {
    if (toggleTurn && player) {
      player.isMyTurn = !player.isMyTurn
      player.king.isMyTurn = player.isMyTurn
      kingAttackerRef.current = player.king.cell.isUnderAttack(cells, player.color)
      if (kingAttackerRef.current) {
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
            params: { color: player.color },
          }
          webSocket.send(JSON.stringify(message))
        }
      }
    }
  }
  if (data.type === 'endGame') {
    const params = data.params as PlayerParams
    alert(`${params.color === 'WHITE' ? 'Белые' : 'Черные'} победили!`)
  }
  if (data.type === 'restart') {
    const params = data.params as PlayerParams
    sessionStorage.setItem('color', params.color)
    setRestart(!restart)
  }
  if (data.type === 'error') {
    console.log(data)
  }
  if (data.type === 'join') {
    const params = data.params as PlayerParams
    alert(`Игрок подключился к комнате ${data.roomId}, цвет ${params.color}`)
  }
  if (data.type === 'changeFigure') {
    const params = data.params as ChangeFigureParams
    if (cells && player && roomId) {
      cells.find(cell => cell.id === params.from)?.setFigure(null)
      const newCell = cells.find(cell => cell.id === params.to)
      if (!newCell) {
        throw new Error('handle socket message error')
      }
      if (params.figureName === 'Ферзь') {
        newCell.setFigure(new Queen(params.figureColor, newCell, player.color === 'WHITE' ? {
          black: bQ,
          white: wQ,
        } : { black: rbQ, white: rwQ }))
      } else if (params.figureName === 'Конь') {
        newCell.setFigure(new Knight(params.figureColor, newCell, player.color === 'WHITE' ? {
          black: bN,
          white: wN,
        } : { black: rbN, white: rwN }))
      } else if (params.figureName === 'Слон') {
        newCell.setFigure(new Bishop(params.figureColor, newCell, player.color === 'WHITE' ? {
          black: bB,
          white: wB,
        } : { black: rbB, white: rwB }))
      } else if (params.figureName === 'Ладья') {
        newCell.setFigure(new Rook(params.figureColor, newCell, player.color === 'WHITE' ? {
          black: bR,
          white: wR,
        } : { black: rbR, white: rwR }))
      }
      if (selectedFigureRef.current) {
        selectedFigureRef.current = null
      }
      findKingAttacker(params.toggleTurn, cells, roomId)
    }
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
    findKingAttacker(params.toggleTurn, cells, roomId)
  } else {
    console.log(cells, roomId)
    throw new Error('handle socket message error')
  }
}
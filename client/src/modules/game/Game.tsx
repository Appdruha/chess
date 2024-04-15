import { useContext, useEffect, useRef, useState } from 'react'
import { chessBoardData } from './consts/canvas-data.ts'
import { initCells } from './helpers/init-cells.ts'
import styles from './game.module.css'
import { Cell } from './models/Cell.ts'
import { Colors } from './models/Colors.ts'
import { initAllFigures } from './helpers/init-figures.ts'
import { Pawn } from './models/figures/Pawn.ts'
import { Knight } from './models/figures/Knight.ts'
import { Bishop } from './models/figures/Bishop.ts'
import { Rook } from './models/figures/Rook.ts'
import { King } from './models/figures/King.ts'
import { Queen } from './models/figures/Queen.ts'
import { handleClick } from './helpers/handle-click.ts'
import { handleMouseMove } from './helpers/handle-mouse-move.ts'
import { WebSocketContext } from '../../app/web-socket-context.ts'
import { useParams } from 'react-router-dom'
import { handleSocketMessage } from './api/handle-socket-message.ts'
import { Player } from './models/Player.ts'
import { KingAttacker } from './types/KingAttacker.ts'
import { ColorNames } from './types/ColorNames.ts'
import { Modal } from '../../modal/Modal.tsx'
import { ChooseFigure } from '../choose-figure/Choose-figure.tsx'

export const Game = () => {
  const chessBoardRef = useRef<null | HTMLCanvasElement>(null)
  const chessBoardCtxRef = useRef<null | CanvasRenderingContext2D>(null)
  const cellsRef = useRef<null | Cell[]>(null)
  const prevCellRef = useRef<null | Cell>(null)
  const selectedFigureRef = useRef<null | Pawn | Knight | Bishop | Rook | King | Queen>(null)
  const clientPositionRef = useRef<{ x: number, y: number } | null>(null)
  const requestRef = useRef<undefined | number>(undefined)
  const chessBoardPositionRef = useRef<{ x: number, y: number } | null>(null)
  const playerRef = useRef<null | Player>(null)
  const changeFigureRef = useRef<null | { from: string, to: string }>(null)
  const kingAttackerRef = useRef<null | KingAttacker>(null)
  const roomId = useParams().roomId
  const webSocket = useContext(WebSocketContext) as WebSocket

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [restart, setRestart] = useState(false)

  webSocket.onmessage = (event) => {
    handleSocketMessage({
      event,
      cells: cellsRef.current,
      selectedFigureRef,
      player: playerRef.current,
      kingAttackerRef,
      webSocket,
      roomId,
      restart,
      setRestart
    })
  }

  const init = () => {
    if (chessBoardCtxRef.current) {
      const ctx = chessBoardCtxRef.current
      initCells({
        black: Colors.BLACK,
        white: Colors.WHITE,
        boardWidth: chessBoardData.width,
        cellsRef,
      })
      initAllFigures(cellsRef.current, sessionStorage.getItem('color') as ColorNames)
      if (sessionStorage.getItem('color') === 'BLACK') {
        ctx.translate(chessBoardData.width, chessBoardData.height)
        ctx.rotate(Math.PI)
      }
    } else {
      throw new Error('init Error')
    }
  }

  const drawAll = () => {
    if (chessBoardRef.current && chessBoardCtxRef.current && cellsRef.current) {
      const ctx = chessBoardCtxRef.current
      ctx.clearRect(0, 0, chessBoardData.width, chessBoardData.height)
      cellsRef.current.forEach(cell => {
        ctx.fillStyle = cell.color
        ctx.fillRect(cell.x, cell.y, cell.cellSideSize, cell.cellSideSize)
        if (cell.figure) {
          ctx.drawImage(cell.figure.icon, cell.x, cell.y)
        }
        cellsRef.current?.forEach(cell => {
          if (cell.figure) {
            cell.figure.icon.className = `${styles.rotatedFigure}`
          }
        })
      })
      if (clientPositionRef.current && selectedFigureRef.current && chessBoardRef.current && chessBoardPositionRef.current && playerRef.current) {
        if (playerRef.current.color === 'BLACK') {
          ctx.drawImage(selectedFigureRef.current.icon,
            640 - clientPositionRef.current.x - 40,
            640 - clientPositionRef.current.y - 40)
        } else {
          ctx.drawImage(selectedFigureRef.current.icon,
            clientPositionRef.current.x - chessBoardData.width / 16,
            clientPositionRef.current.y - chessBoardData.height / 16)
        }
      }
      requestRef.current = window.requestAnimationFrame(() => drawAll())
    } else {
      throw new Error('DrawAll Error')
    }
  }

  useEffect(() => {
    if (chessBoardRef.current) {
      chessBoardCtxRef.current = chessBoardRef.current.getContext('2d')
      chessBoardRef.current.width = chessBoardData.width
      chessBoardRef.current.height = chessBoardData.height
      init()
      requestRef.current = window.requestAnimationFrame(() => drawAll())
    } else {
      throw new Error('No canvas is found')
    }

    if (cellsRef.current && sessionStorage.getItem('color')) {
      const color = sessionStorage.getItem('color') as ColorNames
      const findKing = (cells: Cell[]) => {
        return cells.find(cell => cell.figure && cell.figure.name === 'Король' && cell.figure.color === color)?.figure as King
      }
      playerRef.current = new Player(color, findKing(cellsRef.current))
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(requestRef.current as number)
      cellsRef.current = null
      prevCellRef.current = null
      selectedFigureRef.current = null
      requestRef.current = undefined
      playerRef.current = null
      changeFigureRef.current = null
      kingAttackerRef.current = null
    }
  }, [restart])

  useEffect(() => {
    if (chessBoardRef.current) {
      const { x, y } = chessBoardRef.current.getBoundingClientRect()
      chessBoardPositionRef.current = { x, y }
    }
  }, [windowSize.height, windowSize.width])

  return (
    <div className={styles.chessBoardContainer}>
      <canvas ref={chessBoardRef}
              className={styles.chessBoard}
              onClick={() => handleClick({
                cells: cellsRef.current,
                chessBoard: chessBoardRef.current,
                selectedFigureRef,
                clientPosition: clientPositionRef.current,
                prevCellRef,
                webSocket,
                roomId,
                player: playerRef.current,
                kingAttackerRef,
                setIsModalOpen,
                changeFigureRef,
              })}
              onMouseMove={(event) => handleMouseMove({
                event,
                clientPositionRef,
                chessBoardPosition: chessBoardPositionRef.current,
              })}
      ></canvas>
      {isModalOpen &&
        <Modal>
          <ChooseFigure webSocket={webSocket} roomId={roomId} playerColor={playerRef.current?.color}
                        changeFigurePosition={changeFigureRef.current} setIsModalOpen={setIsModalOpen} />
        </Modal>
      }
    </div>
  )
}
import { useEffect, useRef } from 'react'
import { chessBoardData } from './consts/canvas-data.ts'
import { drawChessBoard } from './helpers/draw-chess-board.ts'
import styles from './game.module.css'
import { Cell } from './models/Cell.ts'
import { Colors } from './models/Colors.ts'
import { drawAllFigures } from './helpers/draw-figures.ts'

export const Game = () => {
  const chessBoardRef = useRef<null | HTMLCanvasElement>(null)
  const chessBoardCtxRef = useRef<null | CanvasRenderingContext2D>(null)
  const cellsRef = useRef<null | Cell[]>(null)

  const drawAll = () => {
    if (chessBoardRef.current && chessBoardCtxRef.current) {
      chessBoardCtxRef.current.clearRect(0, 0, chessBoardData.width, chessBoardData.height)
      drawChessBoard({
        black: Colors.BLACK,
        white: Colors.WHITE,
        ctx: chessBoardCtxRef.current,
        boardWidth: chessBoardData.width,
        cellsRef
      })
      drawAllFigures({ctx: chessBoardCtxRef.current, cells: cellsRef.current})
    }
  }

  useEffect(() => {
    if (chessBoardRef.current) {
      chessBoardCtxRef.current = chessBoardRef.current.getContext('2d')
      chessBoardRef.current.width = chessBoardData.width
      chessBoardRef.current.height = chessBoardData.height
      drawAll()
    } else {
      throw new Error('No canvas is found')
    }
  }, [])

  return (
    <div className={styles.chessBoardContainer}>
      <canvas ref={chessBoardRef} className={styles.chessBoard}></canvas>
    </div>
  )
}
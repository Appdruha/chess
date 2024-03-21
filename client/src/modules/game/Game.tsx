import { useEffect, useRef } from 'react'
import { chessBoardData } from './consts/canvas-data.ts'
import { drawChessBoard } from './helpers/draw-chess-board.ts'
import styles from './game.module.css'

export const Game = () => {
  const chessBoardRef = useRef<null | HTMLCanvasElement>(null)
  const chessBoardCtxRef = useRef<null | CanvasRenderingContext2D>(null)

  const drawAll = () => {
    if (chessBoardRef.current && chessBoardCtxRef.current) {
      drawChessBoard({
        black: chessBoardData.black,
        white: chessBoardData.white,
        ctx: chessBoardCtxRef.current,
        boardWidth: chessBoardData.width,
      })
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
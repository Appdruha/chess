import { useEffect, useRef } from 'react'
import { chessBoardSize } from '../consts/canvas-sizes.ts'


export const Game = () => {
  const chessBoardRef = useRef<null | HTMLCanvasElement>(null)
  const chessBoardCtxRef = useRef<null | CanvasRenderingContext2D>(null)

  const drawAll = () => {
    if (chessBoardRef && chessBoardCtxRef) {

    }
  }

  useEffect(() => {
    if (chessBoardRef.current !== null) {
      chessBoardCtxRef.current = chessBoardRef.current.getContext('2d')
      chessBoardRef.current.width = chessBoardSize.width
      chessBoardRef.current.height = chessBoardSize.height
    } else {
      throw new Error('No canvas is found')
    }
  }, [])

  return (
    <>
      <canvas></canvas>
    </>
  )
}
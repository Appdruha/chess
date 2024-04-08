import { MouseEvent, MutableRefObject } from 'react'

interface HandleMouseMoveParams {
  event: MouseEvent<HTMLCanvasElement>
  clientPositionRef: MutableRefObject<{ x: number, y: number } | null>
  chessBoardPosition: {x: number, y: number} | null
}

export const handleMouseMove = ({ event, clientPositionRef, chessBoardPosition }: HandleMouseMoveParams) => {
  if (!chessBoardPosition) {
    throw new Error('handleMouseMove Error')
  }
  clientPositionRef.current = {
    x: event.clientX - chessBoardPosition.x,
    y: event.clientY - chessBoardPosition.y
  }
}
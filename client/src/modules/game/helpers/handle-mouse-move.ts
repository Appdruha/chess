import { MouseEvent, MutableRefObject } from 'react'

interface HandleMouseMoveParams {
  event: MouseEvent<HTMLCanvasElement>
  clientPositionRef: MutableRefObject<{ x: number, y: number } | null>
}

export const handleMouseMove = ({ event, clientPositionRef }: HandleMouseMoveParams) => {
  clientPositionRef.current = { x: event.clientX, y: event.clientY }
}
import { MutableRefObject } from 'react'
import { Cell } from '../models/Cell.ts'
import { Colors } from '../models/Colors.ts'

enum Columns {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H
}

interface DrawChessBoardParams {
  black: Colors
  white: Colors
  ctx: CanvasRenderingContext2D | null
  boardWidth: number
  cellsRef: MutableRefObject<Cell[] | null>
}

export const drawChessBoard = ({black, white, ctx, boardWidth, cellsRef}: DrawChessBoardParams) => {
  if (ctx) {
    const cellSideSize = boardWidth / 8
    let nextCellColor = black
    cellsRef.current = []
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const x = i * cellSideSize
        const y =  560 - j * cellSideSize
        cellsRef.current.push(new Cell(x, y, nextCellColor, Columns[i] + (j + 1)))
        ctx.fillStyle = nextCellColor
        ctx.fillRect(x, y, cellSideSize, cellSideSize)
        if (j !== 7) {
          nextCellColor = nextCellColor === white ? black : white
        }
      }
    }
  } else {
    throw new Error('drawChessBoard Error')
  }
}
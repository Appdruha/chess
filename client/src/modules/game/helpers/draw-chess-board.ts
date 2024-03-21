interface DrawChessBoardParams {
  black: string
  white: string
  ctx: CanvasRenderingContext2D | null
  boardWidth: number
}

export const drawChessBoard = ({black, white, ctx, boardWidth}: DrawChessBoardParams) => {
  if (ctx) {
    const cellSideSize = boardWidth / 8
    let nextCellColor = white
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillStyle = nextCellColor
        ctx.fillRect(j * cellSideSize, i * cellSideSize, cellSideSize, cellSideSize)
        if (j !== 7) {
          nextCellColor = nextCellColor === white ? black : white
        }
      }
    }
  } else {
    throw new Error('drawChessBoard Error')
  }
}
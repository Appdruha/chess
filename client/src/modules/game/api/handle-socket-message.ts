import { Pawn } from '../models/figures/Pawn.ts'
import { Rook } from '../models/figures/Rook.ts'
import { King } from '../models/figures/King.ts'
import { MutableRefObject } from 'react'
import { Knight } from '../models/figures/Knight.ts'
import { Bishop } from '../models/figures/Bishop.ts'
import { Queen } from '../models/figures/Queen.ts'
import { Cell } from '../models/Cell.ts'

interface HandleSocketMessageParams {
  selectedFigureRef: MutableRefObject<null | Pawn | Knight | Bishop | Rook | King | Queen>
  cells: Cell[] | null
  event: MessageEvent<any>
}

export const handleSocketMessage = ({cells, selectedFigureRef, event}: HandleSocketMessageParams) => {
    if (JSON.parse(event.data).move) {
      const cell = cells?.find(cell => cell.id === JSON.parse(event.data).move.to)!
      if (!selectedFigureRef.current) {
        const prevCell = cells?.find(cell => cell.id === JSON.parse(event.data).move.from)!
        const figure = prevCell.figure
        cell.setFigure(figure)
        prevCell.setFigure(null)
      } else {
        cell.setFigure(selectedFigureRef.current)
        selectedFigureRef.current = null
      }
  }
}
import { Cell } from '../models/Cell.ts'
import { Pawn } from '../models/figures/Pawn.ts'
import { FigureNames } from '../models/figures/Figure.ts'
import { King } from '../models/figures/King.ts'
import { Queen } from '../models/figures/Queen.ts'
import { Bishop } from '../models/figures/Bishop.ts'
import { Knight } from '../models/figures/Knight.ts'
import { Rook } from '../models/figures/Rook.ts'

interface DrawAllFiguresParams {
  ctx: CanvasRenderingContext2D | null
  cells: Cell[] | null
}

interface DrawFiguresParams {
  cells: Cell[]
  ctx: CanvasRenderingContext2D
  color: 'WHITE' | 'BLACK'
  figureType: FigureNames
}

const drawFigures = ({ cells, ctx, color, figureType }: DrawFiguresParams) => {
  cells.forEach(cell => {
    if (figureType === 'Пешка') {
      cell.figure = new Pawn(color, cell)
    } else if (figureType === 'Ферзь') {
      cell.figure = new Queen(color, cell)
    } else if (figureType === 'Слон') {
      cell.figure = new Bishop(color, cell)
    } else if (figureType === 'Конь') {
      cell.figure = new Knight(color, cell)
    } else if (figureType === 'Ладья') {
      cell.figure = new Rook(color, cell)
    } else {
      cell.figure = new King(color, cell)
    }
    cell.figure.icon.onload = () => {
      if (cell.figure) {
        ctx.drawImage(cell.figure.icon, cell.x, cell.y)
      }
    }
  })
}

//ПЕРЕДЕЛАТЬ
export const drawAllFigures = ({ ctx, cells }: DrawAllFiguresParams) => {
  if (ctx && cells) {
    drawFigures({
      cells: cells.filter(cell => cell.id.includes('2')),
      ctx,
      figureType: FigureNames.PAWN,
      color: 'WHITE' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'E1'),
      ctx,
      figureType: FigureNames.KING,
      color: 'WHITE' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'D1'),
      ctx,
      figureType: FigureNames.QUEEN,
      color: 'WHITE' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'F1' || cell.id === 'C1'),
      ctx,
      figureType: FigureNames.BISHOP,
      color: 'WHITE' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'A1' || cell.id === 'H1'),
      ctx,
      figureType: FigureNames.ROOK,
      color: 'WHITE' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'B1' || cell.id === 'G1'),
      ctx,
      figureType: FigureNames.KNIGHT,
      color: 'WHITE' })
    drawFigures({
      cells: cells.filter(cell => cell.id.includes('7')),
      ctx,
      figureType: FigureNames.PAWN,
      color: 'BLACK' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'E8'),
      ctx,
      figureType: FigureNames.KING,
      color: 'BLACK' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'D8'),
      ctx,
      figureType: FigureNames.QUEEN,
      color: 'BLACK' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'F8' || cell.id === 'C8'),
      ctx,
      figureType: FigureNames.BISHOP,
      color: 'BLACK' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'A8' || cell.id === 'H8'),
      ctx,
      figureType: FigureNames.ROOK,
      color: 'BLACK' })
    drawFigures({
      cells: cells.filter(cell => cell.id === 'B8' || cell.id === 'G8'),
      ctx,
      figureType: FigureNames.KNIGHT,
      color: 'BLACK' })
  } else {
    throw new Error('drawFigures Error')
  }
}
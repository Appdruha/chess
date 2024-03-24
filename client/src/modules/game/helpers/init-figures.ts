import { Cell } from '../models/Cell.ts'
import { Pawn } from '../models/figures/Pawn.ts'
import { FigureNames } from '../models/figures/Figure.ts'
import { King } from '../models/figures/King.ts'
import { Queen } from '../models/figures/Queen.ts'
import { Bishop } from '../models/figures/Bishop.ts'
import { Knight } from '../models/figures/Knight.ts'
import { Rook } from '../models/figures/Rook.ts'

interface InitFiguresParams {
  cells: Cell[]
  color: 'WHITE' | 'BLACK'
  figureType: FigureNames
}

const initFigures = ({ cells, color, figureType }: InitFiguresParams) => {
  cells.forEach(cell => {
    if (figureType === 'Пешка') {
      cell.setFigure(new Pawn(color, cell))
    } else if (figureType === 'Ферзь') {
      cell.setFigure(new Queen(color, cell))
    } else if (figureType === 'Слон') {
      cell.setFigure(new Bishop(color, cell))
    } else if (figureType === 'Конь') {
      cell.setFigure(new Knight(color, cell))
    } else if (figureType === 'Ладья') {
      cell.setFigure(new Rook(color, cell))
    } else {
      cell.setFigure(new King(color, cell))
    }
  })
}

//ПЕРЕДЕЛАТЬ
export const initAllFigures = (cells: Cell[] | null) => {
  if (cells) {
    initFigures({
      cells: cells.filter(cell => cell.id.includes('2')),
      figureType: FigureNames.PAWN,
      color: 'WHITE' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'E1'),
      figureType: FigureNames.KING,
      color: 'WHITE' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'D1'),
      figureType: FigureNames.QUEEN,
      color: 'WHITE' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'F1' || cell.id === 'C1'),
      figureType: FigureNames.BISHOP,
      color: 'WHITE' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'A1' || cell.id === 'H1'),
      figureType: FigureNames.ROOK,
      color: 'WHITE' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'B1' || cell.id === 'G1'),
      figureType: FigureNames.KNIGHT,
      color: 'WHITE' })
    initFigures({
      cells: cells.filter(cell => cell.id.includes('7')),
      figureType: FigureNames.PAWN,
      color: 'BLACK' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'E8'),
      figureType: FigureNames.KING,
      color: 'BLACK' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'D8'),
      figureType: FigureNames.QUEEN,
      color: 'BLACK' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'F8' || cell.id === 'C8'),
      figureType: FigureNames.BISHOP,
      color: 'BLACK' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'A8' || cell.id === 'H8'),
      figureType: FigureNames.ROOK,
      color: 'BLACK' })
    initFigures({
      cells: cells.filter(cell => cell.id === 'B8' || cell.id === 'G8'),
      figureType: FigureNames.KNIGHT,
      color: 'BLACK' })
  } else {
    throw new Error('initFigures Error')
  }
}
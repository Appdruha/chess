import { Cell } from '../models/Cell.ts'
import { Pawn } from '../models/figures/Pawn.ts'
import { FigureNames } from '../models/figures/Figure.ts'
import { King } from '../models/figures/King.ts'
import { Queen } from '../models/figures/Queen.ts'
import { Bishop } from '../models/figures/Bishop.ts'
import { Knight } from '../models/figures/Knight.ts'
import { Rook } from '../models/figures/Rook.ts'
import { ColorNames } from '../types/ColorNames.ts'
import wB from '../../../assets/alpha/wB.png'
import bB from '../../../assets/alpha/bB.png'
import rwB from '../../../assets/rotated/wB.png'
import rbB from '../../../assets/rotated/bB.png'
import wP from '../../../assets/alpha/wP.png'
import bP from '../../../assets/alpha/bP.png'
import rwP from '../../../assets/rotated/wP.png'
import rbP from '../../../assets/rotated/bP.png'
import wQ from '../../../assets/alpha/wQ.png'
import bQ from '../../../assets/alpha/bQ.png'
import rwQ from '../../../assets/rotated/wQ.png'
import rbQ from '../../../assets/rotated/bQ.png'
import wN from '../../../assets/alpha/wN.png'
import bN from '../../../assets/alpha/bN.png'
import rwN from '../../../assets/rotated/wN.png'
import rbN from '../../../assets/rotated/bN.png'
import wR from '../../../assets/alpha/wR.png'
import bR from '../../../assets/alpha/bR.png'
import rwR from '../../../assets/rotated/wR.png'
import rbR from '../../../assets/rotated/bR.png'
import wK from '../../../assets/alpha/wK.png'
import bK from '../../../assets/alpha/bK.png'
import rwK from '../../../assets/rotated/wK.png'
import rbK from '../../../assets/rotated/bK.png'



interface InitFiguresParams {
  cells: Cell[]
  color: 'WHITE' | 'BLACK'
  figureType: FigureNames
  playerColor: ColorNames
}

const initFigures = ({ cells, color, figureType, playerColor }: InitFiguresParams) => {
  cells.forEach(cell => {
    if (figureType === 'Пешка') {
      cell.setFigure(new Pawn(color, cell, playerColor === 'WHITE' ? {black: bP, white: wP} : {black: rbP, white: rwP}))
    } else if (figureType === 'Ферзь') {
      cell.setFigure(new Queen(color, cell, playerColor === 'WHITE' ? {black: bQ, white: wQ} : {black: rbQ, white: rwQ}))
    } else if (figureType === 'Слон') {
      cell.setFigure(new Bishop(color, cell, playerColor === 'WHITE' ? {black: bB, white: wB} : {black: rbB, white: rwB}))
    } else if (figureType === 'Конь') {
      cell.setFigure(new Knight(color, cell, playerColor === 'WHITE' ? {black: bN, white: wN} : {black: rbN, white: rwN}))
    } else if (figureType === 'Ладья') {
      cell.setFigure(new Rook(color, cell, playerColor === 'WHITE' ? {black: bR, white: wR} : {black: rbR, white: rwR}))
    } else {
      cell.setFigure(new King(color, cell, playerColor === 'WHITE' ? {black: bK, white: wK} : {black: rbK, white: rwK}))
    }
  })
}

//ПЕРЕДЕЛАТЬ
export const initAllFigures = (cells: Cell[] | null, playerColor: ColorNames) => {
  if (cells) {
    initFigures({
      cells: cells.filter(cell => cell.id.includes('2')),
      figureType: FigureNames.PAWN,
      color: 'WHITE',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'E1'),
      figureType: FigureNames.KING,
      color: 'WHITE',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'D1'),
      figureType: FigureNames.QUEEN,
      color: 'WHITE',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'F1' || cell.id === 'C1'),
      figureType: FigureNames.BISHOP,
      color: 'WHITE',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'A1' || cell.id === 'H1'),
      figureType: FigureNames.ROOK,
      color: 'WHITE',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'B1' || cell.id === 'G1'),
      figureType: FigureNames.KNIGHT,
      color: 'WHITE',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id.includes('7')),
      figureType: FigureNames.PAWN,
      color: 'BLACK',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'E8'),
      figureType: FigureNames.KING,
      color: 'BLACK',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'D8'),
      figureType: FigureNames.QUEEN,
      color: 'BLACK',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'F8' || cell.id === 'C8'),
      figureType: FigureNames.BISHOP,
      color: 'BLACK',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'A8' || cell.id === 'H8'),
      figureType: FigureNames.ROOK,
      color: 'BLACK',
      playerColor
    })
    initFigures({
      cells: cells.filter(cell => cell.id === 'B8' || cell.id === 'G8'),
      figureType: FigureNames.KNIGHT,
      color: 'BLACK',
      playerColor
    })
  } else {
    throw new Error('initFigures Error')
  }
}
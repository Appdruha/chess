import { FigureNames } from '../models/figure-names.ts'
import { ColorNames } from '../modules/game/types/ColorNames.ts'

export interface MoveParams {
  toggleTurn?: boolean
  from: string
  to: string
  from1?: string
  to1?: string
}

export interface ChangeFigureParams extends Required<Omit<MoveParams, 'from1' | 'to1'>> {
  figureName: FigureNames
  figureColor: ColorNames
}

export interface PlayerParams {
  color: 'BLACK' | 'WHITE'
}

export interface Message {
  type: 'create' | 'join' | 'leave' | 'move' | 'castling' | 'changeFigure' | 'endGame' | 'error' | 'restart'
  params: MoveParams | PlayerParams | string | ChangeFigureParams | null
  roomId: string
}
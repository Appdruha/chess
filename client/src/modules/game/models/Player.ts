import { King } from './figures/King.ts'

export class Player {
  readonly color: 'WHITE' | 'BLACK'
  isCheck: boolean
  isMyTurn: boolean
  king: King

  constructor(color: 'WHITE' | 'BLACK', king: King) {
    this.color = color
    this.isCheck = false
    this.isMyTurn = color === 'WHITE'
    this.king = king
  }
}
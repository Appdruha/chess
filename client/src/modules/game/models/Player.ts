import { King } from './figures/King.ts'

export class Player {
  readonly color: 'WHITE' | 'BLACK'
  isMyTurn: boolean
  king: King

  constructor(color: 'WHITE' | 'BLACK', king: King) {
    this.color = color
    this.isMyTurn = color === 'WHITE'
    this.king = king
  }
}
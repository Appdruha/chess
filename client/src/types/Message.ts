export type MoveParams = {
  toggleTurn?: boolean
  from: string
  to: string
  from1?: string
  to1?: string
}

export type PlayerParams = { color: 'BLACK' | 'WHITE' }

export interface Message {
  type: 'create' | 'join' | 'leave' | 'move' | 'castling' | 'endGame' | 'error'
  params: MoveParams | PlayerParams | string | null
  roomId: string
}
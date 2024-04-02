export type MessageParams = {
  from: string
  to: string
  from1?: string
  to1?: string
} | null

export interface Message {
  type: 'create' | 'join' | 'leave' | 'move' | 'castling'
  params: MessageParams
  roomId: string
}
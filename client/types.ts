type MessageParams = {
  from: string
  to: string
} | null

export interface Message {
  type: 'create' | 'join' | 'leave' | 'message'
  params: MessageParams
  roomId: string
}
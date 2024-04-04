import { WebSocket, WebSocketServer } from 'ws'
import dotenv from 'dotenv'
import { v4 } from 'uuid'
import * as console from 'console'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
const PORT = process.env.PORT

interface MyWebSocket extends WebSocket {
  roomId: string | undefined
  color: 'BLACK' | 'WHITE'
}

type MoveParams = {
  toggleTurn: boolean
  from: string
  to: string
  from1?: string
  to1?: string
}

interface Message {
  type: 'create' | 'join' | 'leave' | 'move' | 'castling' | 'endGame' | 'error'
  params: MoveParams | { color: 'BLACK' | 'WHITE' } | null
  roomId: string
}

const wss = new WebSocketServer({
  port: PORT,
}, () => console.log(`Server started on port ${PORT}`))

const maxClients = 2
const rooms: Record<string, MyWebSocket[]> = {}

wss.on('connection', function connection(ws: MyWebSocket) {
  ws.on('message', function message(message) {
    const data: Message = JSON.parse(message.toString())

    const type = data.type
    const roomId = data.roomId

    switch (type) {
      case 'create': {
        const room = create()
        ws.send(JSON.stringify({ roomId: room, color: ws.color }))
        break
      }
      case 'join': {
        join(roomId)
        ws.send(JSON.stringify({ roomId, color: ws.color }))
        break
      }
      case 'leave': {
        leave(roomId)
        break
      }
      case 'move': {
        const params = data.params as MoveParams
        broadcastMessage({ from: params.from, to: params.to, toggleTurn: true }, roomId)
        break
      }
      case 'endGame': {
        broadcastMessage(null, roomId)
        break
      }
      case 'castling': {
        const params = data.params as MoveParams
        if (params && params.to1 && params.from1) {
          broadcastMessage({ from: params.from, to: params.to, toggleTurn: false }, roomId)
          broadcastMessage({ from: params.from1, to: params.to1, toggleTurn: true }, roomId)
        }
        break
      }
      default:
        console.warn(`Type: ${type} unknown`)
        break
    }
  })

  function create() {
    const roomId = v4()
    rooms[roomId] = [ws]
    ws.roomId = roomId
    ws.color = Math.random() < 0.5 ? 'WHITE' : 'BLACK'
    return roomId
  }

  function join(roomId: string) {
    if (!Object.keys(rooms).includes(roomId)) {
      console.warn(`Room ${roomId} does not exist!`)
      return
    }

    if (rooms[roomId].length >= maxClients) {
      console.warn(`Room ${roomId} is full!`)
      return
    }

    const existingPlayer = rooms[roomId][0] as MyWebSocket
    rooms[roomId].push(ws)
    ws.color = existingPlayer.color === 'WHITE' ? 'BLACK' : 'WHITE'
    ws.roomId = roomId
  }

  function leave(roomId: string) {
    rooms[roomId] = rooms[roomId].filter(so => so !== ws)
    ws.roomId = undefined

    if (rooms[roomId].length == 0)
      close(roomId)
  }

  function close(roomId: string) {
    delete rooms[roomId]
  }
})

function broadcastMessage(message: MoveParams, roomId: string) {
  wss.clients.forEach((ws) => {
    const client = ws as MyWebSocket
    if (client.roomId === roomId) {
      ws.send(JSON.stringify({ move: message }))
    }
  })
}

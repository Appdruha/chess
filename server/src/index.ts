import { WebSocket, WebSocketServer } from 'ws'
import dotenv from 'dotenv'
import { v4 } from 'uuid'
import * as console from 'console'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
const PORT = process.env.PORT

interface MyWebSocket extends WebSocket {
  roomId: string | undefined
}

type MessageParams = {
  from: string
  to: string
  from1?: string
  to1?: string
} | null

interface Message {
  type: 'create' | 'join' | 'leave' | 'move' | 'castling'
  params: MessageParams
  roomId: string
}

const wss = new WebSocketServer({
  port: PORT,
}, () => console.log(`Server started on port ${PORT}`))

const maxClients = 2
const rooms: Record<string, WebSocket[]> = {}

wss.on('connection', function connection(ws: MyWebSocket) {
  ws.on('message', function message(message) {
    const data: Message = JSON.parse(message.toString())

    const type = data.type
    const params = data.params
    const roomId = data.roomId

    switch (type) {
      case 'create':
        const room = create()
        ws.send(JSON.stringify({ roomId: room }))
        break
      case 'join':
        join(roomId)
        ws.send(JSON.stringify({ roomId }))
        break
      case 'leave':
        leave(roomId)
        break
      case 'move':
        if (params)
          broadcastMessage({from: params.from, to: params.to}, roomId)
        break
      case 'castling':
        if (params && params.to1 && params.from1) {
          broadcastMessage({ from: params.from, to: params.to }, roomId)
          broadcastMessage({ from: params.from1, to: params.to1 }, roomId)
        }
        break
      default:
        console.warn(`Type: ${type} unknown`)
        break
    }
  })

  function create() {
    const roomId = v4()
    rooms[roomId] = [ws]
    ws.roomId = roomId
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

    rooms[roomId].push(ws)
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

function broadcastMessage(message: MessageParams, roomId: string) {
  wss.clients.forEach((ws) => {
    const client = ws as MyWebSocket
    if (client.roomId === roomId) {
      ws.send(JSON.stringify({move: message}))
    }
  })
}

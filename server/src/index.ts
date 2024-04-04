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

type PlayerParams = { color: 'BLACK' | 'WHITE' }

interface Message {
  type: 'create' | 'join' | 'leave' | 'move' | 'castling' | 'endGame' | 'error'
  params: MoveParams | PlayerParams | string | null
  roomId: string
}

const wss = new WebSocketServer({
  port: PORT,
}, () => console.log(`Server started on port ${PORT}`))

const maxClients = 2
const rooms: Record<string, MyWebSocket[]> = {}

wss.on('connection', function connection(ws: MyWebSocket) {
  const messageForClient: Message = {
    type: 'create',
    roomId: '',
    params: null,
  }
  ws.on('message', function message(message) {
    const data: Message = JSON.parse(message.toString())
    const type = data.type
    const roomId = data.roomId

    switch (type) {
      case 'create': {
        messageForClient.type = 'create'
        messageForClient.roomId = create()
        messageForClient.params = { color: ws.color }
        ws.send(JSON.stringify(messageForClient))
        break
      }
      case 'join': {
        messageForClient.type = 'join'
        join(roomId)
        messageForClient.roomId = roomId
        messageForClient.params = { color: ws.color }
        broadcastMessage(messageForClient)
        break
      }
      case 'leave': {
        messageForClient.type = 'leave'
        messageForClient.roomId = roomId
        messageForClient.params = null
        leave(roomId)
        ws.send(JSON.stringify(messageForClient))
        break
      }
      case 'move': {
        const params = data.params as MoveParams
        messageForClient.type = 'move'
        messageForClient.roomId = roomId
        messageForClient.params = { from: params.from, to: params.to, toggleTurn: true }
        broadcastMessage(messageForClient)
        break
      }
      case 'endGame': {
        messageForClient.type = 'endGame'
        messageForClient.roomId = roomId
        messageForClient.params = { color: ws.color === 'WHITE' ? 'BLACK' : 'WHITE' }
        broadcastMessage(messageForClient)
        break
      }
      case 'castling': {
        const params = data.params as MoveParams
        messageForClient.type = 'move'
        messageForClient.roomId = roomId
        if (params && params.to1 && params.from1) {
          messageForClient.params = { from: params.from, to: params.to, toggleTurn: false }
          broadcastMessage(messageForClient)
          messageForClient.params = { from: params.from1, to: params.to1, toggleTurn: true }
          broadcastMessage(messageForClient)
        } else {
          messageForClient.type = 'error'
          messageForClient.params = 'Недостаточно данных'
          ws.send(JSON.stringify(messageForClient))
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
      messageForClient.type = 'error'
      messageForClient.params = `Комнаты с ${roomId} не существует`
      return ws.send(JSON.stringify(messageForClient))
    }

    if (rooms[roomId].length >= maxClients) {
      messageForClient.type = 'error'
      messageForClient.params = `Комната с ${roomId} переполнена`
      return ws.send(JSON.stringify(messageForClient))
    }

    const existingPlayer = rooms[roomId][0]
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

function broadcastMessage(message: Message) {
  wss.clients.forEach((ws) => {
    const client = ws as MyWebSocket
    if (client.roomId === message.roomId) {
      ws.send(JSON.stringify(message))
    }
  })
}

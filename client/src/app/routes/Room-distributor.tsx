import { useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { webSocketApi } from '../../api/web-socket.ts'
import { Message } from '../../../types.ts'
import { WebSocketContext } from '../web-socket-context.ts'

export const RoomDistributor = () => {
  let room = useParams().roomId
  const socket = useContext(WebSocketContext)
  const [isConnected, setIsConnected] = useState(false)
  const [roomId, setRoomId] = useState(room)

  useEffect(() => {
    if (!room) {
      const message: Message = {
        type: 'create',
        params: null,
        roomId: '',
      }
      webSocketApi(socket, setRoomId, setIsConnected, message)
    } else {
      const message: Message = {
        type: 'join',
        params: null,
        roomId: room,
      }
      webSocketApi(socket, setRoomId, setIsConnected, message)
    }
  }, [])

  if (!isConnected) {
    return <h1>LOADING...</h1>
  }
  return <Navigate to={roomId!} />
}
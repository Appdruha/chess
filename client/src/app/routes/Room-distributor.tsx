import { ReactNode, useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { webSocketApi } from '../../api/web-socket.ts'
import { Message } from '../../types/Message.ts'
import { WebSocketContext } from '../web-socket-context.ts'

export const RoomDistributor = (props: {children: ReactNode}) => {
  let room = useParams().roomId
  const socket = useContext(WebSocketContext)
  const [roomId, setRoomId] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!room) {
      const message: Message = {
        type: 'create',
        params: null,
        roomId: '',
      }
      webSocketApi(socket, setRoomId, message)
    } else {
      const message: Message = {
        type: 'join',
        params: null,
        roomId: room,
      }
      webSocketApi(socket, setRoomId, message)
    }
  }, [])

  if (!roomId) {
    return <h1>LOADING...</h1>
  }
  if (room) {
    return props.children
  }
  return <Navigate to={roomId!} />
}
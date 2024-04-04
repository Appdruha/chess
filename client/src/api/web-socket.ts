import { Message, PlayerParams } from '../types/Message.ts'

export const webSocketApi = (webSocket: WebSocket | null,
                             setRoomId: React.Dispatch<React.SetStateAction<string | undefined>>,
                             message: Message,
) => {
  if (webSocket) {
    webSocket.onopen = () => {
      webSocket.send(JSON.stringify(message))
    }
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data) as Message
      if (data.roomId && (data.type === 'create' || data.type === 'join')) {
        const params = data.params as PlayerParams
        setRoomId(data.roomId)
        sessionStorage.setItem('color', params.color)
        alert(`Вы подключились к комнате ${data.roomId}, цвет ${params.color}`)
      }
    }
    webSocket.onclose = () => {
      setRoomId(undefined)
      console.log('Socket закрыт')
    }
    webSocket.onerror = () => {
      console.log('Socket произошла ошибка')
    }
  }
}
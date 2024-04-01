import { Message } from '../../types.ts'

export const webSocketApi = (webSocket: WebSocket | null,
                             setRoomId: React.Dispatch<React.SetStateAction<string | undefined>>,
                             message: Message,
) => {
  if (webSocket) {
    webSocket.onopen = () => {
      webSocket.send(JSON.stringify(message))
    }
    webSocket.onmessage = (event) => {
      console.log(event.data)
      if (JSON.parse(event.data).roomId) {
        setRoomId(JSON.parse(event.data).roomId)
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
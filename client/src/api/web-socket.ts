import { Message } from '../../types.ts'

export const webSocketApi = (webSocket: WebSocket | null,
                             setRoomId: React.Dispatch<React.SetStateAction<string | undefined>>,
                             setIsConnected: React.Dispatch<React.SetStateAction<boolean>>,
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
        setIsConnected(true)
      }
    }
    webSocket.onclose = () => {
      setRoomId(undefined)
      setIsConnected(false)
      console.log('Socket закрыт')
    }
    webSocket.onerror = () => {
      console.log('Socket произошла ошибка')
    }
  }
}
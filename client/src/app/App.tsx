import './app.css'
import { RootRouter } from './routes/Root-router.tsx'
import {WebSocketContext} from './web-socket-context.ts'

export const App = () => {
  return (
    <WebSocketContext.Provider value={new WebSocket('ws://localhost:5000')}>
      <RootRouter />
    </WebSocketContext.Provider>
  )
}

import { Route, Routes } from 'react-router-dom'
import { Layout } from '../layout/Layout.tsx'
import { GamingRoomPage } from '../../pages/gaming-room-page/Gaming-room-page.tsx'
import { RoomDistributor } from './Room-distributor.tsx'

export const RootRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index path=':roomId?' element={<RoomDistributor><GamingRoomPage /></RoomDistributor>} />
      </Route>
    </Routes>
  )
}
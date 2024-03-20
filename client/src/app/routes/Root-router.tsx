import { Route, Routes } from 'react-router-dom'
import { Layout } from '../layout/Layout.tsx'
import { MainPage } from '../../pages/main-page/Main-page.tsx'

export const RootRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<MainPage/>}/>
      </Route>
    </Routes>
  )
}
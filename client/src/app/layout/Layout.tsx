import styles from './layout.module.css'
import { Footer } from '../../components/footer/Footer.tsx'
import { Header } from '../../components/header/Header.tsx'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
  return (
    <div className={styles.container}>
      <Header/>
      <main className={styles.main}>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
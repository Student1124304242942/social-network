import Header from '../../components/header/Header';
import Navbar from '../../components/Navbar/Navbar';
import cn from 'classnames';
import styles from './menuLayout.module.css'
import { Outlet } from 'react-router-dom';
import MbNav from '../../components/mobileNavbar/MbNav';

export default function NetworkLayout() {
  return (
    <div className={cn(styles.profileParent, 'bg-[#181818]')}>
        <header  className={cn("relative w-full flex items-center justify-center md:justify-between ", styles.header)}>
            <Navbar/>
            <Header/>
        </header>
        <main className={cn(styles.main)}><Outlet/></main>
        <div className={cn(styles.navbar, 'md:hidden flex overflow-hidden')}>
          <nav>
            <MbNav/>
          </nav>
        </div>
    </div>
  )
}

 

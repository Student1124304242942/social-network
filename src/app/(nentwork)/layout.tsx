import React from 'react';
import Header from '@/components/header/Header';
import Navbar from '@/components/Navbar/Navbar';
import cn from 'classnames';
import styles from './layout.module.css';
import { ReactNode } from 'react';
import MbNav from '@/components/mobileNavbar/MbNav';

export default function NetworkLayout({ children }: { children: ReactNode }) {
  return (
    <div className={cn(styles.profileParent, 'bg-[#181818]')}>
        <header  className={cn("relative w-full flex items-center justify-center md:justify-between ", styles.header)}>
            <Navbar/>
            <Header/>
        </header>
        <main className={cn(styles.main)}>{children}</main>
        <div className={cn(styles.navbar, 'md:hidden flex overflow-hidden')}>
          <nav>
            <MbNav/>
          </nav>
        </div>
    </div>
  )
}

 

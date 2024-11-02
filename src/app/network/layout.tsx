'use client';
import Header from '@/components/header/Header';
import { network } from '@/components/reducer/network';
import Navbar from '@/components/Navbar/Navbar';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import cn from 'classnames';
import styles from './layout.module.css'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={network}>
      <div className={cn(styles.profileParent, 'bg-[#181818]')}>
        <header  className={cn("relative w-full flex items-center justify-between ", styles.header)}>
          <Navbar/>
          <Header/>
        </header>
        <main className={cn(styles.main)}>{children}</main>
      </div>
    </Provider>
  );
}

export default Layout;

'use client'
import React, { ReactNode } from 'react';
import Image from 'next/image';
import { Provider } from 'react-redux';
import { network } from '@/components/reducer/network';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={network}>
      <div className="min-h-full flex bg-black">
        <div className="flex-1  relative  bg-black">
          {children}
        </div>
        <div className="flex-1 relative rounded-l-[50px] overflow-hidden z-10 md:flex hidden">
          <div className="absolute inset-0">
            <Image
              src="/auth.svg"
              alt="auth"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
   </Provider>
  );
};

export default Layout;

'use client';
import React, { ReactNode } from 'react';
import Image from 'next/image';
 

export default function AuthLayout ({ children }: { children: ReactNode }) {
    return (
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
    );
}
 
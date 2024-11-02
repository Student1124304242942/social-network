'use client';
import React, { useEffect, useState } from 'react';
import cl from 'classnames';
import Link from 'next/link';
import {  usePathname } from 'next/navigation';
import { LinkElementProps } from './Link.props';

const LinkElement = ({ children,  direction }: LinkElementProps) => {
    const path = usePathname();
    const [isActive, setIsActive] = useState<boolean>(false);
    useEffect(() => {
        setIsActive(path === direction);
    }, [path, direction]);

    return (
        <Link href={direction} className={cl({
            ['text-blue-600']: isActive,
            [' text-white']: !isActive,
        }, 'text-white hover:text-yellow-300 transition duration-200 text-[18px] flex items-center justify-center')}>
            {children}
        </Link>
    );
}

export default LinkElement;


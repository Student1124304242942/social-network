import { ReactNode } from 'react';

export interface HtagProps {
	tag: 'h1' | 'h2' | 'h3';
	children: ReactNode;
    appearance: 'bl' | 'wh';
    weight: 400 | 600 | 800;
    uppercase?: 'yes'
}
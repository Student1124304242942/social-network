import { HtagProps } from './Htag.props';
import styles from './Htag.styles';
import cn from 'classnames';

export const H = ({ tag, children,  appearance, weight, uppercase}: HtagProps): JSX.Element => {
	switch (tag) {
		case 'h1':
			return <h1 className={cn(styles.h1,'text-center', {
                [styles.black]: appearance === 'bl',
                ['text-white']: appearance === 'wh'
            },{
                [styles[400]]: weight === 400,
                [styles[600]]: weight === 600,
                [styles[800]]: weight === 800
            },
            {
                [styles.uppercase]: uppercase === 'yes'
            }
            )}>{children}</h1>;
		case 'h2':
			return <h2 className={cn(styles.h2, 'text-center', {
                [styles.black]: appearance === 'bl',
            }, {
                [styles[400]]: weight === 400,
                [styles[600]]: weight === 600,
                [styles[800]]: weight === 800 
            })}>{children}</h2>;
		case 'h3':
            return <h3 className={cn(styles.h3, 'text-center', {
                [styles.black]: appearance === 'bl',
            }, {
                [styles[400]]: weight === 400,
                [styles[600]]: weight === 600,
                [styles[800]]: weight === 800 
            })}>{children}</h3>;
		default:
			return <></>;
	}
};
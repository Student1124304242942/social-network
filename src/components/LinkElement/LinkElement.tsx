import cl from 'classnames';
import { NavLink } from 'react-router-dom';
import { LinkElementProps } from './Link.props';

const LinkElement = ({ children, direction }: LinkElementProps) => {
    return (
        <NavLink
            to={direction}
            className={({ isActive }) => cl({
                ['text-blue-600']: isActive,
                ['text-white']: !isActive,
            }, 'text-white hover:text-yellow-300 transition duration-200 text-[18px] flex items-center justify-center')}
        >
            {children}
        </NavLink>
    );
}

export default LinkElement;


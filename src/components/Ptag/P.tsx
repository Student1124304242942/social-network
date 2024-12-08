import { PProps } from "./P.props";
import cl from "classnames";
export const P = ({ color, children, ...props}: PProps): JSX.Element => {
	return (
		<p
			{...props}
			className={cl("sm:text-[18px] text-[14px] 3xl:text-[22px]", {
				'text-white': color === 'wh',
				'text-black': color === 'bl',
			})}
		>
			{children}
		</p>
	);
};
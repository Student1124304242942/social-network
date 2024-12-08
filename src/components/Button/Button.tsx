import { ButtonProps } from './Button.props';

const Button = ({children, ...props}: ButtonProps): JSX.Element => {
  return (
    <button {...props} className='w-full gap-[10px] bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all flex items-center justify-center text-center sm:text-[20px] text-[18px] 3xl:text-[24px]'>
      {children}
    </button>
  )
}

export default Button

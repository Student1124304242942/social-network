import { Outlet } from 'react-router-dom';
 
export default function AuthLayout () {
    return (
      <div className="min-h-full flex bg-black">
        <div className="flex-1  relative  bg-black">
          <Outlet/>
        </div>
        <div className="flex-1 relative rounded-l-[50px] overflow-hidden z-10 md:flex hidden">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/auth.svg"
              alt="auth"
              className='min-w-full'
            />
          </div>
        </div>
      </div>
    );
}
 
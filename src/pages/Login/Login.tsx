import Button from '../../components/Button/Button';
import React, { useEffect, useState } from 'react';
import { H } from '../../components/Htag/H';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { login, userActions } from '../../components/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../components/reducer/network';
import { RootState } from '../../components/reducer/network';
import { useNavigate } from 'react-router-dom';
interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [inputFocus, setInputFocus] = useState<Record<string,boolean>>({});
  const {logged, userId} = useSelector((s:RootState) =>  s.user);
  
  useEffect(() => {
    if (logged){
      router('/');
    } 
  }, [router, logged, userId])
  

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(userActions.clearLoginError());
    await sendLogin();
  }

  const sendLogin = async () => {
    const {email, password} = formData;
    dispatch(login({
      email,
      password
    }));
  };
  const handleChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [field]: event.target.value});
    setInputFocus({...inputFocus, [field]: event.target.value !== ''});
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-[325px] sm:w-[380px] 3xl:w-[460px] min-h-[420px]  bg-white rounded-lg overflow-hidden">
        <div className="absolute inset-2 top-[-50%] left-[-50%] bg-gradient-to-b from-white to-blue-300 animate-spin-slow w-[390px] h-[430px] origin-bottom-right"></div>
        <form className="absolute inset-1 bg-white rounded-lg py-[30px] px-[20px] flex flex-col gap-[20px]" onSubmit={handleSubmit}>
          <H appearance='bl' tag='h1' weight={600}>Войти в аккаунт</H>
          <div>
            {['email', 'password'].map((field, index) => (
              <div key={index} className="relative mb-8 border-b border-white">
                <input
                type={field === 'email' ? 'email': 'password'}
                required
                className='relative w-full py-5 px-2 bg-transparent border-none outline-none text-white z-10 sm:text-[18px] text-[16px] 3xl:text-[22px]'
                value={formData[field as keyof FormData]}
                onFocus={() => setInputFocus({ ...inputFocus, [field]: true })}
                onBlur={() => setInputFocus({ ...inputFocus, [field]: formData[field as keyof FormData] !== '' })}
                onChange={handleChange(field as keyof FormData)}
                />
                <span className={cn('absolute left-0 px-2 text-aqua transition-transform duration-500 pointer-events-none sm:text-[18px] text-[16px] 3xl:text-[22px]', {
                  'transform -translate-y-4 scale-75 text-white': inputFocus[field as keyof FormData]
                })}>
                  {field === 'email' ? 'Твой email ?': 'пароль'}
                </span>
                <i className={cn('absolute left-0 bottom-0 w-full transition-all duration-500 overflow-hidden bg-black rounded-[5px]', {
                'h-11': inputFocus[field as keyof FormData],
                'h-0.5': !inputFocus[field as keyof FormData]
                })} />
              </div>
            ))}
          </div>
          <div className='w-full'>
            <div className="flex justify-between mb-6">
              <Link to='/register' className="text-gray-400 hover:text-black transition duration-500">нету аккаунта ?</Link>
            </div>
            <Button>Войти</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
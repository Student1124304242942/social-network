import Button from '../../components/Button/Button';
import React, { useEffect, useState } from 'react';
import { H } from '../../components/Htag/H';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { register, userActions } from '../../components/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../components/reducer/network';
import { RootState } from '../../components/reducer/network';
import { useNavigate } from 'react-router-dom';
import { Countries } from './Countries/Countries';
interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number; 
  skills: string[] | undefined;  
  country: string;
  customCountry: string;
}

const RegisterPage = () => {
  const router = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: 0,  
    skills: undefined,  
    country: '',
    customCountry: ''
  });
  const [isCustomCountry, setIsCustomCountry] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState<Record<string, boolean>>({});
  const { logged  } = useSelector((s: RootState) => s.user);
  
  useEffect(() => {
    if (logged ) {
      router('/profiles');
    }
  }, [router, logged]) 

  const handleChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
    setInputFocus({ ...inputFocus, [field]: event.target.value !== '' });
  };

  const handleSkillsChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Renamed function
    const skillsInput = event.target.value;
    const skillsArray = skillsInput.split(' '); // Updated here
    setFormData({ ...formData, skills: skillsArray });  // Updated here
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, country: value });
    setIsCustomCountry(value === 'custom');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(userActions.clearRegisterError());
    await sendRegister();
  };

  const sendRegister = async () => {
    const { email, password, firstName, lastName, country, customCountry, age, skills } = formData;
    await dispatch(register({
      email,
      password,
      firstName,
      lastName,
      country: isCustomCountry ? customCountry : country,
      skills,
      age   
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-full relative">
      <div className="relative w-[325px] sm:w-[380px] 3xl:w-[480px] min-h-[1050px] bg-[#000000] rounded-lg overflow-hidden">
        <form className="absolute inset-1 bg-white rounded-lg py-[30px] px-[20px] flex flex-col gap-[20px]" onSubmit={handleSubmit}>
          <H appearance='bl' tag='h1' weight={600}>Создать аккаунт</H>
          {['email', 'lastName', 'firstName', 'password', 'age'].map((field, index) => ( // Updated here
            <div key={index} className="relative mb-8 border-b border-white">
              <input
                type={field === 'password' ? 'password' : field === 'age' ? 'number' : 'text'} // Updated here
                required
                className="relative w-full py-5 px-2 bg-transparent border-none outline-none text-white z-10 sm:text-[18px] text-[16px] 3xl:text-[22px]"
                value={formData[field as keyof FormData]}
                onFocus={() => setInputFocus({ ...inputFocus, [field]: true })}
                onBlur={() => setInputFocus({ ...inputFocus, [field]: formData[field as keyof FormData] !== '' })}
                onChange={handleChange(field as keyof FormData)}
              />
              <span className={cn('absolute left-0 px-2 text-aqua transition-transform duration-500 pointer-events-none ', {
                'transform -translate-y-4 scale-75 text-white': inputFocus[field as keyof FormData]
              })}>
                {field === 'email' ? 'Твой email ?' :
                  field === 'lastName' ? 'Фамилия ?' :
                    field === 'firstName' ? 'Имя ?' :
                      field === 'password' ? 'Придумай пароль' :
                        field === 'age' ? 'Возраст' :  
                          'Навыки ?'}
              </span>
              <i className={cn('absolute left-0 bottom-0 w-full transition-all duration-500 overflow-hidden bg-black rounded-[5px] sm:text-[18px] text-[16px] 3xl:text-[22px]', {
                'h-11': inputFocus[field as keyof FormData],
                'h-0.5': !inputFocus[field as keyof FormData]
              })} />
            </div>
          ))}
          <div className="relative mb-8 border-b border-white">
            <input
              type='text'
              required
              className="relative w-full py-5 px-2 bg-transparent border-none outline-none text-white z-10 sm:text-[18px] text-[16px] 3xl:text-[22px]"
              onChange={handleSkillsChange} // Updated here
              value={formData.skills} // Updated here
              onFocus={() => setInputFocus({ ...inputFocus, skills: true })} // Updated here
              onBlur={() => setInputFocus({ ...inputFocus, skills: formData.skills !== undefined })} // Updated here
            />
            <span className={cn('absolute left-0 px-2 text-aqua transition-transform duration-500 pointer-events-none', {
              'transform -translate-y-4 scale-75 text-white': inputFocus['skills'] // Updated here
            })}>
              skills
            </span>
            <i
              className={cn('absolute left-0 bottom-0 w-full transition-all duration-500 overflow-hidden bg-black rounded-[5px] sm:text-[18px] text-[16px] 3xl:text-[22px]', {
                'h-11': inputFocus['skills'], // Updated here
                'h-0.5': !inputFocus['skills'] // Updated here
              })}
            />
          </div>
          <div className="relative mb-8 border-b border-white">
            {!isCustomCountry && (
              <select
                required
                value={formData.country}
                onChange={handleCountryChange}
                className="relative w-full py-5 px-2 bg-transparent border-none outline-none text-white z-10 sm:text-[18px] text-[16px] 3xl:text-[22px]"
              >
                {Countries.map((c) => (
                  <option key={c.value} value={c.value} className="bg-white text-black">
                    {c.label}
                  </option>
                ))}
              </select>
            )}
            <span className={cn('absolute left-0 px-2 text-aqua transition-transform duration-500 pointer-events-none', {
              'transform -translate-y-4 scale-75 text-white': formData.country !== ''
            })}>
              Страна ?
            </span>
            <i className={cn('absolute left-0 bottom-0 w-full transition-all duration-500 overflow-hidden bg-black rounded-[5px] sm:text-[18px] text-[16px] 3xl:text-[22px]', {
              'h-11': formData.country !== '',
              'h-0.5': formData.country === ''
            })} />
            {isCustomCountry && (
              <input
                type="text"
                required
                className="relative w-full py-5 px-2 bg-transparent border-none outline-none text-white z-10 sm:text-[18px] text-[16px] 3xl:text-[22px]"
                value={formData.customCountry}
                onChange={handleChange('customCountry')}
                onFocus={() => setInputFocus({ ...inputFocus, customCountry: true })}
                onBlur={() => setInputFocus({ ...inputFocus, customCountry: formData.customCountry !== '' })}
              />
            )}
          </div>
          <Button type="submit">Зарегистрироваться</Button>
          <div className="text-center">
            <p>Уже есть аккаунт? <Link to="/login" className="text-blue-500 sm:text-[16px] text-[14px] 3xl:text-[20px]">Войти</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
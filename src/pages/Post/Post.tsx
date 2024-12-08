import React, { useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import { H } from '../../components/Htag/H';
import cn from 'classnames';
import { post } from '../../components/reducer/post';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../components/reducer/network';

export interface FormValues {
  title: string;
  text: string;
}

export interface FormValidation {
  title: boolean;
  text: boolean;
}

const PostPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isValid, setIsValid] = useState<FormValidation>({ title: false, text: false });
  const [values, setValues] = useState<FormValues>({ title: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsValid((prev) => ({ ...prev, [name]: value.trim() !== '' }));
  };

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();    
    if (!isValid.title) {
      titleRef.current?.focus();
      return;
    }

    if (!isValid.text) {
      textRef.current?.focus();
      return;
    }
    await sendPost();
    setValues({ title: '', text: '' });
    setIsValid({ title: false, text: false });
  };
  const sendPost = async () => {
    const { text, title } = values;
    await dispatch(post({ text, title }));
  };

  return (
    <div className='min-h-screen flex flex-col items-center gap-8 px-4 pt-10 bg-gray-100 text-white'>
      <H tag='h1' appearance='bl' weight={600}>
        Твой пост
      </H>
      <form className='min-w-full max-w-lg flex flex-col gap-4 items-center' onSubmit={addPost}>
        <input 
          name="title"
          value={values.title}
          onChange={handleChange}
          ref={titleRef}
          type='text' 
          placeholder='Название поста' 
          className={cn('w-full py-3 px-4 text-lg rounded-md border-2 transition duration-300', {
            'border-red-600 bg-red-500 focus:outline-none': !isValid.title,
            'border-gray-400 bg-gray-800 focus:border-blue-500': isValid.title
          })} 
        />
        <textarea 
          name="text"
          value={values.text}
          onChange={handleChange} 
          ref={textRef} 
          className={cn('min-h-[250px] w-full rounded-md border-2 transition duration-300 text-lg resize-none', {
            'border-red-600 bg-red-500 focus:outline-none': !isValid.text,
            'border-gray-400 bg-gray-800 focus:border-blue-500': isValid.text
          })} 
          placeholder="Ваш отзыв здесь..." 
          required 
        />
        <Button type='submit' className='mt-4 bg-blue-600 hover:bg-blue-700 transition duration-300'>
          Добавить
        </Button>
      </form>
    </div>
  );
};

export default PostPage;
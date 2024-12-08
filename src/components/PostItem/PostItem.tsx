import React, { useState, useEffect } from 'react';
import { H } from '../Htag/H';
import { P } from '../Ptag/P';
import { DivProps } from './PostItem.props';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../reducer/network';
import { deletePost, correctPost } from '../reducer/post';
import { FormValues, FormValidation } from '../../pages/Post/Post';

const PostItem = ({ postId, title, children, time, onDelete, ...props }: DivProps & { time: number }): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<FormValidation>({
    title: true,
    text: true,
  });
  const [newValue, setNewValue] = useState<FormValues>({
    text: children,
    title: title,
  });

  const handleToggleInput = () => {
    if (!input) {
      setNewValue({
        text: children,
        title: title,
      });
    }
    setInput(prev => !prev);
  };

  const setValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewValue((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsValid((prev) => ({
      ...prev,
      [name]: value.trim() !== '',
    }));
  };

  const handleDeletePost = async () => {
    dispatch(deletePost({ postId }));
    if (onDelete) {
      onDelete(postId);
    }
  };

  const sendUpdatePost = async () => {
    if (!isValid.text || !isValid.title) {
      return;
    }
    const { text, title } = newValue;
    try {
      await dispatch(correctPost({ postId, updateText: text, updateTitle: title }));
      setNewValue({ text, title });
    } catch (error) {
      console.error('Error updating post:', error);
    }
    setInput(false);
  };

  useEffect(() => {
    setNewValue({ text: children, title });
  }, [children, title]);
 
  const formattedTime = new Intl.DateTimeFormat('ru-RU').format(time); 
  return (
    <div 
      {...props} 
      className='flex flex-col gap-4 bg-white shadow-lg rounded-lg p-5 relative transition-all duration-300 hover:shadow-xl hover:shadow-blue-300'
    >
      <div className='mt-5'>
        {!input ? (
          <>
            <H tag='h3' appearance='bl' weight={600}>{newValue.title}</H>
            <p className="text-gray-500 text-sm">{formattedTime}</p> {/* Отображение времени */}
          </>
        ) : (
          <input 
            className='bg-gray-200 border border-gray-400 rounded-md p-2  focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-w-full'
            type='text' 
            name='title' 
            onChange={setValue} 
            value={newValue.title} 
          />
        )}
      </div>
      <div className="min-h-[150px]">
        {!input ? (
          <P color='bl'>{newValue.text}</P>
        ) : (
          <textarea 
            className='bg-gray-200 border border-gray-400 rounded-md p-2 w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition' 
            name='text' 
            value={newValue.text} 
            onChange={setValue} 
          />
        )}
      </div>
      <div 
        className="absolute top-4 right-4 cursor-pointer hover:text-red-600 transition" 
        onClick={handleDeletePost}
      >
        <img src='/close.svg' alt="Close" className='w-6 h-6' />
      </div>
      <div 
        onClick={sendUpdatePost} 
        className="absolute bottom-4 right-4 cursor-pointer hover:text-blue-600 transition"
      >
        <img src='/Change.svg' alt="Change" className='w-6 h-6' />
      </div>
      <div 
        onClick={handleToggleInput} 
        className="absolute bottom-4 left-4 cursor-pointer text-blue-600 hover:underline transition"
      >
        {input ? 'Cancel' : 'Edit'}
      </div>
    </div>
  );
};

export default PostItem;

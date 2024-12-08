import   { useState, useEffect } from 'react';
import { H } from '../Htag/H';
import { P } from '../Ptag/P';
import { DivProps } from './PostItem.props';
import { FormValues } from '../../pages/Post/Post';

const PostItem2 = ({  title, children, time, ...props }: DivProps & { time: number }): JSX.Element => {
  const [input, setInput] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<FormValues>({
    text: children,
    title: title,
  });

  const handleToggleInput = () => {
    setInput(prev => !prev);
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
          />
        )}
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

export default PostItem2;

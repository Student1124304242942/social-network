import React from 'react';
import { RecipientProps } from './Recipient.props';
import { H } from '../Htag/H';
 
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../reducer/network';
import { deleteChat } from '../reducer/chat';
import { Link } from 'react-router-dom';
import { loadState } from '../reducer/storage';
 

const Recipient = ({ id, userName, userAvatar, update }: RecipientProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = loadState('userID') as string;

  const handleClick = async () => {
    if (id) {
      await dispatch(deleteChat({ recipientId: id }));
      update(id);
    }
  };

  return (
    <Link to={`/chats/${id}${userId}`}
      key={id}
      className="flex items-center cursor-pointer relative justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out min-w-full"
    >
      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 overflow-hidden rounded-full relative border-2 border-gray-300">
          <img
            src={userAvatar}
            alt={userName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div>
          <H appearance="bl" tag="h3" weight={600}>{userName}</H>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="absolute top-4 right-4 cursor-pointer hover:text-red-600 transition"
      >
        <img src='/close.svg' alt="Close" className='w-6 h-6' /> {/* Замена CloseIcon на img */}
      </div>
    </Link>
  );
}

export default Recipient;

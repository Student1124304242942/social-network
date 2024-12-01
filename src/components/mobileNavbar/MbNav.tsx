import React from 'react';
import LinkElement from '../LinkElement/LinkElement';
import ProfileIcon from '@/Icons/Profile.svg';
import PostIcon from '@/Icons/Post.svg';
import UserIcon from '@/Icons/users.svg';
import MessageIcon from '@/Icons/Chat.svg';
import ExitIcon from '@/Icons/Exit.svg';

export const mbLinks = [
  { direction: '/profile', icon: <ProfileIcon /> },
  { direction: '/post', icon: <PostIcon /> },
  { direction: '/users', icon: <UserIcon /> },
  { direction: '/messages', icon: <MessageIcon /> },
  { direction: '/login', icon: <ExitIcon /> },  
];

const MbNav = () => {
  return (
    <nav className="flex justify-around p-4 bg-black shadow-lg fixed bottom-0 w-full rounded-t-lg z-10">
      {mbLinks.map(({ direction, icon }) => (
        <LinkElement key={direction} direction={direction}>
          <div className="text-lg">{icon}</div>
        </LinkElement>
      ))}
    </nav>
  );
}

export default MbNav;

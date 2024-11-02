import React from 'react';
import LinkElement from '../LinkElement/LinkElement';
import ProfileIcon from '@/Icons/Profile.svg';
import PostIcon from '@/Icons/Post.svg';
import UserIcon from '@/Icons/users.svg';
import MessageIcon from '@/Icons/Chat.svg';
import ExitIcon from '@/Icons/Exit.svg';

const links = [
  { direction: '/network/profile', label: 'профиль', icon: <ProfileIcon /> },
  { direction: '/network/post', label: 'Добавить пост', icon: <PostIcon /> },
  { direction: '/network/users', label: 'другие пользователи', icon: <UserIcon /> },
  { direction: '/network/messages', label: 'Сообщения', icon: <MessageIcon /> },
  { direction: '/', label: 'Выйти', icon: <ExitIcon /> },
];

const Navbar = () => {
  return (
    <nav className='flex gap-[20px] p-4 rounded-lg shadow-lg'>
      {links.map(({ direction, label, icon }) => (
        <LinkElement key={direction} direction={direction}>
          <div className=" flex items-center justify-center gap-[5px]">
          <div>
            {icon}
          </div>
          <div>{label}</div></div>
        </LinkElement>
      ))}
    </nav>
  );
};

export default Navbar;

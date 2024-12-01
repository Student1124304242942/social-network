import React from 'react';
import LinkElement from '../LinkElement/LinkElement';
import ProfileIcon from '@/Icons/Profile.svg';
import PostIcon from '@/Icons/Post.svg';
import UserIcon from '@/Icons/users.svg';
import MessageIcon from '@/Icons/Chat.svg';
 

export const links = [
  { direction: '/profile', label: 'профиль', icon: <ProfileIcon /> },
  { direction: '/post', label: 'Добавить пост', icon: <PostIcon /> },
  { direction: '/users', label: 'другие пользователи', icon: <UserIcon /> },
  { direction: '/messages', label: 'Сообщения', icon: <MessageIcon /> },
];

const Navbar = () => {
  return (
    <nav className='md:flex hidden gap-[20px] p-4 rounded-lg shadow-lg '>
      {links.map((link) => (
        <LinkElement key={link.direction} direction={link.direction}>
          <div className="flex items-center justify-center gap-[5px]">
            <div>
              {link.icon}
            </div>
            <div>{link.label}</div>
          </div>
        </LinkElement>
      ))}
    </nav>
  );
}

export default Navbar;

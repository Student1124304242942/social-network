import LinkElement from '../LinkElement/LinkElement';
 
export const links = [
  { direction: '/', label: 'профиль', icon: '/Profile.svg' },
  { direction: '/post', label: 'Добавить пост', icon: '/Post.svg' },
  { direction: '/users', label: 'другие пользователи', icon: '/users.svg' },
  { direction: '/messages', label: 'Сообщения', icon: '/Chat.svg' },
];

const Navbar = () => {
  return (
    <nav className='md:flex hidden gap-[20px] p-4 rounded-lg shadow-lg'>
      {links.map((link) => (
        <LinkElement key={link.direction} direction={link.direction}>
          <div className="flex items-center gap-[5px] justify-center  transition-opacity">
            <img src={link.icon} alt={`${link.direction} icon`} className="h-6 w-6" />
            <div>{link.label}</div>
          </div>
        </LinkElement>
      ))}
    </nav>
  );
}

export default Navbar;

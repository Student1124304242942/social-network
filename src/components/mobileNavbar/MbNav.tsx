 
import LinkElement from '../LinkElement/LinkElement';
 
 
// Создаем массив с указанным типом
export const mbLinks = [
  { direction: '/profile', icon: 'Profile.svg' },
  { direction: '/post', icon: 'Post.svg' },
  { direction: '/users', icon: 'users.svg' },
  { direction: '/messages', icon: 'Chat.svg' },
  { direction: '/login', icon: 'Exit.svg' },
];

const MbNav = () => {
  return (
    <nav className="flex justify-around p-4 bg-black shadow-lg fixed bottom-0 w-full rounded-t-lg z-10">
      {mbLinks.map(({ direction, icon }) => (
        <LinkElement key={direction} direction={direction}>
          <div className="text-lg">  <img src={icon} alt={`${direction} icon`} className="h-6 w-6" /></div>
        </LinkElement>
      ))}
    </nav>
  );
}

export default MbNav;

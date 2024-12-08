'use client';
import React from 'react';
import { H } from '../Htag/H';
import Button from '../Button/Button';
import { UserCartProps } from './UserCart.props';
 
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../reducer/network';
import { chat } from '../reducer/chat';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { loadState } from '../reducer/storage';

const UserCart = ({ userName, userSkills, userAvatar, id }: UserCartProps) => {
  const router = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await newHomie();
    } catch (error) {
      console.log('Ошибка при отправке сообщения:', error);
    } finally {
      const userId = loadState('userID');
      router(`/chats/${id}${userId}`);
    }
  }  

  const newHomie = async () => {
    await dispatch(chat({
      recipientId: id,
      name: userName,
      avatarRef: userAvatar,
    }));
  }

  return (
    <div key={id} className="p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md">
      <Link to={`/profiles/${id}`} className="flex flex-col md:flex-row items-center justify-between p-2 sm:p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow min-w-full">
        <div className='flex gap-2 sm:gap-3 items-center'>
          <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] overflow-hidden rounded-full relative">
            <img
              src={userAvatar}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt='avatar'
            />
          </div>
          <div>
            <H appearance="bl" tag="h3" weight={600}>{userName}</H>
            <div className="text-xs sm:text-sm">{userSkills}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2 md:mt-0">
          <Button>Добавить в друзья</Button>
            <Button onClick={handleClick}>
              <img src='message.svg' className='w-4 h-4 mr-1' />
              <div>Сообщения</div>
            </Button>
        </div>
      </Link>
    </div>
  );
};

export default UserCart;


/* const currentUserId: string | undefined = loadState('userID');
const [combinedId, setCombinedId] = useState<string | undefined>(undefined);
useEffect(() => {
  if(currentUserId && id){
    const newCombinedId:string = combinedId + id;
    setCombinedId(newCombinedId);
    saveState(newCombinedId, 'combinedId');
  }
}, [currentUserId,combinedId, id]); */

/* onClick={() => combinedId && router.push(`network/messages/${combinedId}`)} */
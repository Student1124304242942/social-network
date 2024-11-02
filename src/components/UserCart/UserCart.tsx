'use client';
import React from 'react';
import { H } from '../Htag/H';
import Button from '../Button/Button';
import { UserCartProps } from './UserCart.props';
import Image from 'next/image';
import MessageIcon from '@/Icons/message.svg';
const UserCart = ({ userName, userSkills, userAvatar, id }: UserCartProps) => {
  return (
    <div key={id} className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow min-w-full">
        <div className='flex gap-[10px] items-center'>
          <div className="w-[100px] inset-[3px] h-[100px] overflow-hidden rounded-[50%] relative">
            <Image
              src={`${userAvatar}`}
              layout="fill"
              objectFit="cover"
              alt='art'
            />
          </div>
          <div>
            <H appearance="bl" tag="h3" weight={600}>{userName}</H>
            <div>{userSkills}</div>
          </div>
        </div>
        <div className="flex flex-col gap-[5px]">
          <Button>Добавить в друзья</Button>
          <Button >
            <MessageIcon className='w-[1.5em] h-[1.5em]' />
            <div>Сообщения</div>
          </Button>
        </div>
      </div>
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
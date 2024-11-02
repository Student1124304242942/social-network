import React from 'react';
import { ProfileCardProps3 } from '../interfaces/profileCard';
import Image from 'next/image';
import { H } from '../Htag/H';

const ProfileCard: React.FC<ProfileCardProps3> = ({ name, avatar, age, skills, country }) => {
  return (
    <div className="flex gap-[30px] items-center text-white">
        <div className="w-[150px] h-[150px] rounded-[50%] overflow-hidden relative">
            {avatar && (
              <Image
                src={avatar}
                layout="fill"  
                objectFit="cover" 
                alt='User Avatar'
              />
            )}
        </div>
        <div className="flex flex-col gap-[10px]">
          <H tag='h2' appearance='wh' weight={600}>{name}</H> 
          <div>Age: {age}</div>
          <div>Country: {country}</div>
          <div>Skills: {skills.join(', ')}</div>
        </div>
    </div>
  )
}

export default ProfileCard;

 

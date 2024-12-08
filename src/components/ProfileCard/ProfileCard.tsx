import React from 'react';
import { ProfileCardProps3 } from '../interfaces/profileCard';
import { H } from '../Htag/H';

const ProfileCard: React.FC<ProfileCardProps3> = ({ name, avatar, age, skills, country }) => {
  return (
    <div className="flex md:flex-row flex-col gap-[30px] items-center text-white">
        <div className="md:w-[180px] md:h-[180px] w-[200px] h-[200px] rounded-[50%] overflow-hidden relative">
            {avatar && (
              <img
                src={avatar}
                alt='User Avatar'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            )}
        </div>
        <div className="flex flex-col gap-[10px] justify-start">
          <div><H tag='h2' appearance='wh' weight={600}>{name}</H></div>
          <div>Age: {age}</div>
          <div>Country: {country}</div>
          <div>Skills: {skills}</div>
        </div>
    </div>
  )
}

export default ProfileCard;

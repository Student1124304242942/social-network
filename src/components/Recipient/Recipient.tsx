import React from 'react';
import Button from '../Button/Button';

const Recipient = ({}) => {
  return (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow min-w-full">
    <div className='flex gap-[10px] items-center'>
        <div className="w-[100px] inset-[3px] h-[100px] overflow-hidden rounded-[50%] relative"><Image
            src={`${userAvatar}`}
            layout="fill"  
            objectFit="cover" 
            alt='art'
        /></div>
        <div className="">
            <H appearance="bl" tag="h3" weight={600}>{userName}</H>
        </div>
    </div>
  </div>
  )
}

export default Recipient

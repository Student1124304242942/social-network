'use client';
import HomiesProfile from '@/components/HomiesProfile/HomiesProfile';
import { userProfile } from '@/components/interfaces/userProfile';
import { Api } from '@/firebase';
import {  useEffect, useState } from 'react';

const UserProfilePage =  ({ params }: { params: { userProfile: string } }) => {
  const id = params.userProfile as string;
  const [userData, setUserData] = useState<userProfile[]>([]);
  useEffect(() => {
    const userProfileData = async () => {
      const data = await Api.getAnotherProfile(id);
      if(data){
        setUserData(data)
      }
    }
    userProfileData();
  }, [id])
  if (!userData || userData.length === 0) {
    return <div className="">
      Произошла ошибка
    </div>
  }

  return (
    userData.map(user => (
      <HomiesProfile
        key={user.id}
        name={user.name}
        avatar={user.avatar}
        age={user.age}
        skills={user.skills}
        country={user.country}
        profileImage={user.profileImage}
        posts={user.posts}
      />
    ))
  );
}

export default UserProfilePage;

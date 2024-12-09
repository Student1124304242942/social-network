import { useParams } from 'react-router-dom';
import HomiesProfile from '../../../components/HomiesProfile/HomiesProfile';
import { userProfile } from '../../../components/interfaces/userProfile';
import { Api } from '../../../firebase';
import {  useEffect, useState } from 'react';

const UserProfilePage =  () => {
  
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<userProfile[]>([]);
  useEffect(() => {
    const userProfileData = async () => {
      if(id){
        const data = await Api.getAnotherProfile(id);
        if(data){
          setUserData(data)
        }
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

'use client';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import { ProfileCardProps } from '@/components/interfaces/profileCard';
import { getAuth } from 'firebase/auth';
import { loadState, saveState } from '@/components/reducer/storage';
import { Post } from '@/components/interfaces/Post';
import PostItem from '@/components/PostItem/PostItem';
import EditIcon from '@/Icons/edit.svg';
import Image from 'next/image';
import EditProfileModal from '@/components/EditProfile/EditProfile';
import { userAPI } from '@/firebase';

const Page = () => {
  const [profileData, setProfileData] = useState<null | ProfileCardProps>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, loading, error] = useAuthState(getAuth());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [img, setImg] = useState<string>('');
  const [avartar, setAvatar] = useState<string>('');
  const userID:string | undefined = loadState('userID');
  useEffect(() => {
    if (user) {
      saveState(user.uid, 'userID');
      const fetchProfileInfo = async () => {
        const userId = user.uid; 
        const data = await userAPI.getProfileInfo(userId);
        setProfileData(data);
        setPosts(data.posts || []);  
      };
      fetchProfileInfo();
    }
  }, [user]);
  const convertToURL = (file: Blob | Uint8Array | ArrayBuffer): string => {
    return URL.createObjectURL(new Blob([file]));
  };
  const avatarURL = (file: Blob | Uint8Array | ArrayBuffer):string => {
    return URL.createObjectURL(new Blob([file]));
  }
  useEffect(() => {
    if (profileData) {
        if (profileData.avatar) {
          if(typeof profileData.avatar === 'string'){
            setAvatar(profileData.avatar);
          }else{
            const newAvatarUrl = avatarURL(profileData.avatar);
            setAvatar(newAvatarUrl);
          }
        } else {
            setAvatar('');  
        }
        if (profileData.profileImage) {
            if (typeof profileData.profileImage === 'string') {
                // Если строка - это URL
                setImg(profileData.profileImage);
            } else {
                // Если это Blob, создавайте URL
                const imageUrl = convertToURL(profileData.profileImage);
                setImg(imageUrl);
            }
        } else {
            setImg('');  
        }
    }
}, [profileData]);

  if (loading) {
    return <div className='text-white'>Loading...</div>;
  } else if (error) {
    return <div className='text-white'>Error loading user.</div>;
  }

  const handleDeletePost = (postId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post: Post) => post.id !== postId));
  }

  const handleProfileUpdate = (updatedData: ProfileCardProps) => {
    setProfileData(updatedData); // Update profile data after editing
    setIsModalOpen(false); // Close the modal
  }

  const handleClick = async () => {
    setIsModalOpen(true);
    if (userID && profileData) {
        await userAPI.editProfile(
            userID,
            profileData.name,
            profileData.age,
            profileData.skills,
            profileData.country,
            profileData.avatar,
            profileData.profileImage
        );
    }
}


  return (
      <div className="flex flex-col relative gap-[50px]">
        {img  ? (
          <div className="min-h-[300px] w-full flex text-center relative rounded-[50px] overflow-hidden">
            <Image
              src={img}
              layout="fill"  
              objectFit="cover" 
              alt='Profile'
            />
          </div>
        ) : (
          <div className="min-h-[300px] w-full flex text-center relative rounded-[50px]">
            что-то пошло не так
          </div>
        )}
    
        {isModalOpen && profileData ? (  
          <EditProfileModal 
            profileData={profileData}
            onSubmit={handleProfileUpdate}
            onClose={() => setIsModalOpen(false)} 
          />
        ) : (
          profileData && (  
            <div className='flex items-center justify-between'>
              <ProfileCard
                name={profileData.name}
                avatar={avartar}
                age={profileData.age}
                skills={profileData.skills}
                country={profileData.country}
              />
              <button 
                onClick={handleClick}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200">
                <EditIcon className="w-5 h-5" />
                <span className="ml-2">Изменить данные</span>
              </button>
            </div>
          )
        )}
    
        <div className="flex flex-col gap-[50px]">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostItem key={post.id} title={post.title} postId={post.id} onDelete={handleDeletePost}>
                {post.text}
              </PostItem>
            ))
          ) : (
            <>У вас нет постов, добавьте один.</>
          )}
        </div>
      </div>
    );
}

export default Page;

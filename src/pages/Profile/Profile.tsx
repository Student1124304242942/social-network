import  { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { ProfileCardProps } from '../../components/interfaces/profileCard';
import { getAuth } from 'firebase/auth';
import { loadState, saveState } from '../../components/reducer/storage';
import { Post } from '../../components/interfaces/Post';
import PostItem from '../../components/PostItem/PostItem';
import EditProfileModal from '../../components/EditProfile/EditProfile';
import { userAPI } from '../../firebase';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../components/reducer/network';
import { editProfile } from '../../components/reducer/profile';

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [profileData, setProfileData] = useState<null | ProfileCardProps>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, loading, error] = useAuthState(getAuth());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [img, setImg] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const userID: string | undefined = loadState('userID');
  
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
  

  const convertToURL = (file: Blob): string => {
    return URL.createObjectURL(file);
  };

  useEffect(() => {
    if (profileData) {
      if (profileData.avatar) {
        if (typeof profileData.avatar === 'string') {
          setAvatar(profileData.avatar);
        } else {
          const newAvatarUrl = convertToURL(profileData.avatar);
          setAvatar(newAvatarUrl);
        }
      } else {
        setAvatar('');  
      }
      if (profileData.profileImage) {
        if (typeof profileData.profileImage === 'string') {
          setImg(profileData.profileImage);
        } else {
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
  };
  const handleProfileUpdate = async (updatedData: ProfileCardProps) => {
     
    const hasChanges = 
    profileData &&
    (profileData.name !== updatedData.name ||
    profileData.age !== updatedData.age ||
    JSON.stringify(profileData.skills) !== JSON.stringify(updatedData.skills) ||
    profileData.country !== updatedData.country ||
    (profileData.avatar instanceof Blob && updatedData.avatar instanceof Blob ? 
        profileData.avatar.size !== updatedData.avatar.size : 
        profileData.avatar !== updatedData.avatar) ||
    (profileData.profileImage instanceof Blob && updatedData.profileImage instanceof Blob ? 
        profileData.profileImage.size !== updatedData.profileImage.size : 
        profileData.profileImage !== updatedData.profileImage));

    if (hasChanges) {
      const avatarToSend = updatedData.avatar instanceof Blob ? updatedData.avatar : profileData.avatar;
      const profileImageToSend = updatedData.profileImage instanceof Blob ? updatedData.profileImage : profileData.profileImage;
  
      console.log(avatarToSend);
      if (userID && avatarToSend && profileImageToSend) {
        dispatch(editProfile({
          name: updatedData.name,
          age: updatedData.age,
          skills: updatedData.skills,
          country: updatedData.country,
          avatar: avatarToSend,
          profileImage: profileImageToSend,
        }));
      }
    } else {
      console.log("No changes detected. Not updating.");
    }
  
    
    setProfileData(updatedData);
    setIsModalOpen(false);
  };
  

  const handleClick = async () => {
    setIsModalOpen(true);
  };
  
  
  return (
    <div className="flex flex-col relative md:gap-[50px] gap-[20px]">
         {img ? (
          <div className="min-h-[300px] w-full flex items-center justify-center text-center relative rounded-[50px] overflow-hidden">
          <img
            src={img}
            alt='Profile'
            className="absolute inset-0 object-cover min-w-full min-h-full object-center"
          />
        </div>
        
      ) : (
        <div className="min-h-[300px] w-full flex text-center relative rounded-[50px]">
          что-то пошло не так
        </div>
      )}
    
      {isModalOpen && profileData ? (  
        <div className="flex items-center justify-center">
          <EditProfileModal 
            profileData={profileData}
            onSubmit={handleProfileUpdate}
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      ) : (
        profileData && (  
          <div className='flex md:flex-row z-10 flex-col items-center justify-between gap-[50px] md:mt-[0] -mt-[70px] md:gap-0'>
            <ProfileCard
              name={profileData.name}
              avatar={avatar}
              age={profileData.age}
              skills={profileData.skills}
              country={profileData.country}
            />
            <div className='md:hidden flex items-center justify-end min-w-full'>
              <button 
                onClick={handleClick}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200">
                <img className="w-5 h-5" />
                <span className="ml-2">Изменить данные</span>
              </button>
            </div>
            <button 
                onClick={handleClick}
                className="md:flex hidden items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200">
                <img src='edit.svg' alt='edit' className="w-5 h-5" />
                <span className="ml-2">Изменить данные</span>
            </button>
          </div>
        )
      )}
      <div className="flex flex-col gap-[50px] mb-[50px]">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostItem key={post.id} time={post.time} title={post.title} postId={post.id} onDelete={handleDeletePost}>
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

export default ProfilePage;
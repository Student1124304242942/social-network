import React from 'react';
import { H } from '../Htag/H';
import PostItem2 from '../PostItem/PostItem2';

interface Post {
  id:number;
  time:number;
  title:string;
  text:string;
}

interface ProfileInfo {
  name:string;
  avatar:string;
  age:number;
  skills:string[];
  country:string;
  profileImage:string ;
  posts:Post[];
}

const HomiesProfile: React.FC<ProfileInfo> = ({ name, avatar, age, skills, country, profileImage, posts}) => {
  return (
    <div className="flex flex-col relative gap-[50px]">
      <div className="min-h-[300px] w-full flex text-center relative rounded-[50px] overflow-hidden">
            <img
              src={profileImage}
              className="absolute inset-0 min-w-full object-cover"
            />
          </div>
       <div className="flex md:flex-row flex-col gap-[30px] items-center text-white md:mt-[0] -mt-[70px]">
        <div className="w-[180px] h-[180px] rounded-[50%] overflow-hidden relative">
            {avatar && (
              <img
                src={avatar}
                alt='User Avatar'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
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
     <div className="flex flex-col gap-[50px] mb-[50px]">
        {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostItem2 key={post.id} time={post.time} title={post.title} postId={post.id}>
                {post.text}
              </PostItem2>
            ))
          ) : (
            <>у пользователя нету постов</>
          )}
     </div>
    </div>
  )
}

export default HomiesProfile;

 

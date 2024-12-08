import React, { useEffect, useState } from 'react';
import UserCart from '../../components/UserCart/UserCart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../components/reducer/users';
import { AppDispatch, RootState } from '../../components/reducer/network';
import { H } from '../../components/Htag/H'; 
import { userSliceActions } from '../../components/reducer/users';

const UsersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const [isLoading, setIsLoading] = useState(true);
  const [searchItem, setSearchItem] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUsers());
      setIsLoading(false);  
    };
    
    fetchData();  
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase(); 
    setSearchItem(value);
    dispatch(userSliceActions.filterUsers(value));
  }

  return (
    <div className="flex flex-col gap-6 p-5 bg-gray-200 rounded-lg shadow">  
      <div className="flex md:flex-row flex-col md:gap-0 gap-[10px]  items-center justify-between mb-4">
        <H tag='h2' weight={600} appearance='wh'>Пользователи</H>
        <div className="relative flex items-center border  bg-white shadow-sm rounded-[10px]">
          <input 
            onChange={handleSearchChange}
            type="text" 
            placeholder="Поиск пользователей..."
            className="pl-10 pr-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <img src="search.svg" className=' className="absolute left-2 w-5 h-5 text-gray-500" ' alt="search" />
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {isLoading ? (  
          <p className="text-center text-gray-500">Loading...</p>
        ) : users.length > 0 ? (
          users
            .filter(user => {
              const userName = user.name.toLowerCase();
              const userSkills = user.skills.join(' ').toLowerCase();  
              return userName.includes(searchItem) || userSkills.includes(searchItem);
            })
            .map(user => (
              <UserCart
                key={user.uid}
                id={user.uid}
                userName={user.name}
                userSkills={user.skills}
                userAvatar={user.avatar}
              />
            ))
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default UsersPage;
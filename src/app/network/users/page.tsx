'use client';
import React, { useEffect, useMemo, useState } from 'react';
import UserCart from '@/components/UserCart/UserCart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/components/reducer/users';
import { AppDispatch, RootState } from '@/components/reducer/network';

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const [isLoading, setIsLoading] = useState(true);  
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUsers());
      setIsLoading(false);  
    };
    
    fetchData();  
  }, [dispatch]);

  const userCarts = useMemo(() => {
    return users.map((user) => (
      <UserCart
        key={user.uid}
        id={user.uid}
        userName={user.name}
        userSkills={user.skills}
        userAvatar={user.avatar}
      />
    ));
  }, [users]);

  return (
    <div className="flex flex-col gap-[10px]">
      {isLoading ? (  
        <p>Loading...</p>
      ) : users.length > 0 ? (
        userCarts
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Page;

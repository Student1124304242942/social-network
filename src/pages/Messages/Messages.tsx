import  { useEffect, useState } from 'react';
import { Api } from '../../firebase';
import { loadState } from '../../components/reducer/storage';
import Recipient from '../../components/Recipient/Recipient';

export interface Homie {
  id: string;
  name: string;
  avatarRef: string;
}

const MessagePage = () => {
  const [homies, setHomies] = useState<Homie[]>([]);
  
  const handleUserChat = async () => {
    const userId: string | undefined = loadState('userID');
    if (userId) {
      const chats: Homie[] = await Api.getChats(userId);   
      if (Array.isArray(chats)) {
        setHomies(chats);
        console.log('Loaded chats:', chats);
      } else {
        console.log('No chats found');
      }
    } else {
      console.log('User ID is not defined');
    }
  };

  useEffect(() => {
    handleUserChat();
  }, []);
  const updateHomies = (deletedId: string) => {
    setHomies(prevHomies => prevHomies.filter(homie => homie.id !== deletedId));
  };
  return (
    <ul className='flex flex-col gap-[20px] px-[10px]'>
      {homies.map(homie => (
        <li key={homie.id}>
          <Recipient 
            id={homie.id} 
            userName={homie.name} 
            userAvatar={homie.avatarRef} 
            update={updateHomies}
          />
        </li>
      ))}
    </ul>
  );
};

export default MessagePage;
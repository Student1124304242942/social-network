'use client';
import React, { useEffect, useState } from 'react';
import { Api } from "@/firebase";
import { H } from '@/components/Htag/H';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/reducer/network';
import { sendMessage } from '@/components/reducer/chat';
import Image from 'next/image';
import { getMessage } from '@/components/reducer/chat';
const Page = ({ params }: { params: { chat: string } }) => {
  const id = params.chat as string;
  const dispatch = useDispatch<AppDispatch>();
  const recipientId = id.slice(0, 28);
  const userId = id.slice(28);
  const recipientMessagesRD = useSelector((state:RootState) => state.chat.messageReceived);
  const newRecipientMessages = useSelector((state:RootState) => state.chat.newMessage);
  const [messages, setMessages] = useState<{ text: string; avatar: string | null; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>('Чат');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
  const [receivedMessages, setReceivedMessages]= useState<{ text: string; avatar: string | null; name: string }[]>([]);
  useEffect(() => {
    const fetChMessages = async() => {
      if(newRecipientMessages){
        const messagesData = await dispatch(getMessage({userId:userId, recipientId:recipientId}));
        if(messagesData && messagesData.l){

        }
    }}
  },)
  useEffect(() => {
    const fetchUserChat = async () => {
      try {
        const chatData = await Api.anotherUserChat(recipientId, userId);
        if (chatData && chatData.length > 0) {
          setMessages(chatData.flatMap(chatt => chatt.chat.text.map(text => ({
            text,
            avatar: chatData[0].avatarRef,
            name: chatData[0].name
          }))));
          setChatName(chatData[0].name);  
          setAvatarUrl(chatData[0].avatarRef);
        }
      } catch (error) {
        console.error('Error fetching user chat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserChat();
  }, [recipientId, userId]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleClick = async () => {
    if (messageInput.trim() === '' || isSending) return;
    setIsSending(true);
    const newMessageToChat = await dispatch(
      sendMessage({ userId: userId, recipientId: recipientId, message: messageInput })
    );

    if (newMessageToChat && newMessageToChat.payload) {
      const messages = newMessageToChat.payload;

      setMessages(prevMessages => [
        ...prevMessages,
        { text: messages[messages.length - 1].text, avatar: avatarUrl, name: 'Вы' } // добавляем только что отправленное сообщение
      ]);
      
      setMessageInput(''); // очищаем поле ввода
    }
    setIsSending(false);
  };
  
  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white py-4 px-6 flex items-center">
        <H tag='h3' appearance='wh' weight={600}>{chatName}</H>
      </header>
      <main className="flex-1 overflow-y-scroll p-4 bg-gray-100 flex flex-col-reverse">
        { messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="flex items-start mb-2">
              {msg.avatar && (
                <Image src={msg.avatar} alt={msg.name} width={40} height={40} className="rounded-full mr-2" />
              )}
              <div className="flex flex-col">
                <div className="bg-gray-800 text-white p-2 rounded-lg">
                  <strong>{msg.name}:</strong> {msg.text}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Нет сообщений для этого чата.</div>
        )}
      </main>
      <footer className="flex p-4 bg-white border-t">
        <input
          value={messageInput}
          onChange={handleMessageChange}
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Введите сообщение..."
        />
        <button
          onClick={handleClick}
          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Отправить
        </button>
      </footer>
    </div>
  );  
};

export default Page;

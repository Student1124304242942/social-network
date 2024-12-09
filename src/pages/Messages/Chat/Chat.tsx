import React, { useEffect, useState, useRef } from 'react';
import { Api } from '../../../firebase';
import { H } from '../../../components/Htag/H';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../components/reducer/network';
import { sendMessage } from '../../../components/reducer/chat';
import Message from '../MessageComponent';
import { getMessage } from '../../../components/reducer/chat';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    let recipientId: string = '';
    let userId: string = '';
    if (id) {
        recipientId = id.slice(0, 28);
        userId = id.slice(28);
    }

    const [messages, setMessages] = useState<{ text: string; avatar: string | null; name: string; id: number }[]>([]);
    const [homiesMessages, setHomiesMessages] = useState<{ text: string; avatar: string | null; name: string; id: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [messageInput, setMessageInput] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [lastSentMessage, setLastSentMessage] = useState<string | null>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHomiesChat = async () => {
            const actionResult = await dispatch(getMessage({ userId: userId, recipientId: recipientId }));
            if (getMessage.fulfilled.match(actionResult)) {
                const homiesMessages = actionResult.payload;
                if (homiesMessages && homiesMessages.length > 0 && homiesMessages[0].chat.text) {
                    setHomiesMessages(homiesMessages.flatMap(message => message.chat.text.map((text, index) => ({
                        text,
                        avatar: homiesMessages[0].avatarRef,
                        name: homiesMessages[0].name,
                        id: index
                    }))));
                }
            }
        }

        fetchHomiesChat();
    }, [dispatch, recipientId, userId, lastSentMessage]);

    useEffect(() => {
        const fetchUserChat = async () => {
            try {
                const chatData = await Api.anotherUserChat(recipientId, userId);
                if (chatData && chatData.length > 0) {
                    setMessages(chatData.flatMap(chatt => chatt.chat.text.map((text, index) => ({
                        text,
                        avatar: chatData[0].avatarRef,
                        name: chatData[0].name,
                        id: index
                    }))));
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
            const message = newMessageToChat.payload;
            const lastMessage = message[message.length - 1];
            setMessages(prevMessages => [
                ...prevMessages,
                { text: lastMessage, avatar: avatarUrl, name: messages[0].name, id: Date.now() }
            ]);
            setMessageInput('');
            setLastSentMessage(lastMessage); // обновите состояние при отправке
        }

        setIsSending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleClick();
        }
    };

    const combinedMessages = [...messages, ...homiesMessages].sort((a, b) => a.id - b.id);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = mainRef.current.scrollHeight;
        }
    }, [combinedMessages]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-gray-800 text-white py-4 px-6 flex items-center">
                <H tag='h3' appearance='wh' weight={600}>Чат</H>
            </header>
            <main ref={mainRef} className="flex-1 overflow-y-scroll p-4 bg-gray-100 flex flex-col">
                {combinedMessages.length > 0 ? (
                    combinedMessages.map((msg) => (
                        <Message key={msg.id} msg={msg} isFromHomie={msg.name !== messages[0].name} />
                    ))
                ) : (
                    <div>Нет сообщений для этого чата.</div>
                )}
            </main>
            <footer className="flex p-4 bg-white border-t">
                <input
                    value={messageInput}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
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

export default ChatPage;
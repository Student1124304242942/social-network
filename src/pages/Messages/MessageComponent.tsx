
interface MessageProps {
  msg: {
    avatar: string | null;  
    name: string;     
    text: string;     
  };
  isFromHomie: boolean;  
}

const Message: React.FC<MessageProps> = ({ msg, isFromHomie }) => (
  <div className={`flex items-start mb-2 animate-fade-in ${isFromHomie ? '' : 'justify-end'}`}>
    {isFromHomie && msg.avatar && (
      <img src={msg.avatar} alt={msg.name} width={40} height={40} className="rounded-full mr-2" />
    )}
    <div className={`flex flex-col ${isFromHomie ? '' : 'items-end'}`}>
      <div className={`p-2 rounded-lg ${isFromHomie ? 'bg-gray-800 text-white' : 'bg-blue-500 text-white'}`}>
        {isFromHomie ? <strong>{msg.name}:</strong> : null} {msg.text} {isFromHomie ? null : <strong>:{msg.name}</strong>}
      </div>
      {!isFromHomie && msg.avatar && (
        <img src={msg.avatar} alt={msg.name} width={40} height={40} className="rounded-full mt-2" />
      )}
    </div>
  </div>
);

export default Message;
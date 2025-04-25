
import React, { useRef, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const ChatContainer: React.FC = () => {
  const { messages, clearChat } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="font-semibold text-lg">Chat</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChat} 
          className="text-gray-500 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span>Clear</span>
        </Button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput />
    </div>
  );
};

export default ChatContainer;

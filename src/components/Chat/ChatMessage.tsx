
import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div 
      className={cn(
        "flex w-full items-start gap-2 animate-message-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-campus-secondary text-white">
          <span className="text-xs">AI</span>
        </Avatar>
      )}
      <div 
        className={cn(
          "rounded-lg p-3 max-w-[80%] break-words",
          isUser 
            ? "bg-campus-primary text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}
      >
        <p className="whitespace-pre-line">{message.content}</p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 bg-campus-accent text-white">
          <span className="text-xs">You</span>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;

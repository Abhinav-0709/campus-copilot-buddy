
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatContext } from '@/context/ChatContext';
import { SendIcon, Mic } from 'lucide-react';

const ChatInput: React.FC = () => {
  const { addAIResponse } = useChatContext();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addAIResponse(message.trim());
    setMessage('');
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this is where you would implement speech recognition
    if (!isRecording) {
      alert("Voice input would be implemented here using the Web Speech API or Whisper. This is a placeholder for now.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 border-t bg-white">
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        className="text-campus-secondary hover:text-campus-primary hover:bg-gray-100"
        onClick={handleRecording}
      >
        <Mic className={isRecording ? "text-red-500" : ""} />
      </Button>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Ask anything about campus life..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 border-gray-300 focus-visible:ring-campus-secondary"
      />
      <Button 
        type="submit" 
        disabled={!message.trim()} 
        className="bg-campus-secondary hover:bg-campus-primary text-white"
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;


import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStudentData } from '@/hooks/useStudentData';
import type { ChatMessage, Reminder } from '@/types';
import { getPersonalizedResponse } from '@/services/chatService';
import { toast } from 'sonner';

interface ChatContextType {
  messages: ChatMessage[];
  reminders: Reminder[];
  addMessage: (content: string, type: ChatMessage['type']) => void;
  addAIResponse: (query: string) => Promise<void>;
  addReminder: (title: string, description: string, dueDate: Date) => void;
  toggleReminderCompletion: (id: string) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { studentData, error } = useStudentData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "Hi there! I'm CampusCopilot, your AI assistant for college life. How can I help you today?",
      type: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: uuidv4(),
      title: 'Submit Math Assignment',
      description: 'Chapter 5 problems 1-10',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      completed: false
    }
  ]);

  const addMessage = useCallback((content: string, type: ChatMessage['type']) => {
    setMessages(prev => [...prev, {
      id: uuidv4(),
      content,
      type,
      timestamp: new Date()
    }]);
  }, []);

  const addAIResponse = useCallback(async (query: string) => {
    addMessage(query, 'user');
    
    const loadingMessageId = uuidv4();
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      content: "Thinking...",
      type: 'ai',
      timestamp: new Date()
    }]);
    
    try {
      const response = await getPersonalizedResponse(query, studentData);
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId 
          ? { ...msg, content: response }
          : msg
      ));
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Sorry, I had trouble processing your request.");
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId 
          ? { ...msg, content: "Sorry, I encountered an error. Please try again." }
          : msg
      ));
    }
  }, [addMessage, studentData]);

  const addReminder = useCallback((title: string, description: string, dueDate: Date) => {
    setReminders(prev => [...prev, {
      id: uuidv4(),
      title,
      description,
      dueDate,
      completed: false
    }]);
  }, []);

  const toggleReminderCompletion = useCallback((id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  }, []);

  const clearChat = useCallback(() => {
    setMessages([{
      id: uuidv4(),
      content: "Hi there! I'm CampusCopilot, your AI assistant for college life. How can I help you today?",
      type: 'ai',
      timestamp: new Date()
    }]);
  }, []);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      reminders,
      addMessage, 
      addAIResponse,
      addReminder,
      toggleReminderCompletion,
      clearChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

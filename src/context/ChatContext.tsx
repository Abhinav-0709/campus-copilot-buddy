
import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStudentData } from '@/hooks/useStudentData';
import type { ChatMessage, Reminder } from '@/types';

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

const mockResponses: Record<string, string> = {
  exams: "The next internal exams are scheduled for May 15-20, 2025. Make sure to check the department notice board for the exact schedule.",
  assignments: "You have 3 pending assignments:\n1. Data Structures project due tomorrow\n2. Economics essay due on Friday\n3. Physics lab report due next Monday",
  food: "Here are some popular food spots near campus:\n• Campus Café - Coffee & sandwiches\n• Dosa Corner - Best South Indian food (try their masala dosa!)\n• Burger Bros - Quick bites\n• Veggie Delight - Healthy options",
  events: "Upcoming campus events:\n• Tech Fest - April 30\n• Cultural Night - May 5\n• Career Fair - May 10",
  forms: "Common forms you might need:\n• KYC verification\n• Scholarship application\n• Hostel extension\n• Internship certification"
};

const getPersonalizedResponse = (query: string, studentData: any[]) => {
  const lowerQuery = query.toLowerCase();
  const greetings = ["Hi!", "Hello!", "Hey there!", "Greetings!", "Hi friend!"];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  
  // Student data related queries
  if (lowerQuery.includes('student') && lowerQuery.includes('list')) {
    const names = studentData.map(student => student.name).join(', ');
    return `${randomGreeting} Here are the students in our database: ${names}`;
  }
  
  if (lowerQuery.includes('course') || lowerQuery.includes('program')) {
    const courses = [...new Set(studentData.map(student => student.course))];
    return `${randomGreeting} The available courses are: ${courses.join(', ')}`;
  }

  // Regular queries with friendly responses
  if (lowerQuery.includes('exam')) {
    return `${randomGreeting} ${mockResponses.exams} Let me know if you need any study tips! 📚`;
  }
  
  if (lowerQuery.includes('assignment') || lowerQuery.includes('homework')) {
    return `${randomGreeting} ${mockResponses.assignments} Don't worry, you've got this! 💪`;
  }
  
  if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('restaurant')) {
    return `${randomGreeting} Feeling hungry? ${mockResponses.food} Enjoy your meal! 🍽️`;
  }
  
  if (lowerQuery.includes('event')) {
    return `${randomGreeting} Here's what's coming up! ${mockResponses.events} Hope to see you there! 🎉`;
  }
  
  if (lowerQuery.includes('form') || lowerQuery.includes('document')) {
    return `${randomGreeting} Need some paperwork done? ${mockResponses.forms} Let me know if you need help filling them out! 📝`;
  }
  
  if (lowerQuery.includes('remind')) {
    return `${randomGreeting} I've set a reminder for you! You can view and manage all your reminders in the dashboard. I'll make sure to notify you! ⏰`;
  }

  if (lowerQuery.includes('thank')) {
    return "You're welcome! I'm always here to help! 😊";
  }

  if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
    return "Goodbye! Have a great day! Don't hesitate to come back if you need anything! 👋";
  }
  
  return `${randomGreeting} I'm CampusCopilot, your friendly AI assistant for college life! 🎓 Ask me about students, courses, exams, assignments, campus food, or let me set reminders for your tasks!`;
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
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = getPersonalizedResponse(query, studentData);
    addMessage(response, 'ai');
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

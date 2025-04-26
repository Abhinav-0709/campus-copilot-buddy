import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStudentData } from '@/hooks/useStudentData';
import type { ChatMessage, Reminder } from '@/types';
import { fetchNearbyFoodPlaces, estimatePriceRange, FoodPlaceRecommendation } from '@/utils/placesApi';
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

const menuItems = [
  { name: 'Masala Dosa', price: 50, description: 'Crispy crepe with spiced potato filling', category: 'meals' },
  { name: 'Samosa', price: 15, description: 'Crispy pastry with spiced potato filling', category: 'snacks' },
  { name: 'Chai', price: 15, description: 'Indian spiced tea', category: 'beverages' },
  { name: 'Vada Pav', price: 25, description: 'Spicy potato patty in a bun', category: 'snacks' },
  { name: 'Fruit Bowl', price: 40, description: 'Fresh seasonal fruits', category: 'desserts' },
  { name: 'Maggi Noodles', price: 30, description: 'Instant noodles with vegetables', category: 'meals' },
  { name: 'Coffee', price: 20, description: 'Fresh brewed coffee', category: 'beverages' },
  { name: 'Paratha', price: 35, description: 'Stuffed flatbread', category: 'meals' },
  { name: 'Gulab Jamun', price: 20, description: 'Sweet milk-solid balls', category: 'desserts' },
  { name: 'Poha', price: 30, description: 'Flattened rice with spices', category: 'meals' }
];

const mockResponses: Record<string, string> = {
  exams: "The next internal exams are scheduled for May 15-20, 2025. Make sure to check the department notice board for the exact schedule.",
  assignments: "You have 3 pending assignments:\n1. Data Structures project due tomorrow\n2. Economics essay due on Friday\n3. Physics lab report due next Monday",
  food: `Here are some popular food spots near campus:
• Campus Café - Budget-friendly meals (₹30-80)
• Dosa Corner - South Indian specials (₹40-100)
• Snack Shack - Quick bites (₹15-50)
• Juice Junction - Fresh beverages (₹20-60)`,
  events: "Upcoming campus events:\n• Tech Fest - April 30\n• Cultural Night - May 5\n• Career Fair - May 10",
  forms: "Common forms you might need:\n• KYC verification\n• Scholarship application\n• Hostel extension\n• Internship certification"
};

const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('gemini', {
      body: { prompt }
    });

    if (error) throw error;
    return data.response;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

const getPersonalizedResponse = async (query: string, studentData: any[]): Promise<string> => {
  const lowerQuery = query.toLowerCase();
  const greetings = ["Hi!", "Hello!", "Hey there!", "Greetings!", "Hi friend!"];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  try {
    // First try to handle specific commands with our existing logic
    if (lowerQuery.includes('rupees') || lowerQuery.includes('rs')) {
      const budgetMatch = query.match(/(\d+)\s*(?:rupees|rs)/i);
      if (budgetMatch) {
        const budget = parseInt(budgetMatch[1]);
        
        try {
          const places = await fetchNearbyFoodPlaces(budget);
          
          if (places && places.length > 0) {
            let response = `${randomGreeting} With a budget of ₹${budget}, here are some nearby places you can try:\n\n`;
            
            places.forEach(place => {
              const priceRange = estimatePriceRange(place.priceLevel);
              response += `• ${place.name} - ${priceRange}\n`;
              response += `  ${place.address}\n`;
              if (place.rating) response += `  Rating: ${place.rating}/5\n`;
              response += `  ${place.isOpenNow ? '🟢 Open now' : '🔴 Closed'}\n\n`;
            });
            
            response += "These recommendations are based on your location and budget. Enjoy your meal! 🍽️";
            return response;
          }
          
          return getFallbackFoodRecommendation(budget, randomGreeting);
        } catch (error) {
          console.error('Error fetching food places:', error);
          return getFallbackFoodRecommendation(budget, randomGreeting);
        }
      }
    }

    if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('restaurant') || lowerQuery.includes('menu')) {
      try {
        const places = await fetchNearbyFoodPlaces(200, 'restaurant');
        
        if (places && places.length > 0) {
          let response = `${randomGreeting} Here are some food places near you:\n\n`;
          
          places.forEach(place => {
            const priceRange = estimatePriceRange(place.priceLevel);
            response += `• ${place.name} - ${priceRange}\n`;
            response += `  ${place.address}\n`;
            if (place.rating) response += `  Rating: ${place.rating}/5\n\n`;
          });
          
          response += "\nYou can also ask me what's available within your budget! For example, 'What can I get for 100 rupees?' 🍽️";
          return response;
        }
        
        return `${randomGreeting}\n\n${mockResponses.food}\n\nOur Menu Highlights:\n${menuItems
          .slice(0, 5)
          .map(item => `• ${item.name} - ₹${item.price} (${item.description})`)
          .join('\n')}\n\nYou can also ask me what you can get within your budget! 🍽️`;
      } catch (error) {
        console.error('Error fetching food places:', error);
        return `${randomGreeting}\n\n${mockResponses.food}\n\nOur Menu Highlights:\n${menuItems
          .slice(0, 5)
          .map(item => `• ${item.name} - ₹${item.price} (${item.description})`)
          .join('\n')}\n\nYou can also ask me what you can get within your budget! 🍽️`;
      }
    }

    // For all other queries, use Gemini
    return await getGeminiResponse(query);
    
  } catch (error) {
    console.error('Error getting response:', error);
    return "I apologize, but I encountered an error processing your request. Please try again.";
  }
};

const getFallbackFoodRecommendation = (budget: number, greeting: string): string => {
  const affordableItems = menuItems.filter(item => item.price <= budget);
  
  if (affordableItems.length === 0) {
    return `${greeting} I'm sorry, but the minimum item in our menu starts from ₹15. You might want to check back when you have a bigger budget! 💰`;
  }

  const categorizedItems = affordableItems.reduce((acc: Record<string, typeof menuItems>, item) => {
    acc[item.category] = [...(acc[item.category] || []), item];
    return acc;
  }, {});

  let response = `${greeting} With ₹${budget}, you can get these items from our menu:\n\n`;
  
  Object.entries(categorizedItems).forEach(([category, items]) => {
    response += `${category.toUpperCase()}:\n`;
    items.forEach(item => {
      response += `• ${item.name} (₹${item.price}) - ${item.description}\n`;
    });
    response += '\n';
  });

  return response + "Enjoy your meal! 🍽️\n\n(This is showing our campus menu as I couldn't connect to the location service)";
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

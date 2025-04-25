
import { format } from 'date-fns';

// Format date for displaying in the UI
export const formatDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy h:mm a');
};

// Parse user message for potential reminder creation
export const parseReminderFromMessage = (message: string): { found: boolean; title?: string; date?: Date } => {
  const reminderRegex = /remind me (to|about) (.+?) (on|by|before) (.+)/i;
  const match = message.match(reminderRegex);
  
  if (!match) return { found: false };
  
  const title = match[2].trim();
  const dateStr = match[4].trim();
  
  // This is a simplified date parser, in a real app would use a more robust solution
  let date;
  try {
    // Try to parse as exact date first
    date = new Date(dateStr);
    
    // If invalid or past date, try some common formats
    if (isNaN(date.getTime()) || date < new Date()) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (dateStr.toLowerCase().includes('tomorrow')) {
        date = tomorrow;
      } else if (dateStr.toLowerCase().includes('today')) {
        date = today;
      } else {
        // Default to tomorrow if we can't parse
        date = tomorrow;
      }
    }
  } catch (e) {
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    date = tomorrow;
  }
  
  return { 
    found: true, 
    title, 
    date 
  };
};

// Detect "chai break" or similar phrases in the message
export const detectChaiBreak = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  const chaiBreakPhrases = [
    'chai break',
    'coffee break',
    'tea break',
    'time for chai',
    'need a break',
    'let\'s take a break'
  ];
  
  return chaiBreakPhrases.some(phrase => lowerMessage.includes(phrase));
};

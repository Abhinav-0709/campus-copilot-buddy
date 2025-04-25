
export type MessageType = 'user' | 'ai' | 'system';

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
}

export type QuickActionType = 'exams' | 'assignments' | 'food' | 'forms' | 'events';

export interface QuickAction {
  id: QuickActionType;
  label: string;
  prompt: string;
  icon: string;
}

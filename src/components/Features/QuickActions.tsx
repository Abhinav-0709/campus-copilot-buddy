
import React from 'react';
import { useChatContext } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, Coffee, FileText, CalendarClock } from 'lucide-react';

const quickActions = [
  {
    id: 'exams',
    label: 'Exams',
    prompt: 'When are the next exams?',
    icon: <Calendar className="h-4 w-4" />
  },
  {
    id: 'assignments',
    label: 'Assignments',
    prompt: 'What assignments do I have due?',
    icon: <BookOpen className="h-4 w-4" />
  },
  {
    id: 'food',
    label: 'Food',
    prompt: 'Where can I get good food near campus?',
    icon: <Coffee className="h-4 w-4" />
  },
  {
    id: 'forms',
    label: 'Forms',
    prompt: 'What administrative forms might I need?',
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: 'events',
    label: 'Events',
    prompt: 'What events are happening soon?',
    icon: <CalendarClock className="h-4 w-4" />
  }
];

const QuickActions: React.FC = () => {
  const { addAIResponse } = useChatContext();

  const handleQuickAction = (prompt: string) => {
    addAIResponse(prompt);
  };

  return (
    <div className="py-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2 px-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-2 px-4">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            className="border-campus-secondary text-campus-secondary hover:bg-campus-light flex items-center gap-1"
            onClick={() => handleQuickAction(action.prompt)}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

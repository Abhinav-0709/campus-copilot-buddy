
import React, { useState } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ReminderForm: React.FC = () => {
  const { addReminder } = useChatContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a reminder title');
      return;
    }

    if (!date) {
      toast.error('Please select a due date');
      return;
    }

    addReminder(title, description, date);
    toast.success('Reminder created successfully!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setDate(new Date());
    setIsOpen(false);
  };

  return (
    <div className="p-4 border-t">
      <h3 className="font-medium mb-3">Create Reminder</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Submit assignment"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details here..."
            className="mt-1 resize-none"
            rows={2}
          />
        </div>
        
        <div>
          <Label htmlFor="date">Due Date</Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  setIsOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-campus-secondary hover:bg-campus-primary text-white"
        >
          Create Reminder
        </Button>
      </form>
    </div>
  );
};

export default ReminderForm;

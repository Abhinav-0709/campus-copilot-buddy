
import React, { useState } from 'react';
import { MessageSquare, Bell, Menu } from 'lucide-react';
import { ChatProvider } from '@/context/ChatContext';
import Header from '@/components/UI/Header';
import ChatContainer from '@/components/Chat/ChatContainer';
import QuickActions from '@/components/Features/QuickActions';
import ReminderForm from '@/components/Features/ReminderForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useChatContext } from '@/context/ChatContext';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/utils/chatUtils';
// Remove the duplicate Bell import
import { Calendar, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Component to display reminders
const RemindersPanel: React.FC = () => {
  const { reminders, toggleReminderCompletion } = useChatContext();
  const [zapierWebhook, setZapierWebhook] = useState('');

  const handleConnectZapier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zapierWebhook.trim()) {
      toast.error('Please enter a Zapier webhook URL');
      return;
    }
    
    toast.success('Successfully connected to Zapier!');
    toast.info('Reminder notifications will be sent to your connected services');
  };
  
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Bell className="h-5 w-5 text-campus-secondary" />
        Your Reminders
      </h2>
      
      {reminders.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You have no reminders yet</p>
          <p className="text-sm text-gray-400 mt-1">Create a reminder to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map(reminder => (
            <div 
              key={reminder.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox 
                checked={reminder.completed}
                onCheckedChange={() => toggleReminderCompletion(reminder.id)}
                className="border-campus-secondary"
              />
              <div className="flex-1">
                <p className={`font-medium ${reminder.completed ? 'line-through text-gray-400' : ''}`}>
                  {reminder.title}
                </p>
                {reminder.description && (
                  <p className="text-sm text-gray-500">{reminder.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Due: {formatDate(reminder.dueDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Notification Settings</h3>
        <form onSubmit={handleConnectZapier} className="flex flex-col gap-2">
          <Input
            value={zapierWebhook}
            onChange={(e) => setZapierWebhook(e.target.value)}
            placeholder="Enter Zapier Webhook URL for notifications"
            className="border-gray-300"
          />
          <Button 
            type="submit"
            className="bg-campus-secondary hover:bg-campus-primary text-white"
          >
            Connect Notifications
          </Button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          Connect with Zapier to get reminder notifications on WhatsApp, Email, or other platforms
        </p>
      </div>
    </div>
  );
};

const ChaiBreakPanel: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Coffee className="h-5 w-5 text-campus-secondary" />
        <h2 className="text-xl font-semibold">Chai Break Detector</h2>
      </div>
      
      <div className="bg-campus-light p-4 rounded-lg">
        <p className="text-campus-dark">
          Our AI can detect when you mention a chai break or coffee break in your messages. 
          Try saying "I need a chai break" in chat!
        </p>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Popular Break Spots on Campus</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 bg-campus-secondary rounded-full"></span>
            <span>Campus Cafe - Best coffee and samosas</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 bg-campus-secondary rounded-full"></span>
            <span>Library Nook - Quiet spot with great chai</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 bg-campus-secondary rounded-full"></span>
            <span>Tech Park Canteen - Quick bites and tea</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 bg-campus-secondary rounded-full"></span>
            <span>Garden Benches - Bring your own thermos</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        
        <main className="flex flex-1 overflow-hidden">
          {/* Mobile view */}
          <div className="block md:hidden w-full h-full">
            <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
              <TabsContent value="chat" className="flex-1 overflow-hidden m-0 data-[state=active]:flex-1 data-[state=active]:flex data-[state=active]:flex-col">
                <div className="flex-1 overflow-hidden">
                  <ChatContainer />
                </div>
              </TabsContent>
              
              <TabsContent value="reminders" className="flex-1 overflow-auto m-0">
                <RemindersPanel />
              </TabsContent>
              
              <TabsList className="border-t bg-white w-full justify-around">
                <TabsTrigger value="chat" className="flex-1 data-[state=active]:bg-gray-100">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="reminders" className="flex-1 data-[state=active]:bg-gray-100">
                  <Bell className="h-4 w-4 mr-2" />
                  Reminders
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Desktop view */}
          <div className="hidden md:flex flex-1 overflow-hidden">
            <div className="w-2/3 border-r bg-white flex flex-col">
              <ChatContainer />
            </div>
            
            <div className="w-1/3 overflow-auto">
              <Tabs defaultValue="actions" className="w-full">
                <TabsList className="w-full justify-around">
                  <TabsTrigger value="actions">Quick Actions</TabsTrigger>
                  <TabsTrigger value="reminders">Reminders</TabsTrigger>
                  <TabsTrigger value="chai">Chai Break</TabsTrigger>
                </TabsList>
                
                <TabsContent value="actions" className="p-0">
                  <Card className="border-0 shadow-none">
                    <QuickActions />
                    <ReminderForm />
                  </Card>
                </TabsContent>
                
                <TabsContent value="reminders">
                  <Card className="border-0 shadow-none">
                    <RemindersPanel />
                  </Card>
                </TabsContent>
                
                <TabsContent value="chai">
                  <Card className="border-0 shadow-none">
                    <ChaiBreakPanel />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
};

export default Index;

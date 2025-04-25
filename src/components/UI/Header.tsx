
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Bell, Menu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-campus-primary text-white">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">CampusCopilot</h1>
        <span className="ml-2 text-xs bg-campus-secondary rounded-full px-2 py-0.5">
          Beta
        </span>
      </div>
      
      <Tabs defaultValue="chat" className="hidden md:block">
        <TabsList className="bg-campus-dark">
          <TabsTrigger value="chat" className="text-white data-[state=active]:bg-campus-secondary">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="reminders" className="text-white data-[state=active]:bg-campus-secondary">
            <Bell className="h-4 w-4 mr-2" />
            Reminders
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <button className="md:hidden p-2 rounded hover:bg-campus-dark">
        <Menu className="h-5 w-5" />
      </button>
    </header>
  );
};

export default Header;

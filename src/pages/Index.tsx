import React from 'react';
import Spreadsheet from '@/components/Spreadsheet';
import ChatInterface from '@/components/ChatInterface';
import BusinessLogic from '@/components/BusinessLogic';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { MainNav } from '@/components/MainNav';
import { UserNav } from '@/components/UserNav';

const Index = () => {
  const { isLoading, user } = useAuth();
  const { hasPermission } = usePermissions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Planning Application</h1>
          <UserNav />
        </div>
        
        <MainNav />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Spreadsheet</h2>
                <Spreadsheet />
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Business Logic</h2>
                <BusinessLogic />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Chat Interface</h2>
                <ChatInterface />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
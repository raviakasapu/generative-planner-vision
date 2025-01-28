import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spreadsheet from '@/components/Spreadsheet';
import ChatInterface from '@/components/ChatInterface';
import BusinessLogic from '@/components/BusinessLogic';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from "@/hooks/use-toast";
import { MainNav } from '@/components/MainNav';

const Index = () => {
  const { isLoading, user } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have successfully signed out.',
    });
    navigate('/auth');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Planning Application</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
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
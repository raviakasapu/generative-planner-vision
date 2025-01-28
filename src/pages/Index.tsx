import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spreadsheet from '@/components/Spreadsheet';
import ChatInterface from '@/components/ChatInterface';
import BusinessLogic from '@/components/BusinessLogic';
import MasterData from '@/components/MasterData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/integrations/supabase/client';
import { LogOut, User } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { isLoading, userRole, user } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Please log in to access the planning system.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enterprise Planning System</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary p-2 rounded-lg">
            <Avatar>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{user.email}</div>
              <div className="text-xs text-muted-foreground">
                Logged in: {new Date(user.last_sign_in_at || '').toLocaleTimeString()}
              </div>
            </div>
          </div>
          {userRole === 'admin' && (
            <Button asChild variant="outline">
              <Link to="/admin">Admin Panel</Link>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hasPermission('view_planning_data') && (
          <div className="lg:col-span-2">
            <Spreadsheet />
          </div>
        )}
        <div>
          <ChatInterface />
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue="business-logic">
          <TabsList>
            <TabsTrigger value="business-logic">Business Logic</TabsTrigger>
            <TabsTrigger value="master-data">Master Data</TabsTrigger>
          </TabsList>
          {hasPermission('execute_business_rules') && (
            <TabsContent value="business-logic">
              <BusinessLogic />
            </TabsContent>
          )}
          {hasPermission('view_master_data') && (
            <TabsContent value="master-data">
              <MasterData />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from '@/components/admin/UserManagement';
import { SystemAnalytics } from '@/components/admin/SystemAnalytics';

const Admin = () => {
  const { userRole } = useAuth();

  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <SystemAnalytics />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
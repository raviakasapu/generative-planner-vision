import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search, UserCog, Menu } from 'lucide-react';
import { RoleManagementDialog } from '@/components/RoleManagementDialog';
import { DataAccessDialog } from '@/components/DataAccessDialog';
import { TaskAssignmentDialog } from '@/components/TaskAssignmentDialog';
import { UserStats } from '@/components/users/UserStats';
import { UserCharts } from '@/components/users/UserCharts';
import { UserTable } from '@/components/users/UserTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface UserProfile {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
  email?: string | null;
}

const UserManagement = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<string>('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDataAccessDialogOpen, setIsDataAccessDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching user profiles...');
      const { data: profiles, error: profilesError } = await supabase
        .from('userprofiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        throw profilesError;
      }

      if (!profiles || profiles.length === 0) {
        console.log('No user profiles found');
        return [];
      }

      console.log('Found profiles:', profiles);

      const { data: adminData, error: adminError } = await supabase.functions.invoke('get-user-emails', {
        body: { userIds: profiles.map((profile: UserProfile) => profile.id) }
      });

      if (adminError) {
        console.error('Error fetching user emails:', adminError);
        throw adminError;
      }

      console.log('Admin data received:', adminData);

      const combinedData = profiles.map((profile: UserProfile) => {
        const userEmail = adminData?.emails?.[profile.id] || null;
        return {
          ...profile,
          email: userEmail
        };
      });

      console.log('Combined data:', combinedData);
      return combinedData;
    },
  });

  const handleRoleManagement = (userId: string, currentRole: string) => {
    setSelectedUserId(userId);
    setSelectedUserRole(currentRole);
    setIsRoleDialogOpen(true);
  };

  const handleDataAccess = (userId: string) => {
    setSelectedUserId(userId);
    setIsDataAccessDialogOpen(true);
  };

  const handleTaskAssignment = (userId: string) => {
    setSelectedUserId(userId);
    setIsTaskDialogOpen(true);
  };

  const filteredUsers = users?.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const roleStats = users?.reduce((acc, user) => {
    const role = user.role || 'user';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const roleChartData = Object.entries(roleStats).map(([name, value]) => ({
    name,
    value
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading users...
      </div>
    );
  }

  if (error) {
    console.error('Error in UserManagement:', error);
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500">
          Error loading users: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          User Management
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Export Users
            </DropdownMenuItem>
            <DropdownMenuItem>
              Import Users
            </DropdownMenuItem>
            <DropdownMenuItem>
              Bulk Actions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <UserStats totalUsers={filteredUsers.length} />
        <UserCharts roleChartData={roleChartData} />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search users by name, role, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <UserTable
        users={filteredUsers}
        onRoleManagement={handleRoleManagement}
        onDataAccess={handleDataAccess}
        onTaskAssignment={handleTaskAssignment}
      />

      {selectedUserId && (
        <>
          <RoleManagementDialog
            isOpen={isRoleDialogOpen}
            onClose={() => setIsRoleDialogOpen(false)}
            userId={selectedUserId}
            currentRole={selectedUserRole}
          />
          <DataAccessDialog
            isOpen={isDataAccessDialogOpen}
            onClose={() => setIsDataAccessDialogOpen(false)}
            userId={selectedUserId}
          />
          <TaskAssignmentDialog
            isOpen={isTaskDialogOpen}
            onClose={() => setIsTaskDialogOpen(false)}
            userId={selectedUserId}
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;
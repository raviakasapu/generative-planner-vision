import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MainNav } from '@/components/MainNav';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCog, Lock, CheckSquare, Search, Menu } from 'lucide-react';
import { RoleManagementDialog } from '@/components/RoleManagementDialog';
import { DataAccessDialog } from '@/components/DataAccessDialog';
import { TaskAssignmentDialog } from '@/components/TaskAssignmentDialog';
import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';

const UserManagement = () => {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<string>('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDataAccessDialogOpen, setIsDataAccessDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('userprofiles')
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch users',
          variant: 'destructive',
        });
        throw error;
      }

      return profiles;
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
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500">
          Error loading users. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <MainNav />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          User Management
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <Menu className="h-4 w-4" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Export Users</MenubarItem>
                <MenubarItem>Import Users</MenubarItem>
                <MenubarItem>Bulk Actions</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || 'N/A'}</TableCell>
                <TableCell>{user.role || 'user'}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <UserCog className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleRoleManagement(user.id, user.role || 'user')}
                        className="flex items-center gap-2"
                      >
                        <UserCog className="h-4 w-4" />
                        Manage Role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDataAccess(user.id)}
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" />
                        Data Access
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTaskAssignment(user.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckSquare className="h-4 w-4" />
                        Assign Tasks
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
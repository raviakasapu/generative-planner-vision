import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCog, Lock, CheckSquare, Search, Users, Mail } from 'lucide-react';
import { RoleManagementDialog } from '@/components/RoleManagementDialog';
import { DataAccessDialog } from '@/components/DataAccessDialog';
import { TaskAssignmentDialog } from '@/components/TaskAssignmentDialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserProfile {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

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
      // Get user profiles from the public schema
      const { data: profiles, error: profilesError } = await supabase
        .from('userprofiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        throw profilesError;
      }

      // Get user emails through the admin API
      const { data: adminData, error: adminError } = await supabase.functions.invoke('get-user-emails', {
        body: { userIds: profiles.map((profile: UserProfile) => profile.id) }
      });

      if (adminError) {
        console.error('Error fetching user emails:', adminError);
        throw adminError;
      }

      // Combine the data
      return profiles.map((profile: UserProfile) => {
        const userEmail = adminData?.emails?.[profile.id] || null;
        return {
          ...profile,
          email: userEmail
        };
      });
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
  );

  // Prepare data for charts
  const roleStats = users?.reduce((acc, user) => {
    const role = user.role || 'user';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleChartData = roleStats ? Object.entries(roleStats).map(([name, value]) => ({
    name,
    value
  })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          User Management
        </h1>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>

        {/* Role Distribution Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Roles Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div className="w-1/2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || 'N/A'}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {user.email || 'N/A'}
                </TableCell>
                <TableCell>{user.role || 'user'}</TableCell>
                <TableCell>
                  {format(new Date(user.created_at), 'PPp')}
                </TableCell>
                <TableCell>
                  {format(new Date(user.updated_at), 'PPp')}
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
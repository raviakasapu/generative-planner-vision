import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const UserManagement = () => {
  const { toast } = useToast();

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('userprofiles')
        .select('*');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    }
  });

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('userprofiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono">{user.id}</TableCell>
              <TableCell>{user.full_name || 'N/A'}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserRole(user.id, 'admin')}
                    disabled={user.role === 'admin'}
                  >
                    Make Admin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserRole(user.id, 'user')}
                    disabled={user.role === 'user'}
                  >
                    Make User
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
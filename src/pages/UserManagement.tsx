import { MainNav } from '@/components/MainNav';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RoleManagementDialog } from '@/components/RoleManagementDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const UserManagementPage = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<{ id: string; role: string } | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('userprofiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching users',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
  });

  const handleRoleUpdate = (userId: string, currentRole: string) => {
    setSelectedUser({ id: userId, role: currentRole });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MainNav />
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono">{user.id}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleRoleUpdate(user.id, user.role)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Change Role
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <RoleManagementDialog
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          userId={selectedUser.id}
          currentRole={selectedUser.role}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
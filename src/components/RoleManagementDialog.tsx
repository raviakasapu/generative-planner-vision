import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface RoleManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentRole: string;
}

export function RoleManagementDialog({
  isOpen,
  onClose,
  userId,
  currentRole,
}: RoleManagementDialogProps) {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = React.useState(currentRole);

  // Fetch available roles from the roles table
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('id, role_name, role_description');

      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleUpdateRole = async () => {
    try {
      const { error } = await supabase
        .from('userprofiles')
        .update({ role: selectedRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${selectedRole}`,
      });
      onClose();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  if (rolesLoading) {
    return null; // Or show a loading spinner
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage User Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((role) => (
                <SelectItem key={role.id} value={role.role_name}>
                  {role.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleUpdateRole} className="w-full">
            Update Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
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
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
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
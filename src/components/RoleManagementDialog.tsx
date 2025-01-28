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
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

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
      console.log('Starting role update process...');
      console.log('User ID:', userId);
      console.log('Current Role:', currentRole);
      console.log('New Role:', selectedRole);

      // First update the user profile with upsert to ensure the record exists
      const { data: profileData, error: profileError } = await supabase
        .from('userprofiles')
        .upsert({ 
          id: userId,
          role: selectedRole,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select('*');

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
      }

      console.log('Profile updated successfully:', profileData);

      // Then log the role change in the audit table
      const { error: auditError } = await supabase
        .from('role_change_audit')
        .insert([{
          user_id: userId,
          previous_role: currentRole,
          new_role: selectedRole,
          changed_by: user?.id,
          changed_at: new Date().toISOString()
        }]);

      if (auditError) {
        console.error('Error creating audit log:', auditError);
        throw auditError;
      }

      console.log('Audit log created successfully');

      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${selectedRole}`,
      });
      
      onClose();
      
      // Force a page reload to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (rolesLoading) {
    return null;
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
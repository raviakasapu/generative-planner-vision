import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface RoleManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentRole: string | null;
}

export function RoleManagementDialog({
  isOpen,
  onClose,
  userId,
  currentRole,
}: RoleManagementDialogProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole || '');
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('s_roles')
        .select('*')
        .order('role_name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleUpdateRole = async () => {
    if (!user) return;

    try {
      // Update user profile
      const { error: updateError } = await supabase
        .from('s_user_profiles')
        .update({ role: selectedRole })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Log role change
      const { error: auditError } = await supabase
        .from('audit_role_change')
        .insert([
          {
            user_id: userId,
            previous_role: currentRole,
            new_role: selectedRole,
            changed_by: user.id,
          },
        ]);

      if (auditError) throw auditError;

      toast({
        title: "Success",
        description: "Role updated successfully",
      });

      onClose();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
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
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {roles?.map((role) => (
                <SelectItem key={role.id} value={role.role_name}>
                  {role.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleUpdateRole} disabled={!selectedRole}>
            Update Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

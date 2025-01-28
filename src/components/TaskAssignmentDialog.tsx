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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface TaskAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function TaskAssignmentDialog({
  isOpen,
  onClose,
  userId,
}: TaskAssignmentDialogProps) {
  const { toast } = useToast();
  const [taskName, setTaskName] = React.useState('');
  const [taskDescription, setTaskDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [selectedPermission, setSelectedPermission] = React.useState('');

  // Fetch available permissions from the permissions table
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('id, permission_name, permission_description');

      if (error) {
        console.error('Error fetching permissions:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleAssignTask = async () => {
    try {
      const { error } = await supabase.from('task_assignments').insert({
        user_id: userId,
        task_name: taskName,
        task_description: taskDescription,
        due_date: dueDate,
        status: 'pending',
        permission_id: selectedPermission,
      });

      if (error) throw error;

      toast({
        title: 'Task Assigned',
        description: 'Task has been assigned successfully',
      });
      onClose();
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign task',
        variant: 'destructive',
      });
    }
  };

  if (permissionsLoading) {
    return null; // Or show a loading spinner
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <Textarea
            placeholder="Task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Select value={selectedPermission} onValueChange={setSelectedPermission}>
            <SelectTrigger>
              <SelectValue placeholder="Select permission" />
            </SelectTrigger>
            <SelectContent>
              {permissions?.map((permission) => (
                <SelectItem key={permission.id} value={permission.id}>
                  {permission.permission_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Button
            onClick={handleAssignTask}
            className="w-full"
            disabled={!taskName || !selectedPermission || !dueDate}
          >
            Assign Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
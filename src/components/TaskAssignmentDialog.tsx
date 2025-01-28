import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const handleAssignTask = async () => {
    try {
      const { error } = await supabase.from('task_assignments').insert({
        user_id: userId,
        task_name: taskName,
        task_description: taskDescription,
        due_date: dueDate,
        status: 'pending',
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
          <Input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Button
            onClick={handleAssignTask}
            className="w-full"
            disabled={!taskName || !dueDate}
          >
            Assign Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
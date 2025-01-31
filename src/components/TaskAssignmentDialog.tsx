import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TaskAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskAssignmentDialog({
  isOpen,
  onClose,
}: TaskAssignmentDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [assignedUserId, setAssignedUserId] = useState<string | null>(null);

  const handleCreateTask = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('s_task_assignments')
        .insert([
          {
            user_id: assignedUserId,
            task_name: taskName,
            task_description: taskDescription,
            due_date: dueDate?.toISOString(),
            status: 'pending',
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
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
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <Textarea
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Input
            type="date"
            value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
          />
          <Button
            onClick={handleCreateTask}
            className="w-full"
            disabled={!taskName}
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

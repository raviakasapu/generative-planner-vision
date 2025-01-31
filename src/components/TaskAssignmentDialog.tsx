import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface TaskAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function TaskAssignmentDialog({ isOpen, onClose, userId }: TaskAssignmentDialogProps) {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const { toast } = useToast();

  const handleAssignTask = async () => {
    try {
      const { error } = await supabase
        .from('s_task_assignments')
        .insert({
          user_id: userId,
          task_name: taskName,
          task_description: taskDescription,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task assigned successfully.",
      });
      onClose();
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: "Error",
        description: "Failed to assign task.",
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
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="input"
          />
          <textarea
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="textarea"
          />
          <Button onClick={handleAssignTask} disabled={!taskName}>
            Assign Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

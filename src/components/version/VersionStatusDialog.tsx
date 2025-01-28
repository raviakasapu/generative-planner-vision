import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import type { Version } from './types';

interface VersionStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  version: Version;
  onSuccess: () => void;
}

export function VersionStatusDialog({
  isOpen,
  onClose,
  version,
  onSuccess,
}: VersionStatusDialogProps) {
  const [newStatus, setNewStatus] = React.useState(version.version_status);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setNewStatus(version.version_status);
  }, [version.version_status]);

  const getStatusUpdateErrorMessage = (status: string, error?: any) => {
    const statusMessages = {
      'draft': 'Only planners can update versions in draft status',
      'in_review': 'Only approvers and admins can update versions in review',
      'approved': 'You need special permissions to update approved versions',
      'published': 'Published versions can only be modified by authorized personnel',
      'archived': 'Archived versions cannot be modified'
    };

    if (error?.message?.includes('row-level security')) {
      return `Access denied: ${statusMessages[status as keyof typeof statusMessages] || 'You do not have permission to perform this action'}`;
    }

    return error?.message || 'An unexpected error occurred while updating the version status';
  };

  const handleStatusChange = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to update version status",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Updating version status:', {
        id: version.id,
        newStatus,
        currentStatus: version.version_status
      });

      // First check if the version exists
      const { data: currentVersion, error: checkError } = await supabase
        .from('masterversiondimension')
        .select()
        .eq('id', version.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking version:', checkError);
        throw new Error('Unable to verify version status. Please try again later.');
      }

      if (!currentVersion) {
        throw new Error('This version no longer exists or you do not have permission to access it.');
      }

      // Update version status
      const { data: versionUpdate, error: versionError } = await supabase
        .from('masterversiondimension')
        .update({ 
          version_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', version.id)
        .select()
        .maybeSingle();

      if (versionError) {
        console.error('Error updating version status:', versionError);
        throw new Error(getStatusUpdateErrorMessage(version.version_status, versionError));
      }

      if (!versionUpdate) {
        throw new Error('Unable to update version status. This might be due to insufficient permissions or the version has been modified by another user.');
      }

      // Create audit log entry
      const { error: auditError } = await supabase
        .from('version_status_audit')
        .insert({
          version_id: version.id,
          user_id: user.id,
          previous_status: version.version_status,
          new_status: newStatus,
        });

      if (auditError) {
        console.error('Error creating audit log:', auditError);
        // Even if audit log fails, we don't want to roll back the status update
        toast({
          title: "Status Updated",
          description: "Version status was updated but there was an issue logging the change.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Version status successfully updated from ${version.version_status} to ${newStatus}`,
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast({
        title: "Status Update Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred while updating the version status",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Version Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            Current status: {version.version_status}
          </div>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleStatusChange}
            className="w-full"
            disabled={newStatus === version.version_status}
          >
            Update Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
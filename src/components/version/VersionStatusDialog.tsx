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

  const handleStatusChange = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
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
        throw checkError;
      }

      if (!currentVersion) {
        throw new Error('Version not found');
      }

      // Update version status
      const { data: versionUpdate, error: versionError } = await supabase
        .from('masterversiondimension')
        .update({ version_status: newStatus })
        .eq('id', version.id)
        .select()
        .maybeSingle();

      if (versionError) {
        console.error('Error updating version status:', versionError);
        throw versionError;
      }

      if (!versionUpdate) {
        console.error('No version was updated');
        throw new Error('Failed to update version status');
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
          title: "Warning",
          description: "Version status updated but audit log creation failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Version status updated to ${newStatus}`,
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating version status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update version status",
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
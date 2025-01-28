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

      // Start a transaction to update both the version status and create an audit log
      const { data: versionUpdate, error: versionError } = await supabase
        .from('masterversiondimension')
        .update({ version_status: newStatus })
        .eq('id', version.id)
        .select()
        .single();

      if (versionError) {
        console.error('Error updating version status:', versionError);
        throw versionError;
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
        throw auditError;
      }

      toast({
        title: "Success",
        description: `Version status updated to ${newStatus}`,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating version status:', error);
      toast({
        title: "Error",
        description: "Failed to update version status",
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
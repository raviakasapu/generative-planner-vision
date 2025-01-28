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

  // Update newStatus when version changes
  useEffect(() => {
    setNewStatus(version.version_status);
  }, [version.version_status]);

  const handleStatusChange = async () => {
    try {
      console.log('Updating version status:', {
        id: version.id,
        newStatus,
        currentStatus: version.version_status
      });

      const { error } = await supabase
        .from('masterversiondimension')
        .update({ version_status: newStatus })
        .eq('id', version.id);

      if (error) {
        console.error('Error updating version status:', error);
        throw error;
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
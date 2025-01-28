import React from 'react';
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

interface VersionStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  version: {
    id: string;
    version_status: string;
  };
  onSuccess: () => void;
}

export function VersionStatusDialog({
  isOpen,
  onClose,
  version,
  onSuccess,
}: VersionStatusDialogProps) {
  const [newStatus, setNewStatus] = React.useState(version.version_status);

  const handleStatusChange = async () => {
    try {
      const { error } = await supabase
        .from('masterversiondimension')
        .update({ version_status: newStatus })
        .eq('id', version.id);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating version status:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Version Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
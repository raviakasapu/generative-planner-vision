import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface VersionStatusDialogProps {
  versionId: string;
  currentStatus: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: () => void;
}

export const VersionStatusDialog: React.FC<VersionStatusDialogProps> = ({
  versionId,
  currentStatus,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStatusChange = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Update version status
      const { error: versionError } = await supabase
        .from('m_u_version')
        .update({ 
          attributes: {
            version_status: newStatus
          }
        })
        .eq('id', versionId);

      if (versionError) throw versionError;

      // Create audit log
      const { error: auditError } = await supabase
        .from('audit_version_status')
        .insert({
          version_id: versionId,
          user_id: user.id,
          previous_status: currentStatus,
          new_status: newStatus
        });

      if (auditError) throw auditError;

      toast({
        title: "Success",
        description: "Version status updated successfully",
      });

      onStatusChange();
      onClose();
    } catch (error) {
      console.error('Error updating version status:', error);
      toast({
        title: "Error",
        description: "Failed to update version status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Version Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <Button onClick={handleStatusChange} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
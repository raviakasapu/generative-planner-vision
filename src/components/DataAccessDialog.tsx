import React, { useState } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

type DimensionType = 'dimension1' | 'dimension2' | 'time';

interface DataAccessDialogProps {
  userId: string;
  isOpen: boolean;
  onClose?: () => void;
}

const DataAccessDialog: React.FC<DataAccessDialogProps> = ({ userId, isOpen, onClose }) => {
  const [selectedDimensionType, setSelectedDimensionType] = useState<DimensionType | ''>('');
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('read');
  const { toast } = useToast();
  
  const handleSave = async () => {
    try {
      if (!selectedDimensionType || !selectedDimensionId) {
        toast({
          title: "Error",
          description: "Please select both dimension type and access level",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('data_access_permissions')
        .insert([
          {
            user_id: userId,
            dimension_type: selectedDimensionType,
            dimension_id: selectedDimensionId,
            access_level: accessLevel,
            approval_status: 'pending'
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error saving data access:', error);
        toast({
          title: "Error",
          description: "Failed to save data access permission",
          variant: "destructive",
        });
        return;
      }

      console.log('Data access permission created:', data);
      toast({
        title: "Success",
        description: "Data access permission request has been submitted for approval",
      });

      if (onClose) onClose();
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Data Access Management</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select 
              value={selectedDimensionType}
              onValueChange={(value: DimensionType) => setSelectedDimensionType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dimension type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dimension1">Product Dimension</SelectItem>
                <SelectItem value="dimension2">Region Dimension</SelectItem>
                <SelectItem value="time">Time Dimension</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={accessLevel}
              onValueChange={setAccessLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} variant="default">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataAccessDialog;
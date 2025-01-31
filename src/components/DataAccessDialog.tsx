import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { DimensionTypeSelect } from './data-access/DimensionTypeSelect';
import { DimensionMemberSelect } from './data-access/DimensionMemberSelect';
import { AccessLevelSelect } from './data-access/AccessLevelSelect';
import { DimensionType } from './data-access/types';

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
          description: "Please select both dimension type and dimension member",
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
        .select()
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
            <DimensionTypeSelect
              value={selectedDimensionType}
              onChange={(value) => {
                setSelectedDimensionType(value);
                setSelectedDimensionId('');
              }}
            />

            {selectedDimensionType && (
              <DimensionMemberSelect
                dimensionType={selectedDimensionType}
                value={selectedDimensionId}
                onChange={setSelectedDimensionId}
              />
            )}

            <AccessLevelSelect
              value={accessLevel}
              onChange={setAccessLevel}
            />
          </div>
          <Button 
            onClick={handleSave} 
            variant="default"
            disabled={!selectedDimensionType || !selectedDimensionId}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataAccessDialog;
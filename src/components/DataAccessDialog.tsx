import React, { useState, useEffect } from 'react';
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

type DimensionType = 'product' | 'region' | 'time' | 'version' | 'datasource' | 'layer';

interface DimensionMember {
  id: string;
  dimension_name: string;
  identifier: string;
  description: string | null;
}

interface DataAccessDialogProps {
  userId: string;
  isOpen: boolean;
  onClose?: () => void;
}

const DataAccessDialog: React.FC<DataAccessDialogProps> = ({ userId, isOpen, onClose }) => {
  const [selectedDimensionType, setSelectedDimensionType] = useState<DimensionType | ''>('');
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('read');
  const [dimensionMembers, setDimensionMembers] = useState<DimensionMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDimensionMembers = async () => {
      if (!selectedDimensionType) {
        setDimensionMembers([]);
        return;
      }

      setIsLoading(true);
      try {
        const tableName = `m_u_${selectedDimensionType}` as const;
        
        const { data, error } = await supabase
          .from(tableName)
          .select('id, dimension_name, identifier, description');

        if (error) {
          console.error('Error fetching dimension members:', error);
          toast({
            title: "Error",
            description: "Failed to fetch dimension members",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Ensure the data matches the DimensionMember interface
          const formattedData: DimensionMember[] = data.map(item => ({
            id: item.id,
            dimension_name: item.dimension_name,
            identifier: item.identifier,
            description: item.description
          }));
          setDimensionMembers(formattedData);
        }
      } catch (error) {
        console.error('Error in fetchDimensionMembers:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching dimension members",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDimensionMembers();
  }, [selectedDimensionType, toast]);

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
            <Select 
              value={selectedDimensionType}
              onValueChange={(value: DimensionType) => {
                setSelectedDimensionType(value);
                setSelectedDimensionId('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dimension type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product Dimension</SelectItem>
                <SelectItem value="region">Region Dimension</SelectItem>
                <SelectItem value="time">Time Dimension</SelectItem>
                <SelectItem value="version">Version Dimension</SelectItem>
                <SelectItem value="datasource">Data Source Dimension</SelectItem>
                <SelectItem value="layer">Layer Dimension</SelectItem>
              </SelectContent>
            </Select>

            {selectedDimensionType && (
              <Select
                value={selectedDimensionId}
                onValueChange={setSelectedDimensionId}
                disabled={isLoading || dimensionMembers.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Loading..." : "Select dimension member"} />
                </SelectTrigger>
                <SelectContent>
                  {dimensionMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.dimension_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

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
          <Button 
            onClick={handleSave} 
            variant="default"
            disabled={isLoading || !selectedDimensionType || !selectedDimensionId}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataAccessDialog;
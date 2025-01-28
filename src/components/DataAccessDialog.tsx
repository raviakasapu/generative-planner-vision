import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DataAccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function DataAccessDialog({ isOpen, onClose, userId }: DataAccessDialogProps) {
  const { toast } = useToast();
  const [dimensionType, setDimensionType] = React.useState('');
  const [dimensionId, setDimensionId] = React.useState('');
  const [accessLevel, setAccessLevel] = React.useState('');
  const [dimensions, setDimensions] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (dimensionType) {
      fetchDimensions();
    }
  }, [dimensionType]);

  const fetchDimensions = async () => {
    const tableName = dimensionType === 'time' ? 'mastertimedimension' :
      dimensionType === 'dimension1' ? 'masterdimension1' : 'masterdimension2';

    const { data, error } = await supabase
      .from(tableName)
      .select('id, dimension_name');

    if (error) {
      console.error('Error fetching dimensions:', error);
      return;
    }

    setDimensions(data || []);
  };

  const handleGrantAccess = async () => {
    try {
      const { error } = await supabase
        .from('data_access_permissions')
        .insert({
          user_id: userId,
          dimension_type: dimensionType,
          dimension_id: dimensionId,
          access_level: accessLevel,
        });

      if (error) throw error;

      toast({
        title: 'Access Granted',
        description: 'Data access permission has been granted successfully',
      });
      onClose();
    } catch (error) {
      console.error('Error granting access:', error);
      toast({
        title: 'Error',
        description: 'Failed to grant data access',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Data Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={dimensionType} onValueChange={setDimensionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select dimension type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dimension1">Products</SelectItem>
              <SelectItem value="dimension2">Regions</SelectItem>
              <SelectItem value="time">Time</SelectItem>
            </SelectContent>
          </Select>

          {dimensions.length > 0 && (
            <Select value={dimensionId} onValueChange={setDimensionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select dimension" />
              </SelectTrigger>
              <SelectContent>
                {dimensions.map((dim) => (
                  <SelectItem key={dim.id} value={dim.id}>
                    {dim.dimension_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={accessLevel} onValueChange={setAccessLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="write">Write</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleGrantAccess}
            className="w-full"
            disabled={!dimensionType || !dimensionId || !accessLevel}
          >
            Grant Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
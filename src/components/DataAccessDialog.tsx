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
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
      setIsSubmitting(true);

      // First check if permission already exists
      const { data: existingPermission, error: checkError } = await supabase
        .from('data_access_permissions')
        .select('id')
        .eq('user_id', userId)
        .eq('dimension_type', dimensionType)
        .eq('dimension_id', dimensionId)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      
      if (existingPermission) {
        // Update existing permission
        result = await supabase
          .from('data_access_permissions')
          .update({ access_level: accessLevel })
          .eq('id', existingPermission.id);
      } else {
        // Insert new permission
        result = await supabase
          .from('data_access_permissions')
          .insert({
            user_id: userId,
            dimension_type: dimensionType,
            dimension_id: dimensionId,
            access_level: accessLevel,
          });
      }

      if (result.error) throw result.error;

      toast({
        title: existingPermission ? 'Access Updated' : 'Access Granted',
        description: existingPermission 
          ? 'Data access permission has been updated successfully'
          : 'Data access permission has been granted successfully',
      });
      onClose();
    } catch (error) {
      console.error('Error managing access:', error);
      toast({
        title: 'Error',
        description: 'Failed to manage data access. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
            disabled={!dimensionType || !dimensionId || !accessLevel || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Grant Access'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
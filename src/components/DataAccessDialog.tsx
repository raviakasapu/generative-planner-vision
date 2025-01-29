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
    let tableName = '';
    let selectColumns = '';

    switch (dimensionType) {
      case 'dimension1':
        tableName = 'masterdimension1';
        selectColumns = 'id, dimension_name, product_id, product_description';
        break;
      case 'dimension2':
        tableName = 'masterdimension2';
        selectColumns = 'id, dimension_name, region_id, region_description';
        break;
      case 'time':
        tableName = 'mastertimedimension';
        selectColumns = 'id, dimension_name, month_id, month_name';
        break;
      default:
        return;
    }

    console.log(`Fetching dimensions from ${tableName}`);
    const { data, error } = await supabase
      .from(tableName)
      .select(selectColumns);

    if (error) {
      console.error('Error fetching dimensions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dimensions. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Fetched dimensions:', data);
    setDimensions(data || []);
  };

  const handleGrantAccess = async () => {
    try {
      setIsSubmitting(true);
      console.log('Granting access:', { userId, dimensionType, dimensionId, accessLevel });

      // First check if permission already exists
      const { data: existingPermission, error: checkError } = await supabase
        .from('data_access_permissions')
        .select('id')
        .eq('user_id', userId)
        .eq('dimension_type', dimensionType)
        .eq('dimension_id', dimensionId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing permission:', checkError);
        throw checkError;
      }

      console.log('Existing permission:', existingPermission);
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

      if (result.error) {
        console.error('Error managing access:', result.error);
        throw result.error;
      }

      console.log('Access granted/updated successfully');
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

  const getDimensionLabel = (dimension: any) => {
    switch (dimensionType) {
      case 'dimension1':
        return `${dimension.product_id} - ${dimension.product_description || 'No description'}`;
      case 'dimension2':
        return `${dimension.region_id} - ${dimension.region_description || 'No description'}`;
      case 'time':
        return `${dimension.month_id} - ${dimension.month_name || 'No name'}`;
      default:
        return dimension.dimension_name;
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
                    {getDimensionLabel(dim)}
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
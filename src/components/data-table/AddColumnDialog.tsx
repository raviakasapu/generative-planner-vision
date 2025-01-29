import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { NewColumnConfig } from './types';

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (config: NewColumnConfig) => void;
}

const AddColumnDialog: React.FC<AddColumnDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
}) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<NewColumnConfig>();

  const onSubmit = (data: NewColumnConfig) => {
    onAdd(data);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Column Name</label>
            <Input
              {...register('label', { required: 'Column name is required' })}
              placeholder="Enter column name"
            />
            {errors.label && (
              <p className="text-sm text-destructive">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data Type</label>
            <Select
              value={watch('type')}
              onValueChange={(value: 'dimension' | 'measure') => setValue('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dimension">Dimension</SelectItem>
                <SelectItem value="measure">Measure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (optional)</label>
            <Input
              {...register('description')}
              placeholder="Enter column description"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Column</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnDialog;
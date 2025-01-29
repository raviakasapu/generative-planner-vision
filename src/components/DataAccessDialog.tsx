import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DimensionType = 'dimension1' | 'dimension2' | 'time';

interface DataAccessDialogProps {
  userId: string;
  onClose?: () => void;
}

const DataAccessDialog: React.FC<DataAccessDialogProps> = ({ userId, onClose }) => {
  const [selectedDimensionType, setSelectedDimensionType] = useState<DimensionType | ''>('');
  
  const handleSave = () => {
    // Logic to save the selected dimension type for the user
    console.log(`Saving access for ${userId} to ${selectedDimensionType}`);
    if (onClose) onClose();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Data Access</Button>
      </DialogTrigger>
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
          </div>
          <Button onClick={handleSave} variant="primary">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataAccessDialog;

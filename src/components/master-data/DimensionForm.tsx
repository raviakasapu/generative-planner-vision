import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewDimension, DimensionTypeMetadata } from './types';

interface DimensionFormProps {
  newDimension: NewDimension;
  dimensionTypes: DimensionTypeMetadata[];
  onDimensionChange: (updates: Partial<NewDimension>) => void;
  onSubmit: () => void;
}

export const DimensionForm: React.FC<DimensionFormProps> = ({
  newDimension,
  dimensionTypes,
  onDimensionChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select
            value={newDimension.type}
            onValueChange={(value) => onDimensionChange({ type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dimension type" />
            </SelectTrigger>
            <SelectContent>
              {dimensionTypes.map((type) => (
                <SelectItem 
                  key={type.id} 
                  value={type.table_name.replace('m_u_', '')}
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ID</label>
          <Input
            value={newDimension.id}
            onChange={(e) => onDimensionChange({ id: e.target.value })}
            placeholder="Enter ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={newDimension.name}
            onChange={(e) => onDimensionChange({ name: e.target.value })}
            placeholder="Enter name"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSubmit}>Add Dimension</Button>
      </div>
    </div>
  );
};
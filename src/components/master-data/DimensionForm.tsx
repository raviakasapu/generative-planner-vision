import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewDimension, DimensionTypeMetadata } from './types';
import { Textarea } from "@/components/ui/textarea";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select
            value={newDimension.type}
            onValueChange={(value) => onDimensionChange({ type: value })}
          >
            <SelectTrigger className="w-full">
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

        <div>
          <label className="block text-sm font-medium mb-1">Hierarchy</label>
          <Input
            value={newDimension.hierarchy || ''}
            onChange={(e) => onDimensionChange({ hierarchy: e.target.value })}
            placeholder="Enter hierarchy"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={newDimension.description}
            onChange={(e) => onDimensionChange({ description: e.target.value })}
            placeholder="Enter description"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSubmit}>Add Master Data</Button>
      </div>
    </div>
  );
};
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DimensionType, NewDimension } from './types';

interface DimensionFormProps {
  newDimension: NewDimension;
  onDimensionChange: (updates: Partial<NewDimension>) => void;
  onSubmit: () => void;
}

export const DimensionForm = ({ 
  newDimension, 
  onDimensionChange,
  onSubmit 
}: DimensionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">ID</label>
          <Input
            value={newDimension.id}
            onChange={(e) => onDimensionChange({ id: e.target.value })}
            placeholder="Enter ID..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={newDimension.name}
            onChange={(e) => onDimensionChange({ name: e.target.value })}
            placeholder="Enter name..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            className="w-full border rounded-md p-2"
            value={newDimension.type}
            onChange={(e) => onDimensionChange({ type: e.target.value as DimensionType })}
          >
            <option value="product">Product</option>
            <option value="region">Region</option>
            <option value="datasource">Data Source</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            value={newDimension.description}
            onChange={(e) => onDimensionChange({ description: e.target.value })}
            placeholder="Enter description..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {newDimension.type === 'product' ? 'Category' : 
             newDimension.type === 'region' ? 'Country' : 
             'Data Source Type'}
          </label>
          <Input
            value={newDimension.category}
            onChange={(e) => onDimensionChange({ category: e.target.value })}
            placeholder="Enter category/country/type..."
          />
        </div>
        {newDimension.type === 'datasource' && (
          <div>
            <label className="block text-sm font-medium mb-1">System of Origin</label>
            <Input
              value={newDimension.systemOrigin}
              onChange={(e) => onDimensionChange({ systemOrigin: e.target.value })}
              placeholder="Enter system of origin..."
            />
          </div>
        )}
      </div>
      <Button onClick={onSubmit}>Add Master Data</Button>
    </div>
  );
};
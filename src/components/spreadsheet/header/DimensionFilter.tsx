import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnConfig } from '../types';

interface DimensionFilterProps {
  field: string;
  config: ColumnConfig;
  dimensionOptions: Array<{ id: string; label: string; value: string }>;
  onTypeChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  filterText: string;
  columnOptions: Array<{ value: string; label: string }>;
}

const DimensionFilter: React.FC<DimensionFilterProps> = ({
  field,
  config,
  dimensionOptions,
  onTypeChange,
  onFilterChange,
  filterText,
  columnOptions,
}) => {
  const resetFilter = () => {
    onFilterChange('');
  };

  return (
    <div className="space-y-2">
      <Select
        value={config.selectedColumn}
        onValueChange={onTypeChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select column" />
        </SelectTrigger>
        <SelectContent>
          {columnOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative">
        <Input
          placeholder="Filter..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full pr-8"
        />
        {filterText && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={resetFilter}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DimensionFilter;
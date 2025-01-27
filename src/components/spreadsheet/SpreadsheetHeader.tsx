import React from 'react';
import { GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnConfig } from './types';

interface SpreadsheetHeaderProps {
  field: string;
  config: ColumnConfig;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onSortChange: () => void;
  onTypeChange: (value: ColumnConfig['type']) => void;
  onFilterChange: (value: string) => void;
}

const SpreadsheetHeader: React.FC<SpreadsheetHeaderProps> = ({
  field,
  config,
  onDragStart,
  onDragOver,
  onDragEnd,
  onSortChange,
  onTypeChange,
  onFilterChange,
}) => {
  return (
    <th 
      className="border p-2 bg-muted font-medium cursor-move"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>{field}</span>
          <div className="flex items-center gap-2">
            <GripHorizontal className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onSortChange}
            >
              {config.sortOrder === 'asc' ? '↑' : config.sortOrder === 'desc' ? '↓' : '↕'}
            </Button>
          </div>
        </div>
        <Select
          value={config.type}
          onValueChange={onTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dimension">Dimension</SelectItem>
            <SelectItem value="attribute">Attribute</SelectItem>
            <SelectItem value="hierarchy">Hierarchy</SelectItem>
            <SelectItem value="measure">Measure</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter..."
          value={config.filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full"
        />
      </div>
    </th>
  );
};

export default SpreadsheetHeader;
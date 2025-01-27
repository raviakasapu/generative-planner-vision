import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { ColumnConfig, AggregationType } from './types';

interface SpreadsheetHeaderProps {
  field: string;
  config: ColumnConfig;
  onConfigUpdate: (updates: Partial<ColumnConfig>) => void;
}

const SpreadsheetHeader: React.FC<SpreadsheetHeaderProps> = ({
  field,
  config,
  onConfigUpdate,
}) => {
  const getDimensionColumns = (field: string) => {
    if (field === 'dimension1_id') {
      return [
        { value: 'product_id', label: 'Product ID' },
        { value: 'product_description', label: 'Product Description' },
        { value: 'category', label: 'Category' },
        { value: 'hierarchy_level', label: 'Hierarchy Level' },
      ];
    } else if (field === 'dimension2_id') {
      return [
        { value: 'region_id', label: 'Region ID' },
        { value: 'region_description', label: 'Region Description' },
        { value: 'country', label: 'Country' },
        { value: 'sales_manager', label: 'Sales Manager' },
      ];
    }
    return [];
  };

  const aggregationOptions: { value: AggregationType; label: string }[] = [
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' },
    { value: 'count', label: 'Count' },
  ];

  const dimensionColumns = getDimensionColumns(field);

  return (
    <th className="p-2 border bg-muted">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">{field}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onConfigUpdate({
              sortOrder: config.sortOrder === 'asc' ? 'desc' : 
                        config.sortOrder === 'desc' ? null : 'asc'
            })}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {config.type === 'dimension' && dimensionColumns.length > 0 && (
          <Select
            value={config.selectedColumn}
            onValueChange={(value) => onConfigUpdate({ selectedColumn: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {dimensionColumns.find(col => col.value === config.selectedColumn)?.label || 
                 'Select column'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {dimensionColumns.map((column) => (
                <SelectItem key={column.value} value={column.value}>
                  {column.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {config.type === 'measure' && (
          <Select
            value={config.aggregation}
            onValueChange={(value: AggregationType) => onConfigUpdate({ aggregation: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {aggregationOptions.find(opt => opt.value === config.aggregation)?.label || 
                 'Select aggregation'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {aggregationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Input
          placeholder="Filter..."
          value={config.filter}
          onChange={(e) => onConfigUpdate({ filter: e.target.value })}
          className="w-full"
        />
      </div>
    </th>
  );
};

export default SpreadsheetHeader;
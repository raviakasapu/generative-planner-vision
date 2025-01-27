import React, { useEffect, useState } from 'react';
import { GripHorizontal, X } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

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

interface DimensionOption {
  id: string;
  label: string;
  value: string;
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
  const [dimensionOptions, setDimensionOptions] = useState<DimensionOption[]>([]);
  const [filterText, setFilterText] = useState(config.filter || '');

  const measureOptions = [
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' },
    { value: 'count', label: 'Count' }
  ];

  const columnOptions = {
    dimension1_id: [
      { value: 'id', label: 'ID' },
      { value: 'product_id', label: 'Product ID' },
      { value: 'product_description', label: 'Product Description' },
      { value: 'category', label: 'Category' },
      { value: 'hierarchy_level', label: 'Hierarchy Level' }
    ],
    dimension2_id: [
      { value: 'id', label: 'ID' },
      { value: 'region_id', label: 'Region ID' },
      { value: 'region_description', label: 'Region Description' },
      { value: 'country', label: 'Country' },
      { value: 'sales_manager', label: 'Sales Manager' }
    ]
  };

  useEffect(() => {
    const fetchDimensionOptions = async () => {
      if (field === 'dimension1_id') {
        const { data, error } = await supabase
          .from('masterdimension1')
          .select('*')
          .ilike(config.selectedColumn || 'id', `%${filterText}%`);
        
        if (!error && data) {
          const options = data.map(item => ({
            id: item.id,
            label: item[config.selectedColumn as keyof typeof item]?.toString() || '',
            value: item.id
          }));
          setDimensionOptions(options);
        }
      } else if (field === 'dimension2_id') {
        const { data, error } = await supabase
          .from('masterdimension2')
          .select('*')
          .ilike(config.selectedColumn || 'id', `%${filterText}%`);
        
        if (!error && data) {
          const options = data.map(item => ({
            id: item.id,
            label: item[config.selectedColumn as keyof typeof item]?.toString() || '',
            value: item.id
          }));
          setDimensionOptions(options);
        }
      }
    };

    if (field.includes('dimension')) {
      fetchDimensionOptions();
    }
  }, [field, config.selectedColumn, filterText]);

  const handleFilterChange = (value: string) => {
    setFilterText(value);
    onFilterChange(value);
  };

  const resetFilter = () => {
    setFilterText('');
    onFilterChange('');
  };

  const isDimension = field.includes('dimension');
  const isMeasure = field.includes('measure');

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

        {isDimension && (
          <Select
            value={config.selectedColumn}
            onValueChange={(value) => onTypeChange(value as ColumnConfig['type'])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {columnOptions[field as keyof typeof columnOptions]?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {isMeasure && (
          <Select
            value={config.type}
            onValueChange={onTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select aggregation" />
            </SelectTrigger>
            <SelectContent>
              {measureOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="relative">
          <Input
            placeholder="Filter..."
            value={filterText}
            onChange={(e) => handleFilterChange(e.target.value)}
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
    </th>
  );
};

export default SpreadsheetHeader;
import React, { useEffect, useState } from 'react';
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
  const [selectedColumn, setSelectedColumn] = useState<string>('id');

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
          .select('*');
        
        if (!error && data) {
          const options = data.map(item => ({
            id: item.id,
            label: item[selectedColumn as keyof typeof item]?.toString() || '',
            value: item.id
          }));
          setDimensionOptions(options);
        }
      } else if (field === 'dimension2_id') {
        const { data, error } = await supabase
          .from('masterdimension2')
          .select('*');
        
        if (!error && data) {
          const options = data.map(item => ({
            id: item.id,
            label: item[selectedColumn as keyof typeof item]?.toString() || '',
            value: item.id
          }));
          setDimensionOptions(options);
        }
      }
    };

    if (field.includes('dimension')) {
      fetchDimensionOptions();
    }
  }, [field, selectedColumn]);

  const handleColumnSelect = (value: string) => {
    setSelectedColumn(value);
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
          <>
            <Select
              value={selectedColumn}
              onValueChange={handleColumnSelect}
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

            <Select
              value={config.filter}
              onValueChange={onFilterChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {dimensionOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
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

        {!isDimension && !isMeasure && (
          <Input
            placeholder="Filter..."
            value={config.filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full"
          />
        )}
      </div>
    </th>
  );
};

export default SpreadsheetHeader;
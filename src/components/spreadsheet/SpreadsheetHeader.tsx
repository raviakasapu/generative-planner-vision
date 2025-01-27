import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnConfig } from './types';
import HeaderControls from './header/HeaderControls';
import DimensionFilter from './header/DimensionFilter';

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
  const [dimensionOptions, setDimensionOptions] = useState<Array<{ label: string; value: string }>>([]);
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
      { value: 'product_id', label: 'Product ID' },
      { value: 'product_description', label: 'Product Description' },
      { value: 'category', label: 'Category' },
      { value: 'hierarchy_level', label: 'Hierarchy Level' }
    ],
    dimension2_id: [
      { value: 'region_id', label: 'Region ID' },
      { value: 'region_description', label: 'Region Description' },
      { value: 'country', label: 'Country' },
      { value: 'sales_manager', label: 'Sales Manager' }
    ]
  };

  useEffect(() => {
    if (!field.includes('dimension') || !config.selectedColumn) return;
    fetchDimensionOptions();
  }, [field, config.selectedColumn, filterText]);

  const fetchDimensionOptions = async () => {
    try {
      const tableName = field === 'dimension1_id' ? 'masterdimension1' : 'masterdimension2';
      const column = config.selectedColumn;

      if (!column) return;

      let query = supabase.from(tableName).select(`${column}`);

      if (filterText) {
        query = query.ilike(column, `%${filterText}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching dimension options:', error);
        return;
      }

      if (data) {
        const uniqueValues = [...new Set(data.map(item => item[column]))];
        const options = uniqueValues.map(value => ({
          label: String(value || ''),
          value: String(value || '')
        }));
        setDimensionOptions(options);
      }
    } catch (error) {
      console.error('Error in fetchDimensionOptions:', error);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterText(value);
    onFilterChange(value);
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
        <HeaderControls
          field={field}
          sortOrder={config.sortOrder}
          onSortChange={onSortChange}
        />

        {isDimension && (
          <DimensionFilter
            field={field}
            config={config}
            dimensionOptions={dimensionOptions}
            onTypeChange={onTypeChange}
            onFilterChange={handleFilterChange}
            filterText={filterText}
            columnOptions={columnOptions[field as keyof typeof columnOptions]}
          />
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
      </div>
    </th>
  );
};

export default SpreadsheetHeader;
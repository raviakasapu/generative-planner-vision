import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnConfig } from './types';
import { getDimensionValue, getDimensionAttributes } from './utils/dimensionUtils';

interface DataTableBodyProps {
  row: any;
  field: string;
  config: ColumnConfig;
  onChange: (value: string) => void;
  isEven: boolean;
}

const DataTableBody: React.FC<DataTableBodyProps> = ({
  row,
  field,
  config,
  onChange,
  isEven,
}) => {
  const getCellValue = () => {
    if (config.type === 'dimension') {
      return getDimensionValue(row, field);
    }
    
    const value = row[field];
    return value !== null && value !== undefined ? String(value) : '0';
  };

  const attributes = config.type === 'dimension' ? getDimensionAttributes(field, row) : null;

  return (
    <td className={`p-1 ${isEven ? 'bg-muted/30' : ''}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Input
              type={config.type === 'measure' ? 'number' : 'text'}
              value={getCellValue()}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-7 px-2 border-0 bg-transparent"
              readOnly={config.type === 'dimension'}
            />
          </div>
        </TooltipTrigger>
        {attributes && attributes.length > 0 && (
          <TooltipContent>
            <div className="space-y-1">
              {attributes.map(attr => (
                <div key={attr.label} className="flex justify-between gap-2">
                  <span className="font-medium">{attr.label}:</span>
                  <span>{attr.value}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </td>
  );
};

export default DataTableBody;
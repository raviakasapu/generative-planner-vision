import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnConfig } from './types';

interface DataTableBodyProps {
  row: any;
  field: string;
  config: ColumnConfig;
  onChange: (value: string) => void;
}

const DataTableBody: React.FC<DataTableBodyProps> = ({
  row,
  field,
  config,
  onChange,
}) => {
  const getCellValue = () => {
    if (config.type === 'dimension') {
      const dimensionData = field.startsWith('dimension1') ? row.masterdimension1 : row.masterdimension2;
      if (!dimensionData) return '-';
      const value = String(dimensionData[config.selectedColumn] || '');
      return value || '-';
    }
    const value = String(row[field] || '');
    return value || '0';
  };

  const getDimensionAttributes = () => {
    if (!config.dimensionAttributes?.length) return null;
    
    const dimensionData = field.startsWith('dimension1') ? row.masterdimension1 : row.masterdimension2;
    if (!dimensionData) return null;

    return config.dimensionAttributes.map(attr => ({
      label: attr,
      value: dimensionData[attr] || '-'
    }));
  };

  const attributes = getDimensionAttributes();

  return (
    <td className="p-2 border">
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Input
              type={config.type === 'measure' ? 'number' : 'text'}
              value={getCellValue()}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 px-2"
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
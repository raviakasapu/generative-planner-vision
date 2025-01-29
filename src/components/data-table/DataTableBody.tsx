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
      let dimensionData;
      switch (field) {
        case 'time_dimension_id':
          dimensionData = row.mastertimedimension;
          break;
        case 'version_dimension_id':
          dimensionData = row.masterversiondimension;
          break;
        case 'datasource_dimension_id':
          dimensionData = row.masterdatasourcedimension;
          break;
        case 'dimension1_id':
          dimensionData = row.masterdimension1;
          break;
        case 'dimension2_id':
          dimensionData = row.masterdimension2;
          break;
        default:
          dimensionData = null;
      }
      if (!dimensionData) return '-';
      const value = String(dimensionData[config.selectedColumn] || '');
      return value || '-';
    }
    const value = String(row[field] || '');
    return value || '0';
  };

  const getDimensionAttributes = () => {
    if (!config.dimensionAttributes?.length) return null;
    
    let dimensionData;
    switch (field) {
      case 'time_dimension_id':
        dimensionData = row.mastertimedimension;
        break;
      case 'version_dimension_id':
        dimensionData = row.masterversiondimension;
        break;
      case 'datasource_dimension_id':
        dimensionData = row.masterdatasourcedimension;
        break;
      case 'dimension1_id':
        dimensionData = row.masterdimension1;
        break;
      case 'dimension2_id':
        dimensionData = row.masterdimension2;
        break;
      default:
        dimensionData = null;
    }
    if (!dimensionData) return null;

    return config.dimensionAttributes.map(attr => ({
      label: attr,
      value: dimensionData[attr] || '-'
    }));
  };

  const attributes = getDimensionAttributes();

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
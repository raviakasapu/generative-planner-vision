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
      console.log('Getting cell value for field:', field);
      console.log('Row data:', row);
      
      let dimensionData;
      let businessIdField;
      
      // Map dimension fields to their corresponding business ID fields
      switch (field) {
        case 'time_dimension_id':
          dimensionData = row.mastertimedimension;
          businessIdField = 'month_id';
          console.log('Time dimension data:', dimensionData);
          break;
        case 'version_dimension_id':
          dimensionData = row.masterversiondimension;
          businessIdField = 'version_id';
          console.log('Version dimension data:', dimensionData);
          break;
        case 'datasource_dimension_id':
          dimensionData = row.masterdatasourcedimension;
          businessIdField = 'datasource_id';
          console.log('Datasource dimension data:', dimensionData);
          break;
        case 'dimension1_id':
          dimensionData = row.masterdimension1;
          businessIdField = 'product_id';
          console.log('Product dimension data:', dimensionData);
          break;
        case 'dimension2_id':
          dimensionData = row.masterdimension2;
          businessIdField = 'region_id';
          console.log('Region dimension data:', dimensionData);
          break;
        default:
          // Handle attribute columns
          if (field.includes('_')) {
            const [baseDimension, ...attributeParts] = field.split('_');
            const attributeName = attributeParts.join('_');
            
            switch (baseDimension) {
              case 'time':
                dimensionData = row.mastertimedimension;
                businessIdField = attributeName;
                break;
              case 'version':
                dimensionData = row.masterversiondimension;
                businessIdField = attributeName;
                break;
              case 'datasource':
                dimensionData = row.masterdatasourcedimension;
                businessIdField = attributeName;
                break;
              case 'dimension1':
                dimensionData = row.masterdimension1;
                businessIdField = attributeName;
                break;
              case 'dimension2':
                dimensionData = row.masterdimension2;
                businessIdField = attributeName;
                break;
            }
          }
      }

      if (!dimensionData) {
        console.log('No dimension data found for field:', field);
        return '-';
      }

      const value = dimensionData[businessIdField];
      console.log('Retrieved value:', value, 'using business ID field:', businessIdField);
      return value !== null && value !== undefined ? String(value) : '-';
    }
    
    // Handle measure type
    const value = row[field];
    return value !== null && value !== undefined ? String(value) : '0';
  };

  const getDimensionAttributes = () => {
    if (!config.dimensionAttributes?.length) return null;
    
    let dimensionData;
    const baseDimensionField = field.includes('_') ? field.split('_')[0] : field;
    
    // Map dimension fields to their corresponding dimension data
    switch (baseDimensionField) {
      case 'time_dimension_id':
      case 'time':
        dimensionData = row.mastertimedimension;
        break;
      case 'version_dimension_id':
      case 'version':
        dimensionData = row.masterversiondimension;
        break;
      case 'datasource_dimension_id':
      case 'datasource':
        dimensionData = row.masterdatasourcedimension;
        break;
      case 'dimension1_id':
      case 'dimension1':
        dimensionData = row.masterdimension1;
        break;
      case 'dimension2_id':
      case 'dimension2':
        dimensionData = row.masterdimension2;
        break;
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
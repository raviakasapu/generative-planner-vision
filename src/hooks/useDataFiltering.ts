import { useMemo } from 'react';
import { ColumnConfig } from '@/components/data-table/types';

export const useDataFiltering = (rawData: any[], columnConfigs: Record<string, ColumnConfig>) => {
  const filteredData = useMemo(() => {
    return rawData.filter(row => {
      return Object.entries(columnConfigs).every(([field, config]) => {
        if (!config.filter) return true;

        if (config.type === 'dimension') {
          let dimensionData;
          const baseDimensionField = field.includes('_') ? field.split('_').slice(0, -1).join('_') : field;
          const attributeName = field.includes('_') ? field.split('_').pop() : config.selectedColumn;
          
          switch (baseDimensionField) {
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
          
          if (!dimensionData) return true;
          
          const value = String(dimensionData[attributeName || config.selectedColumn] || '').toLowerCase();
          const filterValue = config.filter.toLowerCase();
          return value.includes(filterValue);
        } else {
          const value = Number(row[field] || 0);
          const filterValue = Number(config.filter);
          
          if (isNaN(filterValue)) return true;
          
          switch (config.filterOperator) {
            case 'gt':
              return value > filterValue;
            case 'gte':
              return value >= filterValue;
            case 'lt':
              return value < filterValue;
            case 'lte':
              return value <= filterValue;
            default:
              return value === filterValue;
          }
        }
      });
    });
  }, [rawData, columnConfigs]);

  return filteredData;
};
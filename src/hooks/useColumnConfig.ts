import { useState, useCallback } from 'react';
import { ColumnConfig, NewColumnConfig } from '@/components/data-table/types';

export const useColumnConfig = () => {
  const [columnConfigs, setColumnConfigs] = useState<Record<string, ColumnConfig>>({
    time_dimension_id: {
      field: 'time_dimension_id',
      type: 'dimension',
      label: 'Time Period',
      filter: '',
      sortOrder: null,
      selectedColumn: 'month_id',
      dimensionAttributes: ['month_id', 'quarter', 'year']
    },
    version_dimension_id: {
      field: 'version_dimension_id',
      type: 'dimension',
      label: 'Version',
      filter: '',
      sortOrder: null,
      selectedColumn: 'version_id',
      dimensionAttributes: ['version_id', 'version_type', 'version_status']
    },
    datasource_dimension_id: {
      field: 'datasource_dimension_id',
      type: 'dimension',
      label: 'Data Source',
      filter: '',
      sortOrder: null,
      selectedColumn: 'datasource_id',
      dimensionAttributes: ['datasource_id', 'datasource_type', 'system_of_origin']
    },
    dimension1_id: {
      field: 'dimension1_id',
      type: 'dimension',
      label: 'Product',
      filter: '',
      sortOrder: null,
      selectedColumn: 'product_id',
      dimensionAttributes: ['product_id', 'product_description', 'category', 'hierarchy_level']
    },
    dimension2_id: {
      field: 'dimension2_id',
      type: 'dimension',
      label: 'Region',
      filter: '',
      sortOrder: null,
      selectedColumn: 'region_id',
      dimensionAttributes: ['region_id', 'region_description', 'country', 'sales_manager']
    },
    measure1: {
      field: 'measure1',
      type: 'measure',
      label: 'Measure 1',
      filter: '',
      filterOperator: 'eq',
      sortOrder: null,
      selectedColumn: 'measure1'
    },
    measure2: {
      field: 'measure2',
      type: 'measure',
      label: 'Measure 2',
      filter: '',
      filterOperator: 'eq',
      sortOrder: null,
      selectedColumn: 'measure2'
    }
  });

  const updateColumnConfig = useCallback((field: string, updates: Partial<ColumnConfig>) => {
    setColumnConfigs(prev => ({
      ...prev,
      [field]: { ...prev[field], ...updates }
    }));
  }, []);

  const addColumn = useCallback((attributeName: string, afterField: string) => {
    const columnId = `${afterField}_${attributeName}`;
    
    setColumnConfigs(prev => {
      const entries = Object.entries(prev);
      const afterIndex = entries.findIndex(([field]) => field === afterField);
      
      const newEntries = [
        ...entries.slice(0, afterIndex + 1),
        [columnId, {
          field: columnId,
          type: 'dimension',
          label: attributeName,
          filter: '',
          sortOrder: null,
          selectedColumn: attributeName
        }],
        ...entries.slice(afterIndex + 1)
      ];

      return Object.fromEntries(newEntries);
    });
  }, []);

  return {
    columnConfigs,
    updateColumnConfig,
    addColumn
  };
};
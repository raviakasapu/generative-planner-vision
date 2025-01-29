import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ColumnConfig, NewColumnConfig, PaginationState } from '@/components/data-table/types';
import { useAuth } from '@/contexts/AuthContext';

export const useDataTable = () => {
  const { user } = useAuth();
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

  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: 20
  });

  const { data: rawData = [], isLoading: loading } = useQuery({
    queryKey: ['planningData', user?.id],
    queryFn: async () => {
      const { data: permissions } = await supabase
        .from('data_access_permissions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('approval_status', 'approved');

      const dimension1Ids = permissions
        ?.filter(p => p.dimension_type === 'dimension1')
        .map(p => p.dimension_id);
      const dimension2Ids = permissions
        ?.filter(p => p.dimension_type === 'dimension2')
        .map(p => p.dimension_id);

      let query = supabase
        .from('planningdata')
        .select(`
          *,
          masterdimension1 (
            id,
            product_id,
            product_description,
            category,
            hierarchy_level
          ),
          masterdimension2 (
            id,
            region_id,
            region_description,
            country,
            sales_manager
          ),
          mastertimedimension (
            id,
            month_id,
            month_name,
            quarter,
            year
          ),
          masterversiondimension (
            id,
            version_id,
            version_name,
            version_type,
            version_status
          ),
          masterdatasourcedimension (
            id,
            datasource_id,
            datasource_name,
            datasource_type,
            system_of_origin
          )
        `);

      if (dimension1Ids?.length) {
        query = query.in('dimension1_id', dimension1Ids);
      }
      if (dimension2Ids?.length) {
        query = query.in('dimension2_id', dimension2Ids);
      }

      const { data: planningData, error } = await query;

      if (error) {
        console.error('Error fetching planning data:', error);
        return [];
      }

      return planningData || [];
    }
  });

  const filteredData = useMemo(() => {
    return rawData.filter(row => {
      return Object.entries(columnConfigs).every(([field, config]) => {
        if (!config.filter) return true;

        if (config.type === 'dimension') {
          let dimensionData;
          const baseDimensionField = field.split('_').slice(0, -1).join('_');
          
          switch (baseDimensionField || field) {
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
          
          const attributeName = field.includes('_') ? field.split('_').pop() : config.selectedColumn;
          const value = String(dimensionData[attributeName || config.selectedColumn] || '').toLowerCase();
          return value.includes(config.filter.toLowerCase());
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

  const updateCell = useCallback(async (id: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('planningdata')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  }, []);

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
    data: filteredData,
    loading,
    columnConfigs,
    pagination,
    updateCell,
    updateColumnConfig,
    addColumn,
    setPagination,
  };
};
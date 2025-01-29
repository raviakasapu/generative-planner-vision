import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ColumnConfig, NewColumnConfig, PaginationState } from '@/components/data-table/types';
import { useAuth } from '@/contexts/AuthContext';

export const useDataTable = () => {
  const { user } = useAuth();
  const [columnConfigs, setColumnConfigs] = useState<Record<string, ColumnConfig>>({
    dimension1_id: {
      field: 'dimension1_id',
      type: 'dimension',
      label: 'Product ID',
      filter: '',
      sortOrder: null,
      selectedColumn: 'product_id',
      dimensionAttributes: ['product_id', 'product_description', 'category', 'hierarchy_level']
    },
    dimension2_id: {
      field: 'dimension2_id',
      type: 'dimension',
      label: 'Region ID',
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

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ['planningData', user?.id, columnConfigs],
    queryFn: async () => {
      console.info('Fetching planning data for user:', user?.id);

      const { data: permissions } = await supabase
        .from('data_access_permissions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('approval_status', 'approved');

      console.info('User access permissions:', permissions);

      const dimension1Ids = permissions
        ?.filter(p => p.dimension_type === 'dimension1')
        .map(p => p.dimension_id);
      const dimension2Ids = permissions
        ?.filter(p => p.dimension_type === 'dimension2')
        .map(p => p.dimension_id);

      if (!dimension1Ids?.length && !dimension2Ids?.length) {
        return [];
      }

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

      // Filter out rows where master data is null (user doesn't have access)
      const filteredData = planningData?.filter(row => 
        (row.dimension1_id === null || row.masterdimension1) &&
        (row.dimension2_id === null || row.masterdimension2)
      );

      // Apply column filters
      const filteredByColumns = filteredData?.filter(row => {
        return Object.entries(columnConfigs).every(([field, config]) => {
          if (!config.filter) return true;

          if (config.type === 'dimension') {
            const dimensionData = field.startsWith('dimension1') ? row.masterdimension1 : row.masterdimension2;
            if (!dimensionData) return false;
            const value = String(dimensionData[config.selectedColumn] || '').toLowerCase();
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

      return filteredByColumns || [];
    }
  });

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
    data,
    loading,
    columnConfigs,
    pagination,
    updateCell,
    updateColumnConfig,
    addColumn,
    setPagination
  };
};
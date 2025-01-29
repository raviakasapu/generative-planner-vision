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
      label: 'Product',
      filter: '',
      sortOrder: null,
      selectedColumn: 'product_description',
      dimensionAttributes: ['product_id', 'product_description', 'category', 'hierarchy_level']
    },
    dimension2_id: {
      field: 'dimension2_id',
      type: 'dimension',
      label: 'Region',
      filter: '',
      sortOrder: null,
      selectedColumn: 'region_description',
      dimensionAttributes: ['region_id', 'region_description', 'country', 'sales_manager']
    },
    measure1: {
      field: 'measure1',
      type: 'measure',
      label: 'Measure 1',
      filter: '',
      sortOrder: null,
      selectedColumn: 'measure1'
    },
    measure2: {
      field: 'measure2',
      type: 'measure',
      label: 'Measure 2',
      filter: '',
      sortOrder: null,
      selectedColumn: 'measure2'
    }
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    pageSize: 20
  });

  const [isAddColumnDialogOpen, setAddColumnDialogOpen] = useState(false);

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ['planningData', user?.id],
    queryFn: async () => {
      console.info('Fetching planning data for user:', user?.id);

      // Fetch user's access permissions
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

      // Apply dimension access filters
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

      // Aggregate data based on dimensions
      const aggregatedData = planningData?.reduce((acc: any[], row) => {
        const existingRow = acc.find(r => 
          r.dimension1_id === row.dimension1_id && 
          r.dimension2_id === row.dimension2_id
        );

        if (existingRow) {
          existingRow.measure1 = (existingRow.measure1 || 0) + (row.measure1 || 0);
          existingRow.measure2 = (existingRow.measure2 || 0) + (row.measure2 || 0);
        } else {
          acc.push({
            ...row,
            measure1: row.measure1 || 0,
            measure2: row.measure2 || 0
          });
        }

        return acc;
      }, []);

      return aggregatedData || [];
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

  const addColumn = useCallback((attributeName: string) => {
    const columnId = `attribute_${Date.now()}`;
    setColumnConfigs(prev => ({
      ...prev,
      [columnId]: {
        field: columnId,
        type: 'dimension',
        label: attributeName,
        filter: '',
        sortOrder: null,
        selectedColumn: attributeName
      }
    }));
  }, []);

  return {
    data,
    loading,
    columnConfigs,
    pagination,
    updateCell,
    updateColumnConfig,
    addColumn,
    setPagination,
    isAddColumnDialogOpen,
    setAddColumnDialogOpen
  };
};
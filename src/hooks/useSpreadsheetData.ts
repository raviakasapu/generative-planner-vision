import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PlanningData, ColumnConfig } from '@/components/spreadsheet/types';

export const useSpreadsheetData = () => {
  const [data, setData] = useState<PlanningData[]>([]);
  const [columnConfigs, setColumnConfigs] = useState<Record<string, ColumnConfig>>({
    dimension1_id: { field: 'dimension1_id', type: 'dimension', filter: '', sortOrder: null, order: 0 },
    dimension2_id: { field: 'dimension2_id', type: 'dimension', filter: '', sortOrder: null, order: 1 },
    measure1: { field: 'measure1', type: 'measure', filter: '', sortOrder: null, order: 2 },
    measure2: { field: 'measure2', type: 'measure', filter: '', sortOrder: null, order: 3 },
  });
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlanningData();
    initializeColumnOrder();
  }, []);

  const initializeColumnOrder = () => {
    const initialOrder = Object.keys(columnConfigs).sort(
      (a, b) => columnConfigs[a].order - columnConfigs[b].order
    );
    setColumnOrder(initialOrder);
  };

  const fetchPlanningData = async () => {
    try {
      const { data, error } = await supabase
        .from('planningdata')
        .select(`
          *,
          masterdimension1!planningdata_dimension1_id_fkey(product_id, product_description),
          masterdimension2!planningdata_dimension2_id_fkey(region_id, region_description)
        `)
        .order('transaction_timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error fetching planning data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch planning data",
        variant: "destructive",
      });
    }
  };

  const handleCellChange = async (rowIndex: number, field: string, value: string) => {
    try {
      const row = data[rowIndex];
      if (!row) return;

      const updateData: any = {
        [field]: field.startsWith('measure') ? parseFloat(value) : value
      };

      const { error } = await supabase
        .from('planningdata')
        .update(updateData)
        .eq('id', row.id);

      if (error) throw error;

      const newData = [...data];
      newData[rowIndex] = { ...row, ...updateData };
      setData(newData);

      toast({
        title: "Updated",
        description: "Planning data updated successfully",
      });
    } catch (error) {
      console.error('Error updating cell:', error);
      toast({
        title: "Error",
        description: "Failed to update planning data",
        variant: "destructive",
      });
    }
  };

  const handleColumnConfigChange = (field: string, type: ColumnConfig['type']) => {
    setColumnConfigs({
      ...columnConfigs,
      [field]: { ...columnConfigs[field], type }
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setColumnConfigs({
      ...columnConfigs,
      [field]: { ...columnConfigs[field], filter: value }
    });
  };

  const toggleSort = (field: string) => {
    const config = columnConfigs[field];
    const newSortOrder = config.sortOrder === 'asc' ? 'desc' : config.sortOrder === 'desc' ? null : 'asc';
    setColumnConfigs({
      ...columnConfigs,
      [field]: { ...config, sortOrder: newSortOrder }
    });
  };

  const calculateTotals = (field: string) => {
    if (!field.startsWith('measure')) return null;
    return filteredAndSortedData.reduce((sum, row) => sum + (row[field as keyof PlanningData] as number || 0), 0);
  };

  const filteredAndSortedData = React.useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(columnConfigs).forEach(([field, config]) => {
      if (config.filter) {
        result = result.filter(row => {
          const value = String(row[field as keyof PlanningData] || '').toLowerCase();
          return value.includes(config.filter.toLowerCase());
        });
      }
    });

    // Apply sorting
    Object.entries(columnConfigs).forEach(([field, config]) => {
      if (config.sortOrder) {
        result.sort((a, b) => {
          const aVal = a[field as keyof PlanningData];
          const bVal = b[field as keyof PlanningData];
          return config.sortOrder === 'asc' 
            ? (aVal || 0) > (bVal || 0) ? 1 : -1
            : (aVal || 0) < (bVal || 0) ? 1 : -1;
        });
      }
    });

    return result;
  }, [data, columnConfigs]);

  return {
    data: filteredAndSortedData,
    columnConfigs,
    columnOrder,
    setColumnOrder,
    handleCellChange,
    handleColumnConfigChange,
    handleFilterChange,
    toggleSort,
    calculateTotals,
  };
};
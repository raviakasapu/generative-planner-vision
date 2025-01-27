import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PlanningData, ColumnConfig } from '@/components/spreadsheet/types';

export const useSpreadsheetData = () => {
  const [data, setData] = useState<PlanningData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [columnConfigs, setColumnConfigs] = useState<Record<string, ColumnConfig>>({
    dimension1_id: { 
      field: 'dimension1_id', 
      type: 'dimension',
      filter: '',
      sortOrder: null,
      selectedColumn: 'product_id'
    },
    dimension2_id: { 
      field: 'dimension2_id', 
      type: 'dimension',
      filter: '',
      sortOrder: null,
      selectedColumn: 'region_id'
    },
    measure1: { 
      field: 'measure1', 
      type: 'measure',
      aggregation: 'sum',
      filter: '',
      sortOrder: null,
      selectedColumn: 'measure1'
    },
    measure2: { 
      field: 'measure2', 
      type: 'measure',
      aggregation: 'sum',
      filter: '',
      sortOrder: null,
      selectedColumn: 'measure2'
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('planningdata')
        .select(`
          *,
          masterdimension1!planningdata_dimension1_id_fkey(
            id, product_id, product_description, category, hierarchy_level
          ),
          masterdimension2!planningdata_dimension2_id_fkey(
            id, region_id, region_description, country, sales_manager
          )
        `)
        .limit(100);

      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch planning data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCell = async (rowId: string, field: string, value: string | number) => {
    try {
      const { error } = await supabase
        .from('planningdata')
        .update({ [field]: value })
        .eq('id', rowId);

      if (error) throw error;

      setData(prev => prev.map(row => 
        row.id === rowId ? { ...row, [field]: value } : row
      ));

      toast({
        title: "Success",
        description: "Cell updated successfully",
      });
    } catch (error) {
      console.error('Error updating cell:', error);
      toast({
        title: "Error",
        description: "Failed to update cell",
        variant: "destructive",
      });
    }
  };

  const updateColumnConfig = (field: string, updates: Partial<ColumnConfig>) => {
    setColumnConfigs(prev => ({
      ...prev,
      [field]: { ...prev[field], ...updates }
    }));
  };

  const addDimensionColumn = (dimensionType: 'dimension1' | 'dimension2') => {
    const newColumnId = `${dimensionType}_${Object.keys(columnConfigs).length}`;
    const defaultColumn = dimensionType === 'dimension1' ? 'product_id' : 'region_id';
    
    setColumnConfigs(prev => ({
      ...prev,
      [newColumnId]: {
        field: `${dimensionType}_id`,
        type: 'dimension',
        filter: '',
        sortOrder: null,
        selectedColumn: defaultColumn
      }
    }));
  };

  return {
    data,
    loading,
    columnConfigs,
    updateCell,
    updateColumnConfig,
    addDimensionColumn,
  };
};
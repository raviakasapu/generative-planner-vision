import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PlanningData, ColumnConfig } from '@/components/spreadsheet/types';
import { useAuth } from '@/contexts/AuthContext';

export const useSpreadsheetData = () => {
  const [data, setData] = useState<PlanningData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching planning data for user:', user?.id);
      
      // First, get the user's approved dimension access permissions
      const { data: accessPermissions, error: accessError } = await supabase
        .from('data_access_permissions')
        .select(`
          id,
          dimension_type,
          dimension_id
        `)
        .eq('user_id', user?.id)
        .eq('approval_status', 'approved');

      if (accessError) {
        console.error('Error fetching access permissions:', accessError);
        throw accessError;
      }

      console.log('User access permissions:', accessPermissions);

      // Get the dimension IDs the user has access to
      const dimension1Ids = accessPermissions
        ?.filter(p => p.dimension_type === 'dimension1')
        .map(p => p.dimension_id) || [];
      const dimension2Ids = accessPermissions
        ?.filter(p => p.dimension_type === 'dimension2')
        .map(p => p.dimension_id) || [];

      console.log('Accessible dimension1 IDs:', dimension1Ids);
      console.log('Accessible dimension2 IDs:', dimension2Ids);

      // Only fetch planning data where user has access to both dimensions
      const { data: planningData, error: planningError } = await supabase
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
        .in('dimension1_id', dimension1Ids)
        .in('dimension2_id', dimension2Ids);

      if (planningError) {
        console.error('Error fetching planning data:', planningError);
        throw planningError;
      }

      console.log('Fetched planning data:', planningData);
      setData(planningData || []);
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

  const addDimensionColumn = (dimensionType: 'dimension1' | 'dimension2', selectedColumn: string) => {
    const newColumnId = `${dimensionType}_${Object.keys(columnConfigs).length}`;
    
    setColumnConfigs(prev => ({
      ...prev,
      [newColumnId]: {
        field: `${dimensionType}_id`,
        type: 'dimension',
        filter: '',
        sortOrder: null,
        selectedColumn
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
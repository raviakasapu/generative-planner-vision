import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePlanningData = () => {
  const { user } = useAuth();

  const { data: rawData = [], isLoading: loading } = useQuery({
    queryKey: ['planningData', user?.id],
    queryFn: async () => {
      const { data: permissions } = await supabase
        .from('data_access_permissions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('approval_status', 'approved');

      const productIds = permissions
        ?.filter(p => p.dimension_type === 'product')
        .map(p => p.dimension_id);
      const regionIds = permissions
        ?.filter(p => p.dimension_type === 'region')
        .map(p => p.dimension_id);

      let query = supabase
        .from('planningdata')
        .select(`
          *,
          masterproductdimension (
            id,
            product_id,
            product_description,
            category,
            hierarchy_level
          ),
          masterregiondimension (
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

      if (productIds?.length) {
        query = query.in('product_dimension_id', productIds);
      }
      if (regionIds?.length) {
        query = query.in('region_dimension_id', regionIds);
      }

      const { data: planningData, error } = await query;

      if (error) {
        console.error('Error fetching planning data:', error);
        return [];
      }

      return planningData || [];
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

  return {
    rawData,
    loading,
    updateCell
  };
};
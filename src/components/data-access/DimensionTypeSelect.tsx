import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { DimensionType, DimensionTypeOption } from './types';

interface DimensionTypeSelectProps {
  value: DimensionType | '';
  onChange: (value: DimensionType) => void;
}

export const DimensionTypeSelect: React.FC<DimensionTypeSelectProps> = ({
  value,
  onChange,
}) => {
  const [dimensionTypes, setDimensionTypes] = useState<DimensionTypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDimensionTypes = async () => {
      setIsLoading(true);
      try {
        // Query the table_metadata table to get dimension tables
        const { data: tableMetadata, error } = await supabase
          .from('table_metadata')
          .select('*')
          .eq('table_type', 'dimension')
          .order('table_name');

        if (error) {
          console.error('Error fetching dimension types:', error);
          toast({
            title: "Error",
            description: "Failed to fetch dimension types",
            variant: "destructive",
          });
          return;
        }

        // Transform the metadata into dimension type options
        const options: DimensionTypeOption[] = [
          {
            value: 'product',
            label: 'Product',
            tableName: 'm_u_product'
          },
          {
            value: 'region',
            label: 'Region',
            tableName: 'm_u_region'
          },
          {
            value: 'time',
            label: 'Time',
            tableName: 'm_u_time'
          }
        ];

        setDimensionTypes(options);
      } catch (error) {
        console.error('Error in fetchDimensionTypes:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching dimension types",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDimensionTypes();
  }, [toast]);

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Loading..." : "Select dimension type"} />
      </SelectTrigger>
      <SelectContent>
        {dimensionTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
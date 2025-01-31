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

        if (tableMetadata) {
          const options: DimensionTypeOption[] = tableMetadata
            .filter(meta => meta.table_name.startsWith('m_u_'))
            .map(meta => ({
              value: meta.table_name.replace('m_u_', '') as DimensionType,
              label: meta.table_description || meta.table_name.replace('m_u_', '').charAt(0).toUpperCase() + meta.table_name.replace('m_u_', '').slice(1),
              tableName: meta.table_name as `m_u_${DimensionType}`
            }));

          setDimensionTypes(options);
        }
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
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { DimensionType, DimensionMember, DimensionTableName } from "./types";

interface DimensionMemberSelectProps {
  dimensionType: DimensionType | '';
  value: string;
  onChange: (value: string) => void;
}

export const DimensionMemberSelect: React.FC<DimensionMemberSelectProps> = ({ 
  dimensionType, 
  value, 
  onChange 
}) => {
  const [dimensionMembers, setDimensionMembers] = useState<DimensionMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDimensionMembers = async () => {
      if (!dimensionType) {
        setDimensionMembers([]);
        return;
      }

      setIsLoading(true);
      try {
        const tableName = `m_u_${dimensionType}` as DimensionTableName;
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('dimension_name');

        if (error) {
          console.error('Error fetching dimension members:', error);
          toast({
            title: "Error",
            description: "Failed to fetch dimension members",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          const members: DimensionMember[] = data.map(item => ({
            id: item.id,
            dimension_name: item.dimension_name,
            identifier: item.identifier,
            description: item.description,
            attributes: item.attributes
          }));
          setDimensionMembers(members);
        }
      } catch (error) {
        console.error('Error in fetchDimensionMembers:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching dimension members",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDimensionMembers();
  }, [dimensionType, toast]);

  const getDisplayName = (member: DimensionMember) => {
    return `${member.dimension_name}${member.identifier ? ` (${member.identifier})` : ''}`;
  };

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={isLoading || dimensionMembers.length === 0}
    >
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Loading..." : "Select dimension member"} />
      </SelectTrigger>
      <SelectContent>
        {dimensionMembers.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {getDisplayName(member)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
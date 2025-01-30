import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAuditLogs = (userId: string) => {
  const { data: versionAudits, isLoading: isLoadingVersionAudits } = useQuery({
    queryKey: ['audit_version_status', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_version_status')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: roleAudits, isLoading: isLoadingRoleAudits } = useQuery({
    queryKey: ['audit_role_change', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_role_change')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  return {
    versionAudits,
    roleAudits,
    isLoading: isLoadingVersionAudits || isLoadingRoleAudits,
  };
};
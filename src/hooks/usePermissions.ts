import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('s_user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: rolePermissions } = useQuery({
    queryKey: ['rolePermissions', userProfile?.role],
    queryFn: async () => {
      if (!userProfile?.role) return [];
      const { data, error } = await supabase
        .from('s_role_permissions')
        .select(`
          permission_id,
          s_permissions (
            permission_name
          )
        `)
        .eq('role_id', userProfile.role);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.role,
  });

  const hasPermission = (permissionName: string): boolean => {
    if (!rolePermissions) return false;
    return rolePermissions.some(
      (rp) => rp.s_permissions?.permission_name === permissionName
    );
  };

  return { hasPermission, userProfile };
};
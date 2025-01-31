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
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: rolePermissions } = useQuery({
    queryKey: ['rolePermissions', userProfile?.role],
    queryFn: async () => {
      if (!userProfile?.role) return [];
      
      // First get the role ID
      const { data: roleData, error: roleError } = await supabase
        .from('s_roles')
        .select('id')
        .eq('role_name', userProfile.role)
        .single();
      
      if (roleError) throw roleError;
      
      // Then get the permissions using the role ID
      const { data, error } = await supabase
        .from('s_role_permissions')
        .select(`
          permission_id,
          s_permissions (
            permission_name
          )
        `)
        .eq('role_id', roleData.id);
      
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
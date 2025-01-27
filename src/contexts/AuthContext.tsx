import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  userPermissions: string[];
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userRole: null,
  userPermissions: [],
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setUserPermissions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      // Fetch user role from userprofiles
      const { data: userProfile, error: profileError } = await supabase
        .from('userprofiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      setUserRole(userProfile?.role || null);

      // Fetch role permissions
      if (userProfile?.role) {
        const { data: permissions, error: permissionsError } = await supabase
          .from('rolepermissions')
          .select(`
            permissions (
              permission_name
            )
          `)
          .eq('roles.role_name', userProfile.role)
          .join('roles', 'rolepermissions.role_id', 'roles.id');

        if (permissionsError) throw permissionsError;

        setUserPermissions(
          permissions?.map((p) => p.permissions.permission_name) || []
        );
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        userPermissions,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
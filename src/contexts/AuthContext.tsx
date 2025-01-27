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
    console.log('AuthProvider: Initial load');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Got session', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setIsLoading(false); // Important: Set loading to false if no user
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthProvider: Auth state changed', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setUserPermissions([]);
        setIsLoading(false); // Important: Set loading to false when logged out
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('AuthProvider: Fetching user role for', userId);
      const { data: userProfile, error: profileError } = await supabase
        .from('userprofiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setIsLoading(false); // Important: Set loading to false on error
        return;
      }

      console.log('AuthProvider: Got user profile', userProfile);
      setUserRole(userProfile?.role || 'user'); // Default to 'user' if no role specified

      if (userProfile?.role) {
        // First, get the role ID
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('role_name', userProfile.role)
          .single();

        if (roleError) {
          console.error('Error fetching role:', roleError);
          setIsLoading(false);
          return;
        }

        if (roleData) {
          // Then get the permissions for that role
          const { data: permissionsData, error: permissionsError } = await supabase
            .from('rolepermissions')
            .select(`
              permissions (
                permission_name
              )
            `)
            .eq('role_id', roleData.id);

          if (permissionsError) {
            console.error('Error fetching permissions:', permissionsError);
            setIsLoading(false);
            return;
          }

          setUserPermissions(
            permissionsData?.map((p: any) => p.permissions.permission_name) || []
          );
        }
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    } finally {
      setIsLoading(false); // Important: Always set loading to false when done
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
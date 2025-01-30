import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Key, ClipboardList, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function UserSecurityReport({ userId }: { userId: string }) {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const isApprover = userRole === 'admin' || userRole === 'manager';

  const { data: accessPermissions, refetch: refetchAccess } = useQuery({
    queryKey: ['userAccess', userId],
    queryFn: async () => {
      console.log('Fetching access permissions for user:', userId);
      const { data: permissions, error: permissionsError } = await supabase
        .from('data_access_permissions')
        .select('id, access_level, approval_status, dimension_type')
        .eq('user_id', userId);

      if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        throw permissionsError;
      }

      console.log('Raw permissions:', permissions);

      const enrichedPermissions = await Promise.all((permissions || []).map(async (permission) => {
        let dimensionDetails = null;

        if (permission.dimension_type === 'product') {
          const { data, error } = await supabase
            .from('data_access_product')
            .select(`
              dimension_id,
              masterproductdimension (
                dimension_name,
                product_id,
                product_description
              )
            `)
            .eq('access_permission_id', permission.id)
            .maybeSingle();

          if (!error && data) {
            dimensionDetails = {
              ...data.masterproductdimension,
              type: 'Product'
            };
          }
        } else if (permission.dimension_type === 'region') {
          const { data, error } = await supabase
            .from('data_access_region')
            .select(`
              dimension_id,
              masterregiondimension (
                dimension_name,
                region_id,
                region_description
              )
            `)
            .eq('access_permission_id', permission.id)
            .maybeSingle();

          if (!error && data) {
            dimensionDetails = {
              ...data.masterregiondimension,
              type: 'Region'
            };
          }
        }

        return {
          ...permission,
          dimensionDetails
        };
      }));

      console.log('Enriched permissions:', enrichedPermissions);
      return enrichedPermissions;
    },
    refetchInterval: 5000,
  });

  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ['userTasks', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_assignments')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: rolePermissions } = useQuery({
    queryKey: ['userRolePermissions', userId],
    queryFn: async () => {
      const { data: userProfile, error: profileError } = await supabase
        .from('userprofiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (userProfile?.role) {
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select(`
            id,
            rolepermissions (
              permissions (
                permission_name,
                permission_description
              )
            )
          `)
          .eq('role_name', userProfile.role)
          .single();

        if (roleError) throw roleError;
        return roleData?.rolepermissions || [];
      }
      return [];
    },
  });

  const handleApprove = async (type: 'access' | 'task', id: string) => {
    if (!isApprover) return;

    const table = type === 'access' ? 'data_access_permissions' : 'task_assignments';
    const { error } = await supabase
      .from(table)
      .update({
        approval_status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error(`Error approving ${type}:`, error);
      toast({
        title: 'Error',
        description: `Failed to approve ${type}. Please try again.`,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: `${type === 'access' ? 'Access permission' : 'Task'} approved successfully.`,
    });

    if (type === 'access') {
      refetchAccess();
    } else {
      refetchTasks();
    }
  };

  const getDimensionName = (permission: any) => {
    if (!permission.dimensionDetails) {
      return `${permission.dimension_type} (No details available)`;
    }
    
    const details = permission.dimensionDetails;
    switch (permission.dimension_type) {
      case 'dimension1':
        return `Product: ${details.product_id} - ${details.product_description || 'No description'}`;
      case 'dimension2':
        return `Region: ${details.region_id} - ${details.region_description || 'No description'}`;
      case 'time':
        return `Time: ${details.month_id} - ${details.month_name || 'No name'}`;
      default:
        return permission.dimension_type;
    }
  };

  const renderSecurityCard = (
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode,
    className?: string
  ) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );

  const renderAccessTable = (status: 'pending' | 'approved') => {
    console.log('Rendering access table for status:', status);
    console.log('Current access permissions:', accessPermissions);
    
    const filteredAccess = accessPermissions?.filter(p => p.approval_status === status) || [];
    console.log('Filtered access permissions:', filteredAccess);
    
    if (filteredAccess.length === 0) {
      return <p className="text-sm text-gray-500">No {status} access permissions</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dimension</TableHead>
            <TableHead>Access Level</TableHead>
            {status === 'pending' && isApprover && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAccess.map((ap: any) => (
            <TableRow key={ap.id}>
              <TableCell>{getDimensionName(ap)}</TableCell>
              <TableCell>
                <Badge variant={status === 'approved' ? 'default' : 'secondary'}>
                  {ap.access_level}
                </Badge>
              </TableCell>
              {status === 'pending' && isApprover && (
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove('access', ap.id)}
                  >
                    Approve
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderTasksTable = (status: 'pending' | 'approved') => {
    const filteredTasks = tasks?.filter(t => t.approval_status === status) || [];
    if (filteredTasks.length === 0) return <p className="text-sm text-gray-500">No {status} tasks</p>;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Due Date</TableHead>
            {status === 'pending' && isApprover && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task: any) => (
            <TableRow key={task.id}>
              <TableCell>{task.task_name}</TableCell>
              <TableCell>
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
              </TableCell>
              {status === 'pending' && isApprover && (
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApprove('task', task.id)}
                  >
                    Approve
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Role and Permissions Section */}
        <div className="lg:col-span-3">
          {renderSecurityCard(
            'Role Permissions',
            <Key className="h-5 w-5" />,
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolePermissions?.map((rp: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{rp.permissions.permission_name}</TableCell>
                    <TableCell>{rp.permissions.permission_description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Access Permissions Section - Group pending and approved together */}
        <div className="lg:col-span-2">
          {renderSecurityCard(
            'Pending Access Permissions',
            <AlertCircle className="h-5 w-5 text-yellow-500" />,
            renderAccessTable('pending')
          )}
        </div>
        <div className="lg:col-span-1">
          {renderSecurityCard(
            'Approved Access Permissions',
            <CheckCircle className="h-5 w-5 text-green-500" />,
            renderAccessTable('approved')
          )}
        </div>

        {/* Tasks Section - Group pending and approved together */}
        <div className="lg:col-span-2">
          {renderSecurityCard(
            'Pending Tasks',
            <ClipboardList className="h-5 w-5 text-yellow-500" />,
            renderTasksTable('pending')
          )}
        </div>
        <div className="lg:col-span-1">
          {renderSecurityCard(
            'Approved Tasks',
            <Shield className="h-5 w-5 text-green-500" />,
            renderTasksTable('approved')
          )}
        </div>
      </div>
    </div>
  );
}

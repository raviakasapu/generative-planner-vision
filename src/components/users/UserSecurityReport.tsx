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
import { Shield, Key, ClipboardList } from "lucide-react";

interface UserSecurityReportProps {
  userId: string;
}

export function UserSecurityReport({ userId }: UserSecurityReportProps) {
  // Fetch user's data access permissions
  const { data: accessPermissions } = useQuery({
    queryKey: ['userAccess', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_access_permissions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's tasks
  const { data: tasks } = useQuery({
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

  // Fetch user's role permissions
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

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      {/* Role Permissions Section */}
      <div>
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4" />
          Role Permissions
        </h4>
        <div className="bg-white rounded-md">
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
        </div>
      </div>

      {/* Data Access Section */}
      <div>
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Key className="h-4 w-4" />
          Data Access
        </h4>
        <div className="bg-white rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dimension Type</TableHead>
                <TableHead>Access Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessPermissions?.map((ap: any) => (
                <TableRow key={ap.id}>
                  <TableCell className="capitalize">{ap.dimension_type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {ap.access_level}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <ClipboardList className="h-4 w-4" />
          Assigned Tasks
        </h4>
        <div className="bg-white rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task: any) => (
                <TableRow key={task.id}>
                  <TableCell>{task.task_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
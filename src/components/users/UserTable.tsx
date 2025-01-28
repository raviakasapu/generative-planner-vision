import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { UserCog, Lock, CheckSquare, Mail } from "lucide-react";

interface UserTableProps {
  users: Array<{
    id: string;
    full_name: string | null;
    email: string | null;
    role: string | null;
    created_at: string;
    updated_at: string;
  }>;
  onRoleManagement: (userId: string, currentRole: string) => void;
  onDataAccess: (userId: string) => void;
  onTaskAssignment: (userId: string) => void;
}

export const UserTable = ({ users, onRoleManagement, onDataAccess, onTaskAssignment }: UserTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || 'N/A'}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                {user.email || 'N/A'}
              </TableCell>
              <TableCell>{user.role || 'user'}</TableCell>
              <TableCell>
                {format(new Date(user.created_at), 'PPp')}
              </TableCell>
              <TableCell>
                {format(new Date(user.updated_at), 'PPp')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <UserCog className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onRoleManagement(user.id, user.role || 'user')}
                      className="flex items-center gap-2"
                    >
                      <UserCog className="h-4 w-4" />
                      Manage Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDataAccess(user.id)}
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Data Access
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onTaskAssignment(user.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckSquare className="h-4 w-4" />
                      Assign Tasks
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
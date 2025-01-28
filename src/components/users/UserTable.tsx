import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCog, Key, Calendar } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
  email?: string | null;
}

interface UserTableProps {
  users: UserProfile[];
  onRoleManagement: (userId: string, currentRole: string) => void;
  onDataAccess: (userId: string) => void;
  onTaskAssignment: (userId: string) => void;
  viewMode: 'grid' | 'list';
}

export function UserTable({
  users,
  onRoleManagement,
  onDataAccess,
  onTaskAssignment,
  viewMode,
}: UserTableProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{user.full_name || 'Unnamed User'}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Badge variant="secondary">{user.role || 'No Role'}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRoleManagement(user.id, user.role || '')}
                >
                  <UserCog className="h-4 w-4 mr-1" />
                  Role
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDataAccess(user.id)}
                >
                  <Key className="h-4 w-4 mr-1" />
                  Access
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.full_name || 'Unnamed User'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">
                {user.role || 'No Role'}
              </Badge>
            </TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRoleManagement(user.id, user.role || '')}
                >
                  <UserCog className="h-4 w-4 mr-1" />
                  Role
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDataAccess(user.id)}
                >
                  <Key className="h-4 w-4 mr-1" />
                  Access
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
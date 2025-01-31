import { MainNav } from '@/components/MainNav';
import { UserNav } from '@/components/UserNav';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, GitBranch, Database } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Administration</h1>
        <UserNav />
      </div>
      <MainNav />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Users className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold">User Management</h2>
            <p className="text-center text-muted-foreground">
              Manage user accounts, roles, and permissions
            </p>
            <Button onClick={() => navigate('/admin/users')}>
              Manage Users
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <GitBranch className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold">Version Management</h2>
            <p className="text-center text-muted-foreground">
              Control versions and their lifecycle
            </p>
            <Button onClick={() => navigate('/admin/versions')}>
              Manage Versions
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Database className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold">Master Data</h2>
            <p className="text-center text-muted-foreground">
              Manage master data and configurations
            </p>
            <Button onClick={() => navigate('/admin/master-data')}>
              Manage Master Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
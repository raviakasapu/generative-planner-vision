import VersionManagement from '@/components/VersionManagement';
import { MainNav } from '@/components/MainNav';
import { UserNav } from '@/components/UserNav';

const VersionManagementPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Version Management</h1>
        <UserNav />
      </div>
      <MainNav />
      <VersionManagement />
    </div>
  );
};

export default VersionManagementPage;
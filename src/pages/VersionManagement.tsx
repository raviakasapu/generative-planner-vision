import VersionManagement from '@/components/VersionManagement';
import { MainNav } from '@/components/MainNav';

const VersionManagementPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <MainNav />
      <h1 className="text-4xl font-bold mb-8">Version Management</h1>
      <VersionManagement />
    </div>
  );
};

export default VersionManagementPage;
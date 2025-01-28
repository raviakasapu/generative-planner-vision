import MasterData from '@/components/MasterData';
import { MainNav } from '@/components/MainNav';
import { UserNav } from '@/components/UserNav';

const MasterDataManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Master Data Management</h1>
        <UserNav />
      </div>
      <MainNav />
      <div className="space-y-4">
        <MasterData />
      </div>
    </div>
  );
};

export default MasterDataManagement;
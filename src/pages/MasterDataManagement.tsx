import MasterData from '@/components/MasterData';
import { MainNav } from '@/components/MainNav';

const MasterDataManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <MainNav />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Master Data Management</h1>
        <MasterData />
      </div>
    </div>
  );
};

export default MasterDataManagement;
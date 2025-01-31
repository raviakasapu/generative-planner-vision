import { Card } from "@/components/ui/card";
import { MasterDataTypes } from '@/components/master-data/MasterDataTypes';

const MasterDataTypesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Master Data Types Management</h1>
      <Card className="p-4">
        <MasterDataTypes />
      </Card>
    </div>
  );
};

export default MasterDataTypesPage;
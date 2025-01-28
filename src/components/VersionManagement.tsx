import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Grid2X2, List, Layers } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Version = {
  id: string;
  version_id: string;
  version_name: string;
  version_description: string | null;
  version_type: string;
  version_status: string;
  created_at: string;
};

const VersionManagement = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  const { data: versions, isLoading, error } = useQuery({
    queryKey: ['versions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('masterversiondimension')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Version[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-500';
      case 'in_review':
        return 'bg-blue-500';
      case 'approved':
        return 'bg-green-500';
      case 'published':
        return 'bg-purple-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Loading versions...</div>;
  }

  if (error) {
    return <div>Error loading versions</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Versions</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {versions?.map((version) => (
          <Card key={version.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">
                {version.version_name}
              </CardTitle>
              <Badge 
                variant="secondary"
                className={`${getStatusColor(version.version_status)} text-white`}
              >
                {version.version_status}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-500 mt-1">
                {version.version_description || 'No description provided'}
              </CardDescription>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Layers className="h-4 w-4" />
                <span>{version.version_type}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(version.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VersionManagement;
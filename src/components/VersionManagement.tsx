import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Grid2X2, List, Layers, Search, ArrowUpDown, Plus, Shield } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { VersionCreationDialog } from './version/VersionCreationDialog';
import { VersionStatusDialog } from './version/VersionStatusDialog';
import { TaskAssignmentDialog } from './TaskAssignmentDialog';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Version>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const { toast } = useToast();

  const { data: versions, isLoading, error, refetch } = useQuery({
    queryKey: ['versions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('masterversiondimension')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) throw error;
      return data as Version[];
    },
  });

  const filteredVersions = versions?.filter(version => 
    version.version_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    version.version_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    version.version_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleSort = (field: keyof Version) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (version: Version) => {
    setSelectedVersion(version);
    setShowStatusDialog(true);
  };

  const handleAssignTask = (version: Version) => {
    setSelectedVersion(version);
    setShowTaskDialog(true);
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

      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search versions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Version
        </Button>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filteredVersions?.map((version) => (
          <Card key={version.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">
                {version.version_name}
              </CardTitle>
              <div className="flex gap-2">
                <Badge 
                  variant="secondary"
                  className={`${getStatusColor(version.version_status)} text-white cursor-pointer`}
                  onClick={() => handleStatusChange(version)}
                >
                  {version.version_status}
                </Badge>
              </div>
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
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAssignTask(version)}
                >
                  Assign Task
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(version)}
                >
                  Change Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <VersionCreationDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          refetch();
          toast({
            title: "Success",
            description: "Version created successfully",
          });
        }}
      />

      {selectedVersion && (
        <>
          <VersionStatusDialog
            isOpen={showStatusDialog}
            onClose={() => {
              setShowStatusDialog(false);
              setSelectedVersion(null);
            }}
            version={selectedVersion}
            onSuccess={() => {
              refetch();
              toast({
                title: "Success",
                description: "Version status updated successfully",
              });
            }}
          />

          <TaskAssignmentDialog
            isOpen={showTaskDialog}
            onClose={() => {
              setShowTaskDialog(false);
              setSelectedVersion(null);
            }}
            userId={selectedVersion.id}
          />
        </>
      )}
    </div>
  );
};

export default VersionManagement;
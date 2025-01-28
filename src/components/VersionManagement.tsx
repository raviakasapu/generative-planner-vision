import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { VersionCreationDialog } from './version/VersionCreationDialog';
import { VersionStatusDialog } from './version/VersionStatusDialog';
import { TaskAssignmentDialog } from './TaskAssignmentDialog';
import { VersionHeader } from './version/VersionHeader';
import { VersionList } from './version/VersionList';
import type { Version } from './version/types';

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
      case 'draft': return 'bg-yellow-500';
      case 'in_review': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'published': return 'bg-purple-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusChange = (version: Version) => {
    setSelectedVersion(version);
    setShowStatusDialog(true);
  };

  const handleAssignTask = (version: Version) => {
    setSelectedVersion(version);
    setShowTaskDialog(true);
  };

  if (isLoading) return <div>Loading versions...</div>;
  if (error) return <div>Error loading versions</div>;

  return (
    <div className="space-y-4">
      <VersionHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateVersion={() => setShowCreateDialog(true)}
      />

      <VersionList
        versions={filteredVersions}
        viewMode={viewMode}
        onStatusChange={handleStatusChange}
        onAssignTask={handleAssignTask}
        getStatusColor={getStatusColor}
      />

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
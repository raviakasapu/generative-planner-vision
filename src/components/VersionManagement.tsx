import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { VersionCreationDialog } from './version/creation/VersionCreationDialog';
import { VersionStatusDialog } from './version/VersionStatusDialog';
import { VersionHeader } from './version/VersionHeader';
import { VersionList } from './version/VersionList';
import type { Version } from './version/types/VersionTypes';

const VersionManagement = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Version>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  const { data: versions, isLoading, error, refetch } = useQuery({
    queryKey: ['versions'],
    queryFn: async () => {
      if (!user) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('m_u_version')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) throw error;
      return data as Version[];
    },
    enabled: !!user,
  });

  const filteredVersions = versions?.filter(version => {
    const searchLower = searchQuery.toLowerCase();
    return (
      version.dimension_name.toLowerCase().includes(searchLower) ||
      (version.description?.toLowerCase() || '').includes(searchLower) ||
      version.dimension_type.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (authLoading) return <div className="flex items-center justify-center p-8">Loading authentication...</div>;
  if (!user) return <div className="flex items-center justify-center p-8">Please sign in to manage versions</div>;
  if (isLoading) return <div className="flex items-center justify-center p-8">Loading versions...</div>;
  if (error) {
    toast({
      title: "Error loading versions",
      description: error.message,
      variant: "destructive",
    });
    return <div className="flex items-center justify-center p-8">Error loading versions</div>;
  }

  return (
    <div className="space-y-4">
      <VersionHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateVersion={() => setShowCreateDialog(true)}
      />

      {filteredVersions && filteredVersions.length > 0 ? (
        <VersionList
          versions={filteredVersions}
          viewMode={viewMode}
          onStatusChange={handleStatusChange}
          getStatusColor={getStatusColor}
        />
      ) : (
        <div className="text-center p-8 text-gray-500">
          {searchQuery ? 'No versions found matching your search' : 'No versions created yet'}
        </div>
      )}

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
        <VersionStatusDialog
          isOpen={showStatusDialog}
          onClose={() => {
            setShowStatusDialog(false);
            setSelectedVersion(null);
          }}
          versionId={selectedVersion.id}
          currentStatus={selectedVersion.attributes?.version_status || 'draft'}
          onStatusChange={() => {
            refetch();
            toast({
              title: "Success",
              description: "Version status updated successfully",
            });
          }}
        />
      )}
    </div>
  );
};

export default VersionManagement;

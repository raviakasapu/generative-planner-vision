import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ArrowDownRight } from 'lucide-react';
import { Version } from "./types";

interface VersionListProps {
  versions: Version[];
  viewMode: 'grid' | 'list';
  onStatusChange: (version: Version) => void;
  getStatusColor: (status: string) => string;
}

export function VersionList({
  versions,
  viewMode,
  onStatusChange,
  getStatusColor,
}: VersionListProps) {
  const { data: userProfiles } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('s_user_profiles')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const getOwnerName = (ownerId: string | null) => {
    if (!ownerId || !userProfiles) return 'Unknown';
    const owner = userProfiles.find(profile => profile.id === ownerId);
    return owner?.full_name || 'Unknown';
  };

  const getVersionLineage = (version: Version): Version[] => {
    const lineage: Version[] = [version];
    let currentVersion = version;
    
    while (currentVersion.attributes?.base_version_id) {
      const baseVersion = versions.find(v => v.id === currentVersion.attributes?.base_version_id);
      if (baseVersion) {
        lineage.push(baseVersion);
        currentVersion = baseVersion;
      } else {
        break;
      }
    }
    
    return lineage.reverse();
  };

  const renderLineage = (lineage: Version[]) => {
    return lineage.map((v, index) => (
      <div key={v.id} className="flex items-center">
        {index > 0 && <ArrowDownRight className="text-gray-400 mr-1" size={16} />}
        <span className="text-sm text-gray-600">{v.dimension_name}</span>
      </div>
    ));
  };

  return (
    <div className="grid gap-4">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onStatusChange(version)}
            >
              <h3 className="text-lg font-medium mb-2">{version.dimension_name}</h3>
              <p className="text-sm text-gray-500 mb-4">{version.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 mr-2">Owner:</span>
                  <span>{getOwnerName(version.owner_id)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 mr-2">Type:</span>
                  <span className="capitalize">{version.attributes?.version_type || 'N/A'}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-gray-600">Version Lineage:</span>
                  <div className="pl-2 border-l-2 border-gray-200">
                    {renderLineage(getVersionLineage(version))}
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <span className="text-gray-600 mr-2">Created:</span>
                  <span>{version.created_at ? formatDistanceToNow(new Date(version.created_at), { addSuffix: true }) : 'N/A'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Badge 
                  className={getStatusColor(version.attributes?.version_status || 'draft')}
                >
                  {version.attributes?.version_status || 'draft'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onStatusChange(version)}
            >
              <div className="space-y-1">
                <h3 className="text-md font-medium">{version.dimension_name}</h3>
                <p className="text-sm text-gray-500">{version.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Owner: {getOwnerName(version.owner_id)}</span>
                  <span>Type: {version.attributes?.version_type}</span>
                </div>
                <div className="pl-2 border-l-2 border-gray-200">
                  {renderLineage(getVersionLineage(version))}
                </div>
              </div>
              <Badge 
                className={getStatusColor(version.attributes?.version_status || 'draft')}
              >
                {version.attributes?.version_status || 'draft'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
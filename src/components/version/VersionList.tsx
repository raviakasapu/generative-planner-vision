import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ArrowDownRight } from 'lucide-react';
import { Version } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const getOwnerName = (ownerId: string | null | undefined) => {
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
    
    return lineage;
  };

  const renderLineage = (lineage: Version[]) => {
    return lineage.map((v, index) => (
      <div key={v.id} className={`flex items-center ${index > 0 ? 'ml-4' : ''}`}>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lineage</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow
                key={version.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onStatusChange(version)}
              >
                <TableCell className="font-medium">{version.dimension_name}</TableCell>
                <TableCell>{version.description}</TableCell>
                <TableCell>{getOwnerName(version.owner_id)}</TableCell>
                <TableCell>{version.attributes?.version_type}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    {renderLineage(getVersionLineage(version))}
                  </div>
                </TableCell>
                <TableCell>
                  {version.created_at ? formatDistanceToNow(new Date(version.created_at), { addSuffix: true }) : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(version.attributes?.version_status || 'draft')}>
                    {version.attributes?.version_status || 'draft'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
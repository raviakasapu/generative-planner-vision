import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, GitBranch } from "lucide-react";
import { Version } from "./types";

interface VersionListProps {
  versions: Version[];
  viewMode: 'grid' | 'list';
  onStatusChange: (version: Version) => void;
  getStatusColor: (status: string) => string;
}

export const VersionList = ({
  versions,
  viewMode,
  onStatusChange,
  getStatusColor,
}: VersionListProps) => {
  const getVersionLineage = (version: Version, allVersions: Version[]): Version[] => {
    const lineage: Version[] = [];
    let currentVersion = version;
    
    while (currentVersion.base_version_id) {
      const baseVersion = allVersions.find(v => v.id === currentVersion.base_version_id);
      if (baseVersion) {
        lineage.push(baseVersion);
        currentVersion = baseVersion;
      } else {
        break;
      }
    }
    
    return lineage;
  };

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
      {versions?.map((version) => (
        <Card key={version.id} className={`hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'p-2' : ''}`}>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${viewMode === 'list' ? 'p-2' : 'pb-2'}`}>
            <CardTitle className="text-lg font-bold">
              {version.version_name}
            </CardTitle>
            <div className="flex gap-2">
              <Badge 
                variant="secondary"
                className={`${getStatusColor(version.version_status)} text-white cursor-pointer`}
                onClick={() => onStatusChange(version)}
              >
                {version.version_status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className={viewMode === 'list' ? 'p-2' : ''}>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {version.version_description || 'No description provided'}
            </CardDescription>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Layers className="h-4 w-4" />
              <span>{version.version_type}</span>
            </div>
            {version.is_base_version && (
              <div className="mt-2">
                <Badge variant="outline" className="bg-blue-50">Base Version</Badge>
              </div>
            )}
            {version.base_version_id && (
              <div className="mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <GitBranch className="h-4 w-4" />
                  <span>Derived from:</span>
                </div>
                <div className="ml-6 mt-1">
                  {getVersionLineage(version, versions).map((baseVersion, index) => (
                    <div key={baseVersion.id} className="text-sm text-gray-600">
                      {index > 0 && <span className="mx-2">→</span>}
                      {baseVersion.version_name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500">
              Created: {new Date(version.created_at).toLocaleDateString()}
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(version)}
              >
                Change Status
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
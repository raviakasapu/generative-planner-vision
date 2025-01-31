import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="grid gap-4">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              onClick={() => onStatusChange(version)}
            >
              <h3 className="text-lg font-medium mb-2">{version.dimension_name}</h3>
              <p className="text-sm text-gray-500 mb-4">{version.description}</p>
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
              <div>
                <h3 className="text-md font-medium">{version.dimension_name}</h3>
                <p className="text-sm text-gray-500">{version.description}</p>
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
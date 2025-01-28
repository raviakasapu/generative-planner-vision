import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { Version } from "./types";

interface VersionListProps {
  versions: Version[];
  viewMode: 'grid' | 'list';
  onStatusChange: (version: Version) => void;
  onAssignTask: (version: Version) => void;
  getStatusColor: (status: string) => string;
}

export const VersionList = ({
  versions,
  viewMode,
  onStatusChange,
  onAssignTask,
  getStatusColor,
}: VersionListProps) => {
  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
      {versions?.map((version) => (
        <Card key={version.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                onClick={() => onAssignTask(version)}
              >
                Assign Task
              </Button>
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
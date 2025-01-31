import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, GitBranch } from "lucide-react";
import { Version } from "./types";

interface VersionListProps {
  versions: Version[];
  onVersionClick: (version: Version) => void;
  onCreateVersion: () => void;
}

export function VersionList({
  versions,
  onVersionClick,
  onCreateVersion,
}: VersionListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Versions</h2>
        <Button onClick={onCreateVersion}>Create New Version</Button>
      </div>
      <div className="space-y-2">
        {versions.map((version) => (
          <div
            key={version.id}
            className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => onVersionClick(version)}
          >
            <div>
              <h3 className="text-md font-medium">{version.dimension_name}</h3>
              <p className="text-sm text-gray-500">{version.description}</p>
            </div>
            <Badge variant={version.attributes?.version_status}>{version.attributes?.version_status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

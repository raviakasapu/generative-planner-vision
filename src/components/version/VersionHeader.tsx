import { Button } from "@/components/ui/button";
import { Grid2X2, List, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VersionHeaderProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateVersion: () => void;
}

export const VersionHeader = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  onCreateVersion,
}: VersionHeaderProps) => {
  return (
    <>
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
        <Button onClick={onCreateVersion}>
          <Plus className="h-4 w-4 mr-2" />
          New Version
        </Button>
      </div>
    </>
  );
};
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import type { Version } from './types';

interface VersionCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function VersionCreationDialog({
  isOpen,
  onClose,
  onSuccess,
}: VersionCreationDialogProps) {
  const [versionName, setVersionName] = useState('');
  const [versionDescription, setVersionDescription] = useState('');
  const [versionType, setVersionType] = useState('');
  const [isBaseVersion, setIsBaseVersion] = useState(false);
  const [baseVersionId, setBaseVersionId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch existing versions for base version selection
  const { data: existingVersions } = useQuery({
    queryKey: ['versions-for-base'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('masterversiondimension')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Version[];
    },
    enabled: isOpen,
  });

  const handleCreate = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a version",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('masterversiondimension').insert({
        version_name: versionName,
        version_description: versionDescription,
        version_type: versionType,
        version_status: 'draft',
        version_id: Date.now().toString(),
        is_base_version: isBaseVersion,
        base_version_id: baseVersionId,
      });

      if (error) {
        console.error('Error creating version:', error);
        toast({
          title: "Error creating version",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      onSuccess();
      onClose();
      resetForm();
      toast({
        title: "Success",
        description: "Version created successfully",
      });
    } catch (error) {
      console.error('Error creating version:', error);
      toast({
        title: "Error",
        description: "Failed to create version",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setVersionName('');
    setVersionDescription('');
    setVersionType('');
    setIsBaseVersion(false);
    setBaseVersionId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Version Name"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
          />
          <Textarea
            placeholder="Version Description"
            value={versionDescription}
            onChange={(e) => setVersionDescription(e.target.value)}
          />
          <Select value={versionType} onValueChange={setVersionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Version Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="forecast">Forecast</SelectItem>
              <SelectItem value="actual">Actual</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBaseVersion"
              checked={isBaseVersion}
              onCheckedChange={(checked) => setIsBaseVersion(checked as boolean)}
            />
            <label
              htmlFor="isBaseVersion"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is Base Version
            </label>
          </div>

          {!isBaseVersion && (
            <Select value={baseVersionId || ''} onValueChange={setBaseVersionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Base Version (Optional)" />
              </SelectTrigger>
              <SelectContent>
                {existingVersions?.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.version_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={handleCreate}
            className="w-full"
            disabled={!versionName || !versionType}
          >
            Create Version
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
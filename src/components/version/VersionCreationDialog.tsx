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
  const [securityLevel, setSecurityLevel] = useState('standard');
  const { user } = useAuth();
  const { toast } = useToast();

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
        version_status: 'draft', // Always start as draft per RLS policy
        version_id: Date.now().toString(),
        is_base_version: false, // Set explicitly to false for new versions
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
    setSecurityLevel('standard');
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
          <Select value={securityLevel} onValueChange={setSecurityLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select Security Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="confidential">Confidential</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
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
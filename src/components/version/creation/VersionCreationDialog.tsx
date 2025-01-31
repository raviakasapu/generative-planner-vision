import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { VersionForm } from './VersionForm';
import type { Version, VersionFormData } from '../types';

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
  const [formData, setFormData] = useState<VersionFormData>({
    versionName: '',
    versionDescription: '',
    versionType: '',
    isBaseVersion: false,
    baseVersionId: null,
    ownerId: null,
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const { data: existingVersions } = useQuery({
    queryKey: ['versions-for-base'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('m_u_version')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Version[];
    },
    enabled: isOpen,
  });

  const { data: userProfiles } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('s_user_profiles')
        .select('id, full_name, role');

      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  const handleFormChange = (updates: Partial<VersionFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

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
      const { data: newVersion, error: versionError } = await supabase
        .from('m_u_version')
        .insert({
          dimension_name: formData.versionName,
          description: formData.versionDescription,
          dimension_type: 'version',
          identifier: Date.now().toString(),
          attributes: {
            version_type: formData.versionType,
            version_status: 'draft',
            is_base_version: formData.isBaseVersion,
            base_version_id: formData.baseVersionId
          },
          owner_id: formData.ownerId || user.id,
          created_by: user.id,
          updated_by: user.id
        })
        .select()
        .single();

      if (versionError) throw versionError;

      if (formData.baseVersionId && newVersion) {
        const { error: copyError } = await supabase
          .rpc('copy_planning_data_for_version', {
            source_version_id: formData.baseVersionId,
            target_version_id: newVersion.id
          });

        if (copyError) {
          console.error('Error copying planning data:', copyError);
          toast({
            title: "Warning",
            description: "Version created but data copying failed",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Version created and data copied successfully",
          });
        }
      }

      onSuccess();
      onClose();
      resetForm();
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
    setFormData({
      versionName: '',
      versionDescription: '',
      versionType: '',
      isBaseVersion: false,
      baseVersionId: null,
      ownerId: null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
        </DialogHeader>
        <VersionForm
          formData={formData}
          onFormChange={handleFormChange}
          existingVersions={existingVersions}
          userProfiles={userProfiles}
          currentUserId={user?.id || ''}
        />
        <Button
          onClick={handleCreate}
          className="w-full mt-4"
          disabled={!formData.versionName || !formData.versionType}
        >
          Create Version
        </Button>
      </DialogContent>
    </Dialog>
  );
}
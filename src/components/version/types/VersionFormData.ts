import { VersionType } from './VersionTypes';

export interface VersionFormData {
  versionName: string;
  versionDescription: string;
  versionType: VersionType | '';
  isBaseVersion: boolean;
  baseVersionId: string | null;
  ownerId: string | null;
}
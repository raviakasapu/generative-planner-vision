export interface VersionFormData {
  versionName: string;
  versionDescription: string;
  versionType: string;
  isBaseVersion: boolean;
  baseVersionId: string | null;
  ownerId: string | null;
}
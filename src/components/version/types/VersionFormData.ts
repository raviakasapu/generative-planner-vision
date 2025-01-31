export type VersionType = 'budget' | 'forecast' | 'actual';

export interface VersionFormData {
  versionName: string;
  versionDescription: string;
  versionType: VersionType | '';
  isBaseVersion: boolean;
  baseVersionId: string | null;
}
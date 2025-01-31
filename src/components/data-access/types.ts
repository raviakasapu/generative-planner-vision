export type DimensionType = 'product' | 'region' | 'time' | 'version' | 'datasource' | 'layer';

export interface DimensionMember {
  id: string;
  dimension_name: string;
  identifier: string;
  description: string | null;
}

export interface DataAccessFormData {
  dimensionType: DimensionType | '';
  dimensionId: string;
  accessLevel: string;
}
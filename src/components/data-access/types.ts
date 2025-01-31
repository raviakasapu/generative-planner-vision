export type DimensionType = 'product' | 'region' | 'time' | 'version' | 'datasource' | 'layer';

export type AccessLevel = 'read' | 'write' | 'admin';

export interface DimensionOption {
  id: string;
  dimension_name: string;
}
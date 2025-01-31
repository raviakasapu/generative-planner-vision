export type DimensionType = 'product' | 'region' | 'time' | 'version' | 'datasource' | 'layer';

export interface DimensionMember {
  id: string;
  dimension_name: string;
  identifier: string;
  description: string | null;
  attributes: Record<string, any> | null;
}

export type DimensionTableName = `m_u_${DimensionType}`;

export interface DimensionTypeOption {
  value: DimensionType;
  label: string;
  tableName: DimensionTableName;
}
export interface PlanningData {
  id: string;
  dimension1_id: string | null;
  dimension2_id: string | null;
  measure1: number | null;
  measure2: number | null;
}

export interface ColumnConfig {
  field: string;
  type: 'dimension' | 'attribute' | 'hierarchy' | 'measure';
  filter: string;
  sortOrder: 'asc' | 'desc' | null;
  order: number;
}
export type ColumnType = 'dimension' | 'measure';
export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count';
export type SortOrder = 'asc' | 'desc' | null;

export interface ColumnConfig {
  field: string;
  type: ColumnType;
  label?: string;
  description?: string;
  aggregation?: AggregationType;
  filter: string;
  sortOrder: SortOrder;
  selectedColumn: string;
  dimensionAttributes?: string[];
}

export interface NewColumnConfig {
  label: string;
  type: ColumnType;
  description?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}
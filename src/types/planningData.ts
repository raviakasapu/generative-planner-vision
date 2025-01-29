export interface PlanningData {
  id: string;
  dimension1_id?: string;
  dimension2_id?: string;
  measure1?: number;
  measure2?: number;
  transaction_timestamp?: string;
  user_id?: string;
  time_dimension_id: string;
  version_dimension_id?: string;
  datasource_dimension_id?: string;
  layer_dimension_id?: string;
  security_level?: string;
  task_id?: string;
}
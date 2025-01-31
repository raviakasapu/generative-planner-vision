import { Json } from "@/integrations/supabase/types";

export type DimensionType = string;

export interface Dimension {
  id: string;
  dimension_name: string;
  dimension_type: DimensionType;
  identifier: string;
  description: string | null;
  hierarchy: string | null;
  attributes: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface NewDimension {
  id: string;
  name: string;
  type: DimensionType;
  description: string;
  category?: string;
  systemOrigin?: string;
}

export interface DimensionTypeMetadata {
  id: string;
  name: string;
  description: string | null;
  table_name: string;
  attributes: Record<string, any>;
}

export interface DimensionData {
  id: string;
  identifier: string;
  description: string | null;
  dimension_type: string;
  dimension_name?: string;
  hierarchy?: string | null;
  attributes?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
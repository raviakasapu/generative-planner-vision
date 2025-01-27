export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      businesslogicrules: {
        Row: {
          created_at: string | null
          id: string
          rule_definition: Json
          rule_description: string | null
          rule_name: string
          updated_at: string | null
          version: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          rule_definition: Json
          rule_description?: string | null
          rule_name: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          rule_definition?: Json
          rule_description?: string | null
          rule_name?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      masterdimension1: {
        Row: {
          category: string | null
          created_at: string | null
          dimension_name: string
          hierarchy_level: string | null
          id: string
          product_description: string | null
          product_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          dimension_name?: string
          hierarchy_level?: string | null
          id?: string
          product_description?: string | null
          product_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          dimension_name?: string
          hierarchy_level?: string | null
          id?: string
          product_description?: string | null
          product_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      masterdimension2: {
        Row: {
          country: string | null
          created_at: string | null
          dimension_name: string
          id: string
          region_description: string | null
          region_id: string
          sales_manager: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          dimension_name?: string
          id?: string
          region_description?: string | null
          region_id: string
          sales_manager?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          dimension_name?: string
          id?: string
          region_description?: string | null
          region_id?: string
          sales_manager?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mastertimedimension: {
        Row: {
          created_at: string | null
          dimension_name: string
          id: string
          month_id: string
          month_name: string
          month_number_in_year: number
          month_start_date: string | null
          quarter: string
          quarter_number_in_year: number
          updated_at: string | null
          year: number
          year_start_date: string | null
        }
        Insert: {
          created_at?: string | null
          dimension_name?: string
          id?: string
          month_id: string
          month_name: string
          month_number_in_year: number
          month_start_date?: string | null
          quarter: string
          quarter_number_in_year: number
          updated_at?: string | null
          year: number
          year_start_date?: string | null
        }
        Update: {
          created_at?: string | null
          dimension_name?: string
          id?: string
          month_id?: string
          month_name?: string
          month_number_in_year?: number
          month_start_date?: string | null
          quarter?: string
          quarter_number_in_year?: number
          updated_at?: string | null
          year?: number
          year_start_date?: string | null
        }
        Relationships: []
      }
      planningdata: {
        Row: {
          dimension1_id: string | null
          dimension2_id: string | null
          id: string
          measure1: number | null
          measure2: number | null
          time_dimension_id: string
          transaction_timestamp: string | null
          user_id: string | null
        }
        Insert: {
          dimension1_id?: string | null
          dimension2_id?: string | null
          id?: string
          measure1?: number | null
          measure2?: number | null
          time_dimension_id: string
          transaction_timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          dimension1_id?: string | null
          dimension2_id?: string | null
          id?: string
          measure1?: number | null
          measure2?: number | null
          time_dimension_id?: string
          transaction_timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planningdata_dimension1_id_fkey"
            columns: ["dimension1_id"]
            isOneToOne: false
            referencedRelation: "masterdimension1"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planningdata_dimension2_id_fkey"
            columns: ["dimension2_id"]
            isOneToOne: false
            referencedRelation: "masterdimension2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planningdata_time_dimension_id_fkey"
            columns: ["time_dimension_id"]
            isOneToOne: false
            referencedRelation: "mastertimedimension"
            referencedColumns: ["id"]
          },
        ]
      }
      userprofiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_planning_data_combinations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      insert_planning_data_combinations_by_ids: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

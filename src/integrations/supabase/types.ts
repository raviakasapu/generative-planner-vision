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
      applogs: {
        Row: {
          component: string | null
          details: Json | null
          event_id: string | null
          id: string
          level: string
          message: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          component?: string | null
          details?: Json | null
          event_id?: string | null
          id?: string
          level: string
          message?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          component?: string | null
          details?: Json | null
          event_id?: string | null
          id?: string
          level?: string
          message?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      data_access_permissions: {
        Row: {
          access_level: string
          created_at: string | null
          dimension_id: string
          dimension_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          access_level: string
          created_at?: string | null
          dimension_id: string
          dimension_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          access_level?: string
          created_at?: string | null
          dimension_id?: string
          dimension_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lockstable: {
        Row: {
          expiry_timestamp: string | null
          lock_timestamp: string | null
          resource_id: string
          resource_type: string
          user_id: string | null
        }
        Insert: {
          expiry_timestamp?: string | null
          lock_timestamp?: string | null
          resource_id: string
          resource_type: string
          user_id?: string | null
        }
        Update: {
          expiry_timestamp?: string | null
          lock_timestamp?: string | null
          resource_id?: string
          resource_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      masterdatasourcedimension: {
        Row: {
          created_at: string | null
          datasource_description: string | null
          datasource_id: string
          datasource_name: string
          datasource_type: string | null
          dimension_name: string
          id: string
          parent_datasource_dimension_id: string | null
          system_of_origin: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          datasource_description?: string | null
          datasource_id: string
          datasource_name: string
          datasource_type?: string | null
          dimension_name?: string
          id?: string
          parent_datasource_dimension_id?: string | null
          system_of_origin?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          datasource_description?: string | null
          datasource_id?: string
          datasource_name?: string
          datasource_type?: string | null
          dimension_name?: string
          id?: string
          parent_datasource_dimension_id?: string | null
          system_of_origin?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "masterdatasourcedimension_parent_datasource_dimension_id_fkey"
            columns: ["parent_datasource_dimension_id"]
            isOneToOne: false
            referencedRelation: "masterdatasourcedimension"
            referencedColumns: ["id"]
          },
        ]
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
      masterlayerdimension: {
        Row: {
          created_at: string | null
          dimension_name: string
          id: string
          layer_description: string | null
          layer_id: string
          layer_name: string
          layer_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dimension_name?: string
          id?: string
          layer_description?: string | null
          layer_id: string
          layer_name: string
          layer_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dimension_name?: string
          id?: string
          layer_description?: string | null
          layer_id?: string
          layer_name?: string
          layer_type?: string
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
      masterversiondimension: {
        Row: {
          base_version_id: string | null
          created_at: string | null
          dimension_name: string
          id: string
          is_base_version: boolean
          updated_at: string | null
          version_description: string | null
          version_id: string
          version_name: string
          version_status: string
          version_type: string
        }
        Insert: {
          base_version_id?: string | null
          created_at?: string | null
          dimension_name?: string
          id?: string
          is_base_version?: boolean
          updated_at?: string | null
          version_description?: string | null
          version_id: string
          version_name: string
          version_status?: string
          version_type: string
        }
        Update: {
          base_version_id?: string | null
          created_at?: string | null
          dimension_name?: string
          id?: string
          is_base_version?: boolean
          updated_at?: string | null
          version_description?: string | null
          version_id?: string
          version_name?: string
          version_status?: string
          version_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "masterversiondimension_base_version_id_fkey"
            columns: ["base_version_id"]
            isOneToOne: false
            referencedRelation: "masterversiondimension"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_description: string | null
          permission_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_description?: string | null
          permission_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_description?: string | null
          permission_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      planningdata: {
        Row: {
          datasource_dimension_id: string | null
          dimension1_id: string | null
          dimension2_id: string | null
          id: string
          layer_dimension_id: string | null
          measure1: number | null
          measure2: number | null
          security_level: string | null
          task_id: string | null
          time_dimension_id: string
          transaction_timestamp: string | null
          user_id: string | null
          version_dimension_id: string | null
        }
        Insert: {
          datasource_dimension_id?: string | null
          dimension1_id?: string | null
          dimension2_id?: string | null
          id?: string
          layer_dimension_id?: string | null
          measure1?: number | null
          measure2?: number | null
          security_level?: string | null
          task_id?: string | null
          time_dimension_id: string
          transaction_timestamp?: string | null
          user_id?: string | null
          version_dimension_id?: string | null
        }
        Update: {
          datasource_dimension_id?: string | null
          dimension1_id?: string | null
          dimension2_id?: string | null
          id?: string
          layer_dimension_id?: string | null
          measure1?: number | null
          measure2?: number | null
          security_level?: string | null
          task_id?: string | null
          time_dimension_id?: string
          transaction_timestamp?: string | null
          user_id?: string | null
          version_dimension_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planningdata_datasource_dimension_id_fkey"
            columns: ["datasource_dimension_id"]
            isOneToOne: false
            referencedRelation: "masterdatasourcedimension"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "planningdata_layer_dimension_id_fkey"
            columns: ["layer_dimension_id"]
            isOneToOne: false
            referencedRelation: "masterlayerdimension"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planningdata_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planningdata_time_dimension_id_fkey"
            columns: ["time_dimension_id"]
            isOneToOne: false
            referencedRelation: "mastertimedimension"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planningdata_version_dimension_id_fkey"
            columns: ["version_dimension_id"]
            isOneToOne: false
            referencedRelation: "masterversiondimension"
            referencedColumns: ["id"]
          },
        ]
      }
      role_change_audit: {
        Row: {
          changed_at: string | null
          changed_by: string
          id: string
          new_role: string | null
          previous_role: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by: string
          id?: string
          new_role?: string | null
          previous_role?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string
          id?: string
          new_role?: string | null
          previous_role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rolepermissions: {
        Row: {
          created_at: string | null
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rolepermissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rolepermissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: string
          role_description: string | null
          role_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_description?: string | null
          role_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role_description?: string | null
          role_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          status: string
          task_description: string | null
          task_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          status?: string
          task_description?: string | null
          task_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          status?: string
          task_description?: string | null
          task_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      version_status_audit: {
        Row: {
          created_at: string | null
          id: string
          new_status: string
          previous_status: string
          user_id: string
          version_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_status: string
          previous_status: string
          user_id: string
          version_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          new_status?: string
          previous_status?: string
          user_id?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "version_status_audit_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "masterversiondimension"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      copy_planning_data_for_version: {
        Args: {
          source_version_id: string
          target_version_id: string
        }
        Returns: undefined
      }
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
      version_status_enum:
        | "draft"
        | "in_review"
        | "approved"
        | "published"
        | "archived"
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

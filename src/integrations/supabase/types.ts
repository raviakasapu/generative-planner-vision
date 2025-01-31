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
      audit_role_change: {
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
      audit_version_status: {
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
        Relationships: []
      }
      chat_actions: {
        Row: {
          action_data: Json | null
          action_type: string
          chat_message_id: string | null
          created_at: string | null
          id: string
          result: Json | null
          updated_at: string | null
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          chat_message_id?: string | null
          created_at?: string | null
          id?: string
          result?: Json | null
          updated_at?: string | null
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          chat_message_id?: string | null
          created_at?: string | null
          id?: string
          result?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_actions_chat_message_id_fkey"
            columns: ["chat_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          message: string
          response: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message: string
          response?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          message?: string
          response?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      confg_business_logic_rules: {
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
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          dimension_id: string
          dimension_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          access_level: string
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          dimension_id: string
          dimension_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          access_level?: string
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          dimension_id?: string
          dimension_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      data_access_product: {
        Row: {
          access_permission_id: string
          dimension_id: string
        }
        Insert: {
          access_permission_id: string
          dimension_id: string
        }
        Update: {
          access_permission_id?: string
          dimension_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_access_dimension1_access_permission_id_fkey"
            columns: ["access_permission_id"]
            isOneToOne: false
            referencedRelation: "data_access_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_access_product_dimension_id_fkey"
            columns: ["dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_product"
            referencedColumns: ["id"]
          },
        ]
      }
      data_access_region: {
        Row: {
          access_permission_id: string
          dimension_id: string
        }
        Insert: {
          access_permission_id: string
          dimension_id: string
        }
        Update: {
          access_permission_id?: string
          dimension_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_access_dimension2_access_permission_id_fkey"
            columns: ["access_permission_id"]
            isOneToOne: false
            referencedRelation: "data_access_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_access_region_dimension_id_fkey"
            columns: ["dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_region"
            referencedColumns: ["id"]
          },
        ]
      }
      data_access_time: {
        Row: {
          access_permission_id: string
          dimension_id: string
        }
        Insert: {
          access_permission_id: string
          dimension_id: string
        }
        Update: {
          access_permission_id?: string
          dimension_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_access_time_access_permission_id_fkey"
            columns: ["access_permission_id"]
            isOneToOne: false
            referencedRelation: "data_access_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_access_time_dimension_id_fkey"
            columns: ["dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_time"
            referencedColumns: ["id"]
          },
        ]
      }
      m_u_datasource: {
        Row: {
          attributes: Json | null
          created_at: string | null
          description: string | null
          dimension_name: string
          dimension_type: string
          hierarchy: string | null
          id: string
          identifier: string
          unique_identifier: string | null
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier: string
          unique_identifier?: string | null
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier?: string
          unique_identifier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      m_u_layer: {
        Row: {
          attributes: Json | null
          created_at: string | null
          description: string | null
          dimension_name: string
          dimension_type: string
          hierarchy: string | null
          id: string
          identifier: string
          unique_identifier: string | null
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier: string
          unique_identifier?: string | null
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier?: string
          unique_identifier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      m_u_product: {
        Row: {
          attributes: string | null
          created_at: string | null
          description: string | null
          dimension_name: string
          dimension_type: string
          hierarchy: string | null
          id: string
          identifier: string
          unique_identifier: string
          updated_at: string | null
        }
        Insert: {
          attributes?: string | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier: string
          unique_identifier?: string
          updated_at?: string | null
        }
        Update: {
          attributes?: string | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier?: string
          unique_identifier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      m_u_region: {
        Row: {
          attributes: Json | null
          created_at: string | null
          description: string | null
          dimension_name: string
          dimension_type: string
          hierarchy: string | null
          id: string
          identifier: string
          unique_identifier: string | null
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier: string
          unique_identifier?: string | null
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier?: string
          unique_identifier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      m_u_time: {
        Row: {
          attributes: Json | null
          created_at: string | null
          description: string | null
          dimension_name: string
          dimension_type: string
          hierarchy: string | null
          id: string
          identifier: string
          unique_identifier: string | null
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier: string
          unique_identifier?: string | null
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier?: string
          unique_identifier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      m_u_version: {
        Row: {
          attributes: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          dimension_name: string
          dimension_type: string
          hierarchy: string | null
          id: string
          identifier: string
          owner_id: string | null
          unique_identifier: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier: string
          owner_id?: string | null
          unique_identifier?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier?: string
          owner_id?: string | null
          unique_identifier?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      s_permissions: {
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
      s_role_permissions: {
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
            foreignKeyName: "s_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "s_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "s_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      s_roles: {
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
      s_task_assignments: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
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
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
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
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
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
      s_user_profiles: {
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
      t_planneddata: {
        Row: {
          datasource_dimension_id: string | null
          id: string
          layer_dimension_id: string | null
          measure1: number | null
          measure2: number | null
          product_dimension_id: string | null
          region_dimension_id: string | null
          security_level: string | null
          task_id: string | null
          time_dimension_id: string
          transaction_timestamp: string | null
          user_id: string | null
          version_dimension_id: string | null
        }
        Insert: {
          datasource_dimension_id?: string | null
          id?: string
          layer_dimension_id?: string | null
          measure1?: number | null
          measure2?: number | null
          product_dimension_id?: string | null
          region_dimension_id?: string | null
          security_level?: string | null
          task_id?: string | null
          time_dimension_id: string
          transaction_timestamp?: string | null
          user_id?: string | null
          version_dimension_id?: string | null
        }
        Update: {
          datasource_dimension_id?: string | null
          id?: string
          layer_dimension_id?: string | null
          measure1?: number | null
          measure2?: number | null
          product_dimension_id?: string | null
          region_dimension_id?: string | null
          security_level?: string | null
          task_id?: string | null
          time_dimension_id?: string
          transaction_timestamp?: string | null
          user_id?: string | null
          version_dimension_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "t_planneddata_datasource_dimension_id_fkey"
            columns: ["datasource_dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_datasource"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "t_planneddata_layer_dimension_id_fkey"
            columns: ["layer_dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_layer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "t_planneddata_product_dimension_id_fkey"
            columns: ["product_dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "t_planneddata_region_dimension_id_fkey"
            columns: ["region_dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_region"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "t_planneddata_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "s_task_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "t_planneddata_time_dimension_id_fkey"
            columns: ["time_dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_time"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "t_planneddata_version_dimension_id_fkey"
            columns: ["version_dimension_id"]
            isOneToOne: false
            referencedRelation: "m_u_version"
            referencedColumns: ["id"]
          },
        ]
      }
      table_dimension_types: {
        Row: {
          attributes: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          table_name: string
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          table_name: string
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          table_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      table_locks: {
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
      table_metadata: {
        Row: {
          created_at: string | null
          id: string
          schema_definition: Json
          table_description: string | null
          table_name: string
          table_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          schema_definition: Json
          table_description?: string | null
          table_name: string
          table_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          schema_definition?: Json
          table_description?: string | null
          table_name?: string
          table_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      table_template: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          structure: Json
          template_name: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          structure: Json
          template_name: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          structure?: Json
          template_name?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: []
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

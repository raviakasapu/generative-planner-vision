export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      confg_business_logic_rules: {
        Row: {
          id: string
          rule_name: string
          rule_description: string | null
          rule_definition: Json
          version: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          rule_name: string
          rule_description?: string | null
          rule_definition: Json
          version?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          rule_name?: string
          rule_description?: string | null
          rule_definition?: Json
          version?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      table_locks: {
        Row: {
          resource_type: string
          resource_id: string
          user_id: string | null
          lock_timestamp: string | null
          expiry_timestamp: string | null
        }
        Insert: {
          resource_type: string
          resource_id: string
          user_id?: string | null
          lock_timestamp?: string | null
          expiry_timestamp?: string | null
        }
        Update: {
          resource_type?: string
          resource_id?: string
          user_id?: string | null
          lock_timestamp?: string | null
          expiry_timestamp?: string | null
        }
      }
      s_permissions: {
        Row: {
          id: string
          permission_name: string
          permission_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          permission_name: string
          permission_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          permission_name?: string
          permission_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      s_role_permissions: {
        Row: {
          role_id: string
          permission_id: string
          created_at: string | null
        }
        Insert: {
          role_id: string
          permission_id: string
          created_at?: string | null
        }
        Update: {
          role_id?: string
          permission_id?: string
          created_at?: string | null
        }
      }
      s_roles: {
        Row: {
          id: string
          role_name: string
          role_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          role_name: string
          role_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          role_name?: string
          role_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      s_task_assignments: {
        Row: {
          id: string
          user_id: string | null
          task_name: string
          task_description: string | null
          status: string
          due_date: string | null
          created_at: string | null
          updated_at: string | null
          approval_status: string | null
          approved_by: string | null
          approved_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          task_name: string
          task_description?: string | null
          status?: string
          due_date?: string | null
          created_at?: string | null
          updated_at?: string | null
          approval_status?: string | null
          approved_by?: string | null
          approved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          task_name?: string
          task_description?: string | null
          status?: string
          due_date?: string | null
          created_at?: string | null
          updated_at?: string | null
          approval_status?: string | null
          approved_by?: string | null
          approved_at?: string | null
        }
      }
      s_user_profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
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
          attributes1: string | null
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
          attributes1?: string | null
          created_at?: string | null
          description?: string | null
          dimension_name?: string
          dimension_type?: string
          hierarchy?: string | null
          id?: string
          identifier: string
          unique_identifier?: string;
          updated_at?: string | null
        }
        Update: {
          attributes1?: string | null
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
          time_dimension_id: string
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
            referencedRelation: "task_assignments"
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
      task_assignments: {
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

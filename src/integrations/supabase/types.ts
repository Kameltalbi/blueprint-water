export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_entries: {
        Row: {
          assessment_id: string
          calculated_blue: number
          calculated_green: number
          calculated_grey: number
          created_at: string
          id: string
          impact_factor_id: string
          quantity_input: number
          weighted_total: number
        }
        Insert: {
          assessment_id: string
          calculated_blue?: number
          calculated_green?: number
          calculated_grey?: number
          created_at?: string
          id?: string
          impact_factor_id: string
          quantity_input?: number
          weighted_total?: number
        }
        Update: {
          assessment_id?: string
          calculated_blue?: number
          calculated_green?: number
          calculated_grey?: number
          created_at?: string
          id?: string
          impact_factor_id?: string
          quantity_input?: number
          weighted_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_entries_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_entries_impact_factor_id_fkey"
            columns: ["impact_factor_id"]
            isOneToOne: false
            referencedRelation: "impact_factors"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          organization_id: string
          project_title: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          organization_id: string
          project_title: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          organization_id?: string
          project_title?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "water_stress_indices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      calculator_results: {
        Row: {
          blue_water: number
          country: string | null
          created_at: string
          green_water: number
          grey_water: number
          id: string
          per_unit: number
          product: string | null
          score: string | null
          sector: string
          total: number
          unit: string | null
          user_id: string | null
          volume: number | null
        }
        Insert: {
          blue_water?: number
          country?: string | null
          created_at?: string
          green_water?: number
          grey_water?: number
          id?: string
          per_unit?: number
          product?: string | null
          score?: string | null
          sector: string
          total?: number
          unit?: string | null
          user_id?: string | null
          volume?: number | null
        }
        Update: {
          blue_water?: number
          country?: string | null
          created_at?: string
          green_water?: number
          grey_water?: number
          id?: string
          per_unit?: number
          product?: string | null
          score?: string | null
          sector?: string
          total?: number
          unit?: string | null
          user_id?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      discharge_entries: {
        Row: {
          c_max: number
          c_nat: number
          concentration: number
          created_at: string
          discharge_type: string
          id: string
          organization_id: string
          pollutant: string
          unit: string
          user_id: string
          volume_m3: number
          wf_grey: number
        }
        Insert: {
          c_max?: number
          c_nat?: number
          concentration?: number
          created_at?: string
          discharge_type: string
          id?: string
          organization_id: string
          pollutant: string
          unit?: string
          user_id: string
          volume_m3?: number
          wf_grey?: number
        }
        Update: {
          c_max?: number
          c_nat?: number
          concentration?: number
          created_at?: string
          discharge_type?: string
          id?: string
          organization_id?: string
          pollutant?: string
          unit?: string
          user_id?: string
          volume_m3?: number
          wf_grey?: number
        }
        Relationships: [
          {
            foreignKeyName: "discharge_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_factors: {
        Row: {
          blue_water_factor: number
          category: string
          created_at: string
          green_water_factor: number
          grey_water_factor: number
          id: string
          name: string
          source_data: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          blue_water_factor?: number
          category: string
          created_at?: string
          green_water_factor?: number
          grey_water_factor?: number
          id?: string
          name: string
          source_data?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          blue_water_factor?: number
          category?: string
          created_at?: string
          green_water_factor?: number
          grey_water_factor?: number
          id?: string
          name?: string
          source_data?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          sector: string | null
          tva: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          sector?: string | null
          tva?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          sector?: string | null
          tva?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sites: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_chain_entries: {
        Row: {
          country: string | null
          created_at: string
          id: string
          material: string
          organization_id: string
          quantity: number
          supplier: string | null
          unit: string
          user_id: string
          water_factor: number
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          material: string
          organization_id: string
          quantity?: number
          supplier?: string | null
          unit?: string
          user_id: string
          water_factor?: number
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          material?: string
          organization_id?: string
          quantity?: number
          supplier?: string | null
          unit?: string
          user_id?: string
          water_factor?: number
        }
        Relationships: [
          {
            foreignKeyName: "supply_chain_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      water_consumption: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          period: string
          recorded_date: string
          site_id: string | null
          source: string
          usage: string
          user_id: string
          volume_m3: number
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          period: string
          recorded_date?: string
          site_id?: string | null
          source: string
          usage: string
          user_id: string
          volume_m3: number
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          period?: string
          recorded_date?: string
          site_id?: string | null
          source?: string
          usage?: string
          user_id?: string
          volume_m3?: number
        }
        Relationships: [
          {
            foreignKeyName: "water_consumption_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "water_consumption_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      water_stress_indices: {
        Row: {
          country: string
          created_at: string
          id: string
          region_name: string
          wsi_score: number
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          region_name: string
          wsi_score?: number
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          region_name?: string
          wsi_score?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization_with_admin: {
        Args: {
          _org_address: string
          _org_email: string
          _org_name: string
          _org_phone: string
          _user_id: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member", "viewer"],
    },
  },
} as const

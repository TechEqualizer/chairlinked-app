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
      admin_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          preview_image_url: string | null
          source_demo_id: string | null
          template_config: Json
          updated_at: string
          usage_count: number
        }
        Insert: {
          category?: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          preview_image_url?: string | null
          source_demo_id?: string | null
          template_config: Json
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          preview_image_url?: string | null
          source_demo_id?: string | null
          template_config?: Json
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "admin_templates_source_demo_id_fkey"
            columns: ["source_demo_id"]
            isOneToOne: false
            referencedRelation: "chairlinked_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      button_clicks: {
        Row: {
          button_label: string | null
          button_type: string
          clicked_at: string
          id: string
          referrer: string | null
          section: string | null
          site_id: string | null
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          button_label?: string | null
          button_type: string
          clicked_at?: string
          id?: string
          referrer?: string | null
          section?: string | null
          site_id?: string | null
          user_agent?: string | null
          visitor_id: string
        }
        Update: {
          button_label?: string | null
          button_type?: string
          clicked_at?: string
          id?: string
          referrer?: string | null
          section?: string | null
          site_id?: string | null
          user_agent?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "button_clicks_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "chairlinked_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      chairlinked_engagement: {
        Row: {
          comments: number
          created_at: string
          hearts: number
          id: string
          last_updated: string
          saves: number
          site_id: string | null
          traffic_score: number
        }
        Insert: {
          comments?: number
          created_at?: string
          hearts?: number
          id?: string
          last_updated?: string
          saves?: number
          site_id?: string | null
          traffic_score?: number
        }
        Update: {
          comments?: number
          created_at?: string
          hearts?: number
          id?: string
          last_updated?: string
          saves?: number
          site_id?: string | null
          traffic_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "chairlinked_engagement_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "chairlinked_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      chairlinked_sites: {
        Row: {
          admin_user_id: string | null
          business_name: string
          converted_at: string | null
          created_at: string
          customer_control_granted_at: string | null
          demo_engagement_score: number | null
          demo_expires_at: string | null
          demo_last_viewed: string | null
          demo_view_count: number | null
          form_data: Json
          generated_config: Json
          id: string
          lifecycle_stage:
            | Database["public"]["Enums"]["site_lifecycle_stage"]
            | null
          logo_url: string | null
          payment_completed_at: string | null
          payment_initiated_at: string | null
          prospect_email: string | null
          prospect_name: string | null
          shared_at: string | null
          site_slug: string
          site_type: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_user_id?: string | null
          business_name: string
          converted_at?: string | null
          created_at?: string
          customer_control_granted_at?: string | null
          demo_engagement_score?: number | null
          demo_expires_at?: string | null
          demo_last_viewed?: string | null
          demo_view_count?: number | null
          form_data: Json
          generated_config: Json
          id?: string
          lifecycle_stage?:
            | Database["public"]["Enums"]["site_lifecycle_stage"]
            | null
          logo_url?: string | null
          payment_completed_at?: string | null
          payment_initiated_at?: string | null
          prospect_email?: string | null
          prospect_name?: string | null
          shared_at?: string | null
          site_slug: string
          site_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_user_id?: string | null
          business_name?: string
          converted_at?: string | null
          created_at?: string
          customer_control_granted_at?: string | null
          demo_engagement_score?: number | null
          demo_expires_at?: string | null
          demo_last_viewed?: string | null
          demo_view_count?: number | null
          form_data?: Json
          generated_config?: Json
          id?: string
          lifecycle_stage?:
            | Database["public"]["Enums"]["site_lifecycle_stage"]
            | null
          logo_url?: string | null
          payment_completed_at?: string | null
          payment_initiated_at?: string | null
          prospect_email?: string | null
          prospect_name?: string | null
          shared_at?: string | null
          site_slug?: string
          site_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chairlinked_traffic: {
        Row: {
          first_visit: string
          id: string
          last_visit: string
          referrer: string | null
          site_id: string | null
          user_agent: string | null
          visit_count: number
          visitor_identifier: string
        }
        Insert: {
          first_visit?: string
          id?: string
          last_visit?: string
          referrer?: string | null
          site_id?: string | null
          user_agent?: string | null
          visit_count?: number
          visitor_identifier: string
        }
        Update: {
          first_visit?: string
          id?: string
          last_visit?: string
          referrer?: string | null
          site_id?: string | null
          user_agent?: string | null
          visit_count?: number
          visitor_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "chairlinked_traffic_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "chairlinked_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      customization_requests: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          customer_email: string
          customer_name: string
          description: string
          id: string
          priority: string | null
          site_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          description: string
          id?: string
          priority?: string | null
          site_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          description?: string
          id?: string
          priority?: string | null
          site_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customization_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customization_requests_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "chairlinked_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_prospect_leads: {
        Row: {
          business_details: string | null
          business_name: string | null
          claimed_at: string
          created_at: string
          demo_site_id: string
          email: string
          follow_up_status: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_details?: string | null
          business_name?: string | null
          claimed_at?: string
          created_at?: string
          demo_site_id: string
          email: string
          follow_up_status?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_details?: string | null
          business_name?: string | null
          claimed_at?: string
          created_at?: string
          demo_site_id?: string
          email?: string
          follow_up_status?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_prospect_leads_demo_site_id_fkey"
            columns: ["demo_site_id"]
            isOneToOne: true
            referencedRelation: "chairlinked_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_user_claims: {
        Row: {
          claimed_email: string
          created_at: string | null
          demo_site_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          claimed_email: string
          created_at?: string | null
          demo_site_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          claimed_email?: string
          created_at?: string | null
          demo_site_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_user_claims_demo_site_id_fkey"
            columns: ["demo_site_id"]
            isOneToOne: false
            referencedRelation: "chairlinked_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          brand_color: string
          business_name: string
          created_at: string
          cta_text: string
          custom_domain: string | null
          font: string | null
          id: string
          images: string[]
          industry: string
          logo_url: string | null
          published: boolean
          services: Json
          tagline: string
          user_id: string
        }
        Insert: {
          brand_color: string
          business_name: string
          created_at?: string
          cta_text: string
          custom_domain?: string | null
          font?: string | null
          id?: string
          images?: string[]
          industry: string
          logo_url?: string | null
          published?: boolean
          services?: Json
          tagline: string
          user_id: string
        }
        Update: {
          brand_color?: string
          business_name?: string
          created_at?: string
          cta_text?: string
          custom_domain?: string | null
          font?: string | null
          id?: string
          images?: string[]
          industry?: string
          logo_url?: string | null
          published?: boolean
          services?: Json
          tagline?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          payment_type: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_type: string
          status: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_type?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      site_lifecycle_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          from_stage: Database["public"]["Enums"]["site_lifecycle_stage"] | null
          id: string
          ip_address: string | null
          metadata: Json | null
          reason: string | null
          site_id: string
          to_stage: Database["public"]["Enums"]["site_lifecycle_stage"]
          user_agent: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          from_stage?:
            | Database["public"]["Enums"]["site_lifecycle_stage"]
            | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          reason?: string | null
          site_id: string
          to_stage: Database["public"]["Enums"]["site_lifecycle_stage"]
          user_agent?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          from_stage?:
            | Database["public"]["Enums"]["site_lifecycle_stage"]
            | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          reason?: string | null
          site_id?: string
          to_stage?: Database["public"]["Enums"]["site_lifecycle_stage"]
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_lifecycle_history_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "chairlinked_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          email: string
          id: string
          setup_fee_paid: boolean
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          email: string
          id?: string
          setup_fee_paid?: boolean
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          email?: string
          id?: string
          setup_fee_paid?: boolean
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_at: string | null
          invited_by: string
          status: string | null
          team_role: Database["public"]["Enums"]["team_role"] | null
        }
        Insert: {
          accepted_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by: string
          status?: string | null
          team_role?: Database["public"]["Enums"]["team_role"] | null
        }
        Update: {
          accepted_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string
          status?: string | null
          team_role?: Database["public"]["Enums"]["team_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          invited_by: string | null
          joined_at: string | null
          last_active: string | null
          permissions: Json | null
          status: string | null
          team_role: Database["public"]["Enums"]["team_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          last_active?: string | null
          permissions?: Json | null
          status?: string | null
          team_role?: Database["public"]["Enums"]["team_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          last_active?: string | null
          permissions?: Json | null
          status?: string | null
          team_role?: Database["public"]["Enums"]["team_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          last_login: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles_extended: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          phone: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          analytics_tracking: boolean | null
          auto_save_demos: boolean | null
          client_feedback_notifications: boolean | null
          created_at: string
          demo_views_notifications: boolean | null
          email_notifications: boolean | null
          id: string
          public_demo_urls: boolean | null
          team_updates_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_tracking?: boolean | null
          auto_save_demos?: boolean | null
          client_feedback_notifications?: boolean | null
          created_at?: string
          demo_views_notifications?: boolean | null
          email_notifications?: boolean | null
          id?: string
          public_demo_urls?: boolean | null
          team_updates_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_tracking?: boolean | null
          auto_save_demos?: boolean | null
          client_feedback_notifications?: boolean | null
          created_at?: string
          demo_views_notifications?: boolean | null
          email_notifications?: boolean | null
          id?: string
          public_demo_urls?: boolean | null
          team_updates_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          business_name: string
          categories: string[]
          content: Json
          created_at: string
          customization: Json
          description: string | null
          id: string
          industry: string
          logo_url: string | null
          status: string
          user_id: string
        }
        Insert: {
          business_name: string
          categories?: string[]
          content?: Json
          created_at?: string
          customization?: Json
          description?: string | null
          id?: string
          industry: string
          logo_url?: string | null
          status: string
          user_id: string
        }
        Update: {
          business_name?: string
          categories?: string[]
          content?: Json
          created_at?: string
          customization?: Json
          description?: string | null
          id?: string
          industry?: string
          logo_url?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_customer_subscription: {
        Args: { customer_email: string; reason?: string }
        Returns: Json
      }
      delete_customer_account: {
        Args: { customer_email: string }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_lifecycle_stage_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          stage: Database["public"]["Enums"]["site_lifecycle_stage"]
          count: number
          percentage: number
        }[]
      }
      has_team_permission: {
        Args: {
          user_uuid: string
          required_role: Database["public"]["Enums"]["team_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      reactivate_customer_subscription: {
        Args: { customer_email: string }
        Returns: Json
      }
      transition_multiple_sites_lifecycle: {
        Args: {
          site_ids: string[]
          target_stage: Database["public"]["Enums"]["site_lifecycle_stage"]
          reason?: string
        }
        Returns: Json
      }
      transition_site_lifecycle: {
        Args: {
          site_id: string
          new_stage: Database["public"]["Enums"]["site_lifecycle_stage"]
          reason?: string
          changed_by?: string
        }
        Returns: Json
      }
      validate_lifecycle_transition: {
        Args: {
          from_stage: Database["public"]["Enums"]["site_lifecycle_stage"]
          to_stage: Database["public"]["Enums"]["site_lifecycle_stage"]
          is_admin?: boolean
        }
        Returns: boolean
      }
    }
    Enums: {
      site_lifecycle_stage:
        | "draft"
        | "ready_to_share"
        | "shared"
        | "claimed"
        | "converting"
        | "customer_controlled"
        | "live_published"
      team_role:
        | "super_admin"
        | "admin"
        | "support"
        | "developer"
        | "marketing"
        | "viewer"
      user_role: "admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      site_lifecycle_stage: [
        "draft",
        "ready_to_share",
        "shared",
        "claimed",
        "converting",
        "customer_controlled",
        "live_published",
      ],
      team_role: [
        "super_admin",
        "admin",
        "support",
        "developer",
        "marketing",
        "viewer",
      ],
      user_role: ["admin", "customer"],
    },
  },
} as const

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
      companies: {
        Row: {
          address: string | null
          business_email: string | null
          business_phone: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          type: Database["public"]["Enums"]["company_type"]
          updated_at: string
          verification_status: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          business_email?: string | null
          business_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          type: Database["public"]["Enums"]["company_type"]
          updated_at?: string
          verification_status?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          business_email?: string | null
          business_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          type?: Database["public"]["Enums"]["company_type"]
          updated_at?: string
          verification_status?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_ticketing: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          price: number | null
          quantity: number | null
          status: string | null
          ticket_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          price?: number | null
          quantity?: number | null
          status?: string | null
          ticket_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          price?: number | null
          quantity?: number | null
          status?: string | null
          ticket_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_ticketing_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget: number | null
          budget_currency: string | null
          category: string | null
          company_id: string | null
          created_at: string
          date: string
          description: string | null
          end_date: string
          event_type: string | null
          expected_attendees: number | null
          id: string
          image_url: string | null
          is_flexible_date: boolean | null
          is_flexible_location: boolean | null
          location: string | null
          preferred_locations: string[] | null
          status: string | null
          timezone: string | null
          title: string
          user_id: string
          venue_type: string | null
        }
        Insert: {
          budget?: number | null
          budget_currency?: string | null
          category?: string | null
          company_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          end_date: string
          event_type?: string | null
          expected_attendees?: number | null
          id?: string
          image_url?: string | null
          is_flexible_date?: boolean | null
          is_flexible_location?: boolean | null
          location?: string | null
          preferred_locations?: string[] | null
          status?: string | null
          timezone?: string | null
          title: string
          user_id: string
          venue_type?: string | null
        }
        Update: {
          budget?: number | null
          budget_currency?: string | null
          category?: string | null
          company_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          end_date?: string
          event_type?: string | null
          expected_attendees?: number | null
          id?: string
          image_url?: string | null
          is_flexible_date?: boolean | null
          is_flexible_location?: boolean | null
          location?: string | null
          preferred_locations?: string[] | null
          status?: string | null
          timezone?: string | null
          title?: string
          user_id?: string
          venue_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_events_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_recipients: {
        Row: {
          contact_id: string
          created_at: string
          delivery_method: string
          id: string
          invitation_id: string
          rsvp_status: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          delivery_method: string
          id?: string
          invitation_id: string
          rsvp_status?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          delivery_method?: string
          id?: string
          invitation_id?: string
          rsvp_status?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_recipients_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_recipients_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_templates: {
        Row: {
          created_at: string
          description: string | null
          event_type: string
          id: string
          name: string
          template_html: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          name: string
          template_html: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          name?: string
          template_html?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          template_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string
          template_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invitation_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_clients: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          theme_colors: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          theme_colors?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          theme_colors?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      marketplace_preferred_vendors: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          marketplace_client_id: string
          vendor_service_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          marketplace_client_id: string
          vendor_service_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          marketplace_client_id?: string
          vendor_service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_preferred_vendors_marketplace_client_id_fkey"
            columns: ["marketplace_client_id"]
            isOneToOne: false
            referencedRelation: "marketplace_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_preferred_vendors_vendor_service_id_fkey"
            columns: ["vendor_service_id"]
            isOneToOne: false
            referencedRelation: "vendor_services"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_preferred_venues: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          marketplace_client_id: string
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          marketplace_client_id: string
          venue_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          marketplace_client_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_preferred_venues_marketplace_client_id_fkey"
            columns: ["marketplace_client_id"]
            isOneToOne: false
            referencedRelation: "marketplace_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_preferred_venues_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_purchases: {
        Row: {
          created_at: string
          id: string
          purchaser_email: string
          purchaser_name: string
          quantity: number
          status: string | null
          ticket_id: string
          total_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          purchaser_email: string
          purchaser_name: string
          quantity: number
          status?: string | null
          ticket_id: string
          total_amount: number
        }
        Update: {
          created_at?: string
          id?: string
          purchaser_email?: string
          purchaser_name?: string
          quantity?: number
          status?: string | null
          ticket_id?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_purchases_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "event_ticketing"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_sales: {
        Row: {
          id: string
          notes: string | null
          payment_reference: string | null
          purchase_date: string
          purchaser_email: string
          purchaser_name: string
          quantity: number
          status: string | null
          ticket_type_id: string
          total_price: number
        }
        Insert: {
          id?: string
          notes?: string | null
          payment_reference?: string | null
          purchase_date?: string
          purchaser_email: string
          purchaser_name: string
          quantity: number
          status?: string | null
          ticket_type_id: string
          total_price: number
        }
        Update: {
          id?: string
          notes?: string | null
          payment_reference?: string | null
          purchase_date?: string
          purchaser_email?: string
          purchaser_name?: string
          quantity?: number
          status?: string | null
          ticket_type_id?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_sales_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_types: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          is_unlimited: boolean | null
          name: string
          price: number | null
          quantity: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          is_unlimited?: boolean | null
          name: string
          price?: number | null
          quantity?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          is_unlimited?: boolean | null
          name?: string
          price?: number | null
          quantity?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          contact_number: string | null
          created_at: string
          dob: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          middle_name: string | null
          name_suffix: string | null
          stripe_account_id: string | null
          user_type: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          contact_number?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          middle_name?: string | null
          name_suffix?: string | null
          stripe_account_id?: string | null
          user_type?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          contact_number?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          name_suffix?: string | null
          stripe_account_id?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_services: {
        Row: {
          city: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          price_range_end: number | null
          price_range_start: number | null
          updated_at: string
          zipcode: string | null
        }
        Insert: {
          city?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price_range_end?: number | null
          price_range_start?: number | null
          updated_at?: string
          zipcode?: string | null
        }
        Update: {
          city?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price_range_end?: number | null
          price_range_start?: number | null
          updated_at?: string
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          amenities: Json | null
          availability: Json | null
          booking_policy: string | null
          cancellation_policy: string | null
          capacity: number | null
          city: string
          company_id: string
          created_at: string
          id: string
          indoor_space_sqft: number | null
          location: string | null
          name: string
          outdoor_space_sqft: number | null
          updated_at: string
          zipcode: string | null
        }
        Insert: {
          amenities?: Json | null
          availability?: Json | null
          booking_policy?: string | null
          cancellation_policy?: string | null
          capacity?: number | null
          city: string
          company_id: string
          created_at?: string
          id?: string
          indoor_space_sqft?: number | null
          location?: string | null
          name: string
          outdoor_space_sqft?: number | null
          updated_at?: string
          zipcode?: string | null
        }
        Update: {
          amenities?: Json | null
          availability?: Json | null
          booking_policy?: string | null
          cancellation_policy?: string | null
          capacity?: number | null
          city?: string
          company_id?: string
          created_at?: string
          id?: string
          indoor_space_sqft?: number | null
          location?: string | null
          name?: string
          outdoor_space_sqft?: number | null
          updated_at?: string
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_user_by_email: {
        Args: { target_email: string }
        Returns: boolean
      }
      admin_delete_user_by_id: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      delete_current_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_user_with_data: {
        Args: { user_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_venue_available: {
        Args: { venue_id: string; check_date: string }
        Returns: boolean
      }
      update_event_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "super_admin"
      company_type: "event_planner" | "venue" | "vendor"
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
      app_role: ["admin", "moderator", "user", "super_admin"],
      company_type: ["event_planner", "venue", "vendor"],
    },
  },
} as const

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
          user_type: string | null
        }
        Insert: {
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
          user_type?: string | null
        }
        Update: {
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
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          price_range_end: number | null
          price_range_start: number | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price_range_end?: number | null
          price_range_start?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price_range_end?: number | null
          price_range_start?: number | null
          updated_at?: string
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
          city: string | null
          company_id: string
          created_at: string
          id: string
          indoor_space_sqft: number | null
          location: string | null
          name: string
          outdoor_space_sqft: number | null
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          availability?: Json | null
          booking_policy?: string | null
          cancellation_policy?: string | null
          capacity?: number | null
          city?: string | null
          company_id: string
          created_at?: string
          id?: string
          indoor_space_sqft?: number | null
          location?: string | null
          name: string
          outdoor_space_sqft?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          availability?: Json | null
          booking_policy?: string | null
          cancellation_policy?: string | null
          capacity?: number | null
          city?: string | null
          company_id?: string
          created_at?: string
          id?: string
          indoor_space_sqft?: number | null
          location?: string | null
          name?: string
          outdoor_space_sqft?: number | null
          updated_at?: string
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
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_venue_available: {
        Args: {
          venue_id: string
          check_date: string
        }
        Returns: boolean
      }
      update_event_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      company_type: "event_planner" | "venue" | "vendor"
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

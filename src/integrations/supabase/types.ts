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
      company_members: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          date: string
          description: string | null
          end_date: string
          expected_attendees: number | null
          id: string
          image_url: string | null
          location: string | null
          price: number | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          date: string
          description?: string | null
          end_date: string
          expected_attendees?: number | null
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          end_date?: string
          expected_attendees?: number | null
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_events_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
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
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
          booking_policy: string | null
          cancellation_policy: string | null
          capacity: number | null
          company_id: string
          created_at: string
          id: string
          indoor_space_sqft: number | null
          name: string
          outdoor_space_sqft: number | null
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          booking_policy?: string | null
          cancellation_policy?: string | null
          capacity?: number | null
          company_id: string
          created_at?: string
          id?: string
          indoor_space_sqft?: number | null
          name: string
          outdoor_space_sqft?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          booking_policy?: string | null
          cancellation_policy?: string | null
          capacity?: number | null
          company_id?: string
          created_at?: string
          id?: string
          indoor_space_sqft?: number | null
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
      is_company_admin: {
        Args: {
          _user_id: string
          _company_id: string
        }
        Returns: boolean
      }
      is_company_member: {
        Args: {
          _user_id: string
          _company_id: string
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

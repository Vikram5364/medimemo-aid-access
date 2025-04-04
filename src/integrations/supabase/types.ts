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
      allergies: {
        Row: {
          created_at: string
          id: string
          name: string
          severity: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          severity?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          category: string | null
          created_at: string
          date: string
          description: string | null
          file_size: number | null
          file_url: string | null
          id: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhaar: string | null
          address: string | null
          blood_group: string | null
          contact: string | null
          created_at: string
          dob: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_number: string | null
          emergency_contact_relation: string | null
          gender: string | null
          height: number | null
          id: string
          name: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          aadhaar?: string | null
          address?: string | null
          blood_group?: string | null
          contact?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          emergency_contact_relation?: string | null
          gender?: string | null
          height?: number | null
          id: string
          name?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          aadhaar?: string | null
          address?: string | null
          blood_group?: string | null
          contact?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          emergency_contact_relation?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          name?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

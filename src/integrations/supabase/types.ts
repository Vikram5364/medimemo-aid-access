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
      problems: {
        Row: {
          category: string[]
          description: string
          difficulty: string
          id: number
          link: string | null
          title: string
        }
        Insert: {
          category: string[]
          description: string
          difficulty: string
          id: number
          link?: string | null
          title: string
        }
        Update: {
          category?: string[]
          description?: string
          difficulty?: string
          id?: number
          link?: string | null
          title?: string
        }
        Relationships: []
      }
      problems_solved: {
        Row: {
          completed_at: string
          id: string
          problem_id: number
          solution: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          problem_id: number
          solution?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          problem_id?: number
          solution?: string | null
          user_id?: string
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
      user_statistics: {
        Row: {
          easy_solved: number
          hard_solved: number
          id: string
          last_active_date: string
          medium_solved: number
          problems_solved: number
          streak_days: number
          user_id: string
        }
        Insert: {
          easy_solved?: number
          hard_solved?: number
          id?: string
          last_active_date?: string
          medium_solved?: number
          problems_solved?: number
          streak_days?: number
          user_id: string
        }
        Update: {
          easy_solved?: number
          hard_solved?: number
          id?: string
          last_active_date?: string
          medium_solved?: number
          problems_solved?: number
          streak_days?: number
          user_id?: string
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
    Enums: {},
  },
} as const

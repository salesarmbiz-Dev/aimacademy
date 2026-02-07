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
      assessment_answers: {
        Row: {
          attempt_id: string
          created_at: string | null
          id: string
          is_correct: boolean | null
          question_id: string
          time_spent_seconds: number | null
          user_answer: string | null
        }
        Insert: {
          attempt_id: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id: string
          time_spent_seconds?: number | null
          user_answer?: string | null
        }
        Update: {
          attempt_id?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string
          time_spent_seconds?: number | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "assessment_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_attempts: {
        Row: {
          assessment_type: string
          completed_at: string | null
          correct_answers: number | null
          created_at: string | null
          id: string
          max_score: number
          percentage: number | null
          skill_scores: Json | null
          started_at: string | null
          status: string | null
          time_spent_seconds: number | null
          total_questions: number
          total_score: number | null
          user_id: string
        }
        Insert: {
          assessment_type: string
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          max_score: number
          percentage?: number | null
          skill_scores?: Json | null
          started_at?: string | null
          status?: string | null
          time_spent_seconds?: number | null
          total_questions: number
          total_score?: number | null
          user_id: string
        }
        Update: {
          assessment_type?: string
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          max_score?: number
          percentage?: number | null
          skill_scores?: Json | null
          started_at?: string | null
          status?: string | null
          time_spent_seconds?: number | null
          total_questions?: number
          total_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: string
          explanation: string | null
          explanation_th: string | null
          id: string
          is_active: boolean | null
          options: Json
          points: number | null
          question_text: string
          question_text_th: string
          question_type: string
          skill_category: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty: string
          explanation?: string | null
          explanation_th?: string | null
          id?: string
          is_active?: boolean | null
          options: Json
          points?: number | null
          question_text: string
          question_text_th: string
          question_type: string
          skill_category: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: string
          explanation?: string | null
          explanation_th?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          points?: number | null
          question_text?: string
          question_text_th?: string
          question_type?: string
          skill_category?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_type: string
          created_at: string | null
          description: string | null
          id: string
          issued_at: string | null
          metadata: Json | null
          skills_snapshot: Json | null
          title: string
          user_id: string
          user_name: string
          verify_code: string
        }
        Insert: {
          certificate_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          skills_snapshot?: Json | null
          title: string
          user_id: string
          user_name: string
          verify_code: string
        }
        Update: {
          certificate_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          issued_at?: string | null
          metadata?: Json | null
          skills_snapshot?: Json | null
          title?: string
          user_id?: string
          user_name?: string
          verify_code?: string
        }
        Relationships: []
      }
      demo_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      demo_assessment_attempts: {
        Row: {
          assessment_type: string
          completed_at: string | null
          correct_answers: number | null
          created_at: string | null
          id: string
          max_score: number
          percentage: number | null
          skill_scores: Json | null
          started_at: string | null
          status: string | null
          time_spent_seconds: number | null
          total_questions: number
          total_score: number | null
          user_id: string
        }
        Insert: {
          assessment_type: string
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          max_score: number
          percentage?: number | null
          skill_scores?: Json | null
          started_at?: string | null
          status?: string | null
          time_spent_seconds?: number | null
          total_questions: number
          total_score?: number | null
          user_id: string
        }
        Update: {
          assessment_type?: string
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string | null
          id?: string
          max_score?: number
          percentage?: number | null
          skill_scores?: Json | null
          started_at?: string | null
          status?: string | null
          time_spent_seconds?: number | null
          total_questions?: number
          total_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      demo_users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string
          id: string
          is_demo: boolean | null
          level: number | null
          org_id: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          is_demo?: boolean | null
          level?: number | null
          org_id?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          is_demo?: boolean | null
          level?: number | null
          org_id?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_users_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          id: string
          joined_at: string | null
          org_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          org_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          org_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          admin_user_id: string
          created_at: string | null
          id: string
          invite_code: string
          is_demo: boolean | null
          logo_url: string | null
          max_members: number | null
          name: string
          plan: string | null
          updated_at: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          id?: string
          invite_code: string
          is_demo?: boolean | null
          logo_url?: string | null
          max_members?: number | null
          name: string
          plan?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          id?: string
          invite_code?: string
          is_demo?: boolean | null
          logo_url?: string | null
          max_members?: number | null
          name?: string
          plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          marketing_consent: boolean | null
          marketing_consent_at: string | null
          privacy_accepted: boolean
          privacy_accepted_at: string | null
          terms_accepted: boolean
          terms_accepted_at: string | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          marketing_consent?: boolean | null
          marketing_consent_at?: string | null
          privacy_accepted?: boolean
          privacy_accepted_at?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          marketing_consent?: boolean | null
          marketing_consent_at?: string | null
          privacy_accepted?: boolean
          privacy_accepted_at?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_game_progress: {
        Row: {
          attempts: number | null
          best_score: number | null
          created_at: string
          first_played_at: string | null
          game_id: string
          id: string
          last_played_at: string | null
          status: Database["public"]["Enums"]["game_status"] | null
          total_time_seconds: number | null
          updated_at: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          attempts?: number | null
          best_score?: number | null
          created_at?: string
          first_played_at?: string | null
          game_id: string
          id?: string
          last_played_at?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          total_time_seconds?: number | null
          updated_at?: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          attempts?: number | null
          best_score?: number | null
          created_at?: string
          first_played_at?: string | null
          game_id?: string
          id?: string
          last_played_at?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          total_time_seconds?: number | null
          updated_at?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org_id: { Args: { _user_id: string }; Returns: string }
      is_org_admin_or_manager: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      game_status: "locked" | "unlocked" | "in_progress" | "completed"
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
      game_status: ["locked", "unlocked", "in_progress", "completed"],
    },
  },
} as const
